/**
 * MACHA-AI CORE v3.0.7
 * Engineered by DJ MACHA 255
 */
require('./settings');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, delay } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require('fs');
const chalk = require('chalk');
const NodeCache = require("node-cache");
const readline = require("readline"); // Kwa ajili ya kuuliza namba kwenye terminal
const settings = require('./settings');

const store = require('./lib/lightweight_store');
store.readFromFile();
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startMachaBot() {
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, // Tunatumia Pairing Code badala ya QR
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        browser: ["MACHA-AI", "Ubuntu", "3.0"],
        getMessage: async (key) => {
            const jid = jidNormalizedUser(key.remoteJid);
            const msg = await store.loadMessage(jid, key.id);
            return msg?.message || "";
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);

    // PAIRING CODE LOGIC: Kama hakuna session, bot inakuomba namba
    if (!sock.authState.creds.registered) {
        console.log(chalk.yellow("🌿 No session found. Initiating pairing process..."));
        let phoneNumber = await question(chalk.green("Enter your WhatsApp number (e.g., 255612801118): "));
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

        let code = await sock.requestPairingCode(phoneNumber);
        console.log(chalk.cyan.bold("Your Pairing Code is: "), chalk.white.bold(code));
    }

    // CENTRAL COMMAND HANDLER
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
            console.error(chalk.red("Handler Error:"), err);
        }
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') console.log(chalk.magenta.bold(`\n🌿 MACHA-AI CORE CONNECTED`));
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startMachaBot();
        }
    });
}

startMachaBot();
