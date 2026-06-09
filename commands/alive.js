const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
    try {
        // 1. Piga reaction ya kijani (Online) kuonyesha bot ipo macho papo hapo
        try { 
            await sock.sendMessage(chatId, { react: { text: '🟢', key: message.key } }); 
        } catch (e) {}

        // Mahesabu ya Uptime (Muda ambao bot imekuwa active kwenye panel)
        const uptimeSeconds = process.uptime();
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const uptimeString = `${hours}h ${minutes}m`;

        // Muonekano mpya na wa kisasa wa ALIVE uliosheeni vionjo vya kijasusi
        const message1 = 
`╭━━━ • 🎧 *${settings.botName || '𝖬𝖠𝖢𝖧𝖠-𝖠𝖨 𝖲𝖴𝖯𝖤𝖱 𝖡𝖮𝖳'}* • ━━━╮
┃
┃ 🟢 *𝖲𝖳𝖠𝖳𝖴𝖲:* Online & Active
┃ ⚙️ *𝖵𝖤𝖱𝖲𝖨𝖮𝖭:* ${settings.version || '3.0.0'}
┃ ⏱us *𝖴𝖯𝖳𝖨𝖬𝖤:* ${uptimeString}
┃ 👤 *𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖤𝖱:* ${settings.botOwner || 'DJ MACHA 255'}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

┌───『 🌟 *𝖥𝖤𝖠𝖳𝖴𝖱𝖤𝖲 𝖠𝖢𝖳𝖨𝖵𝖤* 』
│
│ 👥 Group Management Hub
│ 🛡️ Antilink Cyber Protection
│ 🎯 Fun & Romance Commands
│ 🧠 AI Engines Active
│
└─────────────────────────┈⊷

💬 _Andika *.menu* au *.help* ili kuona orodha kamili ya amri zote._

🎧 *𝖯𝖮𝖶𝖤𝖱𝖤𝖣 𝖡𝖸 𝖣𝖱𝖨𝖵𝖤 𝖬𝖠𝖢𝖧𝖠 𝖢𝖮𝖱𝖤*`;

        // 2. Tuma ujumbe ukiwa na ile badge safi ya Channel yako juu yake
        await sock.sendMessage(chatId, {
            text: message1,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: '𝖬𝖠𝖢𝖧𝖠-𝖡𝖮𝖴𝖭𝖣 𝖲𝖴𝖯𝖤𝖱 𝖠𝖨',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
        
    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: '⚡ Bot is alive and running smoothly!' }, { quoted: message });
    }
}

module.exports = aliveCommand;
