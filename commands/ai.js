const axios = require('axios');

module.exports = async (sock, chatId, message) => {
    try {
        // 1. Kagua na utoe Prompt (Maandishi aliyoandika mtumiaji baada ya .ai)
        const rawText = message.message?.conversation || 
                        message.message?.extendedTextMessage?.text || 
                        message.message?.imageMessage?.caption || "";
                        
        const args = rawText.trim().split(/\s+/);
        const prompt = args.slice(1).join(' ');

        // Kama mtumiaji amepiga .ai kavu bila kuuliza swali
        if (!prompt) {
            const upungufuWaData = `🎧 *𝖣𝖩 𝖬𝖠𝖢𝖧𝖠 255* ⚡\n\n` +
                                   `⚠️ *𝖬𝖠𝖢𝖧𝖠-𝖠𝖨 𝖤𝖱𝖱𝖮𝖱*\n` +
                                   `Hujaiweka hoja ya kuuliza kwenye akili mnemba.\n\n` +
                                   `💡 *𝖬𝖿𝖺𝗇𝗈:* \`.ai mambo vipi\` au \`.ai nini maana ya OSINT?\``;
            
            await sock.sendMessage(chatId, { text: upungufuWaData }, { quoted: message });
            return;
        }

        // 2. Piga reaction ya "Akili/Ubongo" kuonyesha bot inafikiri
        try { 
            await sock.sendMessage(chatId, { react: { text: '🧠', key: message.key } }); 
        } catch (e) {}

        // 3. Tuma ombi kwenda kwenye AI Server (Hapa tunatumia API imara ya bure)
        const response = await axios.get(`https://api.sandipbbaruwal.onrender.com/gpt?query=${encodeURIComponent(prompt)}`);
        const aiAnswer = response.data.message || response.data.answer || response.data.result;

        if (!aiAnswer) {
            throw new Error("Server haikurudisha jibu halali.");
        }

        // 4. Muundo mpya wa kisasa wa jibu la AI
        const jibuKamili = `🤖 *𝖬𝖠𝖢𝖧𝖠-𝖠𝖨 𝖱𝖤𝖲𝖯𝖮𝖭𝖲𝖤* ⚡\n` +
                           `╭────────────────────────┈⊷\n` +
                           `│ 📥 *𝖰𝗎𝖾𝗋𝖸:* _${prompt}_\n` +
                           `╰────────────────────────┈⊷\n\n` +
                           `${aiAnswer}\n\n` +
                           `🎧 *𝖯𝗈𝖶𝖤𝖱𝖤𝖣 𝖡𝖸 𝖣𝖱𝖨𝖵𝖤 𝖬𝖠𝖢𝖧𝖠 𝖢𝖮𝖱𝖤*`;

        // 5. Tuma jibu likiwa na muhuri wa Channel yako ya WhatsApp juu yake
        await sock.sendMessage(chatId, {
            text: jibuKamili,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: '𝖬𝖠𝖢𝖧𝖠-𝖡𝖮𝖴𝖭𝖣 𝖲𝖴𝖯𝖤𝖱 𝖠𝖨',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('AI Command Error:', error);
        
        // Jibu la dharura kama API ikizingua au mtandao ukikata
        const jibuLaDharura = `🎧 *𝖣𝖩 𝖬𝖠𝖢𝖧𝖠 255* ⚡\n\n` +
                              `❌ *𝖠𝖨 𝖲𝖤𝖱𝖵𝖤𝖱 𝖮𝖥𝖥𝖫𝖨 tomb*\n` +
                              `Mifumo ya akili mnemba imepata hitilafu ya muda kidogo. Jaribu tena baada ya sekunde chache.`;
                              
        await sock.sendMessage(chatId, { text: jibuLaDharura }, { quoted: message });
    }
};
