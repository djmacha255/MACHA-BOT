/**
 * MACHA-BOT - Official
 * (Ilisafishwa kwa ajili ya Hosting Panel)
 */
require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const { smsg } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const { rmSync } = require('fs')
const store = require('./lib/lightweight_store')

store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

async function startXeonBotInc() {
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const { version } = await fetchLatestBaileysVersion()
    
    const XeonBotInc = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, // Imebadilishwa kwa ajili ya Hosting
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        }
    })

    XeonBotInc.ev.on('creds.update', saveCreds)
    store.bind(XeonBotInc.ev)

    // --- HI HAPA NDIO SEHEMU ILIYOKUWA INASABABISHA SHIDA ---
    // Nimeunganisha kila kitu kwenye sehemu MOJA ya messages.upsert
    XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            
            // Handle Status
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await handleStatus(XeonBotInc, chatUpdate);
                return;
            }

            // Hapa ndipo amri zako zinasomwa
            await handleMessages(XeonBotInc, chatUpdate, true)
            
        } catch (err) {
            console.error("Error in messages.upsert:", err)
        }
    })

    // --- NYINGINE ZOTE ZIMEBAKI VIZURI ---
    XeonBotInc.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipantUpdate(XeonBotInc, update);
    });

    XeonBotInc.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s
        if (connection === 'open') {
            console.log(chalk.green('✅ MACHA-BOT Connected Successfully!'))
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) startXeonBotInc()
        }
    })

    return XeonBotInc
}

startXeonBotInc().catch(err => console.log(err))
