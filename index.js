/**
 * MACHA-AI CORE v3.1.0
 * Engineered by DJ MACHA 255
 */
require('./settings');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore, 
    jidNormalizedUser 
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require('fs');
const chalk = require('chalk');
const { handleMessages, handleStatus, handleGroupParticipantUpdate } = require('./main');
const store = require('./lib/lightweight_store');

// Initialize Store
store.readFromFile();
setInterval(() => store.writeToFile(), 10000);

async function startMachaBot() {
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true, // Itatoa QR moja kwa moja
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        browser: ["MACHA-AI", "DJ MACHA 255", "3.0"],
        getMessage: async (key) => {
            const jid = jidNormalizedUser(key.remoteJid);
            const msg = await store.loadMessage(jid, key.id);
            return msg?.message || "";
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);

    // CENTRAL MESSAGE HANDLER
    sock.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;

            // Log ujumbe unaoingia kwa debugging (Itaonekana kwenye terminal)
            const from = mek.key.remoteJid;
            console.log(chalk.blue(`[MACHA-AI] Incoming message from: ${from}`));

            // Handling Status
            if (from === 'status@broadcast') {
                await handleStatus(sock, chatUpdate);
                return;
            }

            // Hii ndiyo sehemu inayopaswa kuitisha amri zako kutoka main.js
            await handleMessages(sock, chatUpdate, true);

        } catch (err) {
            console.error(chalk.red("Error in messages.upsert:"), err);
        }
    });

    // Group Updates
    sock.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipantUpdate(sock, update);
    });

    // Connection Updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'open') {
            console.log(chalk.magenta.bold(`\n🌿 DJ MACHA 255 -> MACHA-AI CORE IS ONLINE ⚡`));
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log(chalk.yellow("Muunganisho umekatika... Inajaribu kuunganisha upya."));
                startMachaBot();
            } else {
                console.log(chalk.red("Akaunti imetoka (Logged Out). Tafadhali futa folda ya 'session' na uunganishe upya."));
            }
        }
    });
}

// Start
startMachaBot().catch(err => console.error(chalk.red("Fatal Error:"), err));

// Hii inazuia bot kufa ghafla ikipata error
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
