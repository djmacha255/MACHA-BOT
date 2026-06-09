/**
 * MACHA-AI CORE v3.0.7
 * Engineered by DJ MACHA 255
 */
require('./settings');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore, 
    jidNormalizedUser,
    delay 
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require('fs');
const chalk = require('chalk');
const settings = require('./settings');

// Initialize Store
const store = require('./lib/lightweight_store');
store.readFromFile();
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000);

async function startMachaBot() {
    // 1. Session Initialization
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        browser: ["Chrome (Linux)", "Chrome", "121.0.6167.160"], // Browser imara
        getMessage: async (key) => {
            const jid = jidNormalizedUser(key.remoteJid);
            const msg = await store.loadMessage(jid, key.id);
            return msg?.message || "";
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);

    // 2. Optimized Pairing Sequence
    if (!sock.authState.creds.registered) {
        await delay(3000); // Subiri kidogo kabla ya kuomba code
        console.log(chalk.yellow("\n🌿 Initializing secure handshake..."));
        
        try {
            let phoneNumber = settings.ownerNumber.replace(/[^0-9]/g, '');
            let code = await sock.requestPairingCode(phoneNumber);
            
            console.log(chalk.cyan.bold("\n===================================="));
            console.log(chalk.cyan.bold("✅ YOUR PAIRING CODE IS: "), chalk.white.bold(code));
            console.log(chalk.cyan.bold("====================================\n"));
        } catch (err) {
            console.log(chalk.red("❌ Critical Pairing Error. Check your number in settings.js"), err);
        }
    }

    // 3. Command Handler
    sock.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;
            
            const body = mek.message.conversation || mek.message.extendedTextMessage?.text || "";
            const prefix = settings.prefix || ".";

            if (body.startsWith(prefix)) {
                const args = body.slice(prefix.length).trim().split(/ +/);
                const command = args.shift().toLowerCase();
                const cmdPath = `./commands/${command}.js`;
                
                if (fs.existsSync(cmdPath)) {
                    await require(cmdPath)(sock, mek.key.remoteJid, mek);
                }
            }
        } catch (err) {
            console.error(chalk.red("Command Handler Error:"), err);
        }
    });

    // 4. Robust Connection Handling
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'open') {
            console.log(chalk.magenta.bold(`\n🌿 MACHA-AI CORE CONNECTED SUCCESSFULLY ⚡`));
        }
        
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            
            if (statusCode === 401 || statusCode === 403) {
                console.log(chalk.red("Session invalid, clearing folder..."));
                fs.rmSync('./session', { recursive: true, force: true });
            }
            
            if (shouldReconnect) {
                console.log(chalk.yellow("Reconnecting..."));
                startMachaBot();
            }
        }
    });
}

startMachaBot().catch(err => {
    console.error("Fatal Error:", err);
    process.exit(1);
});
