const fs = require('fs');
const path = require('path');
const { handleAutotypingForMessage } = require('./commands/autotyping');
const { handleAutoread } = require('./commands/autoread');
const { storeMessage } = require('./commands/antidelete');
const { Antilink } = require('./lib/antilink');

async function handleMessages(sock, messageUpdate) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;
        const message = messages[0];
        if (!message?.message || message.key.fromMe) return;

        const chatId = message.key.remoteJid;
        const userMessage = (message.message?.conversation || message.message?.extendedTextMessage?.text || '').toLowerCase().trim();

        // 1. Autoread & Anti-delete
        await handleAutoread(sock, message);
        storeMessage(sock, message);

        // 2. Command Handler (Inatumia file system kusoma command zako)
        if (userMessage.startsWith('.')) {
            const args = userMessage.slice(1).trim().split(/ +/);
            const cmdName = args.shift().toLowerCase();
            
            // Tunatafuta file lenye jina la hiyo command
            const cmdPath = path.join(__dirname, 'commands', `${cmdName}.js`);

            if (fs.existsSync(cmdPath)) {
                console.log(`🚀 Executing: .${cmdName}`);
                // Hapa tunai-load command bila kuhitaji module.exports
                require(cmdPath)(sock, chatId, message, args);
            } else {
                await sock.sendMessage(chatId, { text: `❌ Amri *${cmdName}* haipo.` });
            }
            return;
        }

        // 3. Security
        if (chatId.endsWith('@g.us')) await Antilink(message, sock);
        await handleAutotypingForMessage(sock, chatId, userMessage);

    } catch (err) {
        console.error("Main Handler Error:", err);
    }
}

module.exports = { handleMessages };
