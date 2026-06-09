const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    // Mahesabu ya Muda Bot ipo hewani (Uptime)
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const uptimeString = `${hours}h ${minutes}m`;

    // Tarehe ya leo
    const leo = new Date().toLocaleDateString('en-GB');

    const helpMessage = 
`╭━━━ • 🎧 *${settings.botName || '𝖬𝖠𝖢𝖧𝖠-𝖠𝖨 𝖲𝖴𝖯𝖤𝖱 𝖡𝖮𝖳'}* • ━━━╮
┃
┃ 👤 *𝖮𝖶𝖭𝖤𝖱:* ${settings.botOwner || 'DJ MACHA 255'}
┃ ⚙️ *𝖵𝖤𝖱𝖲𝖨𝖮𝖭:* ${settings.version || '3.0.0'}
┃ 📅 *𝖣𝖠𝖳𝖤:* ${leo}
┃ ⏱️ *𝖴𝖯𝖳𝖨𝖬𝖤:* ${uptimeString}
┃ 📺 *𝖸𝖳:* ${global.ytch || '🎧 DJ MACHA 255'}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

┌───『 🕵️‍♂️ *𝖢𝖸𝖡𝖤𝖱 & 𝖮𝖲𝖨𝖭𝖳 𝖲𝖴𝖨𝖳𝖤* 』
│
│ ➤ .iplookup <IP/Domain>
│ ➤ .hash <md5/sha256> <text>
│ ➤ .hostcheck <domain>
│
└─────────────────────────┈⊷

┌───『 🌐 *𝖦𝖤𝖭𝖤𝖱𝖠𝖫 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲* 』
│
│ ➤ .help / .menu
│ ➤ .ping
│ ➤ .alive
│ ➤ .tts <text>
│ ➤ .owner
│ ➤ .joke
│ ➤ .quote
│ ➤ .fact
│ ➤ .weather <city>
│ ➤ .news
│ ➤ .attp <text>
│ ➤ .lyrics <song_title>
│ ➤ .8ball <question>
│ ➤ .groupinfo
│ ➤ .staff / .admins
│ ➤ .vv
│ ➤ .trt <text> <lang>
│ ➤ .ss <link>
│ ➤ .jid
│ ➤ .url
│
└─────────────────────────┈⊷

┌───『 👮‍♂️ *𝖠𝖣𝖬𝖨𝖭 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲* 』
│
│ ➤ .ban @user
│ ➤ .promote @user
│ ➤ .demote @user
│ ➤ .mute <minutes>
│ ➤ .unmute
│ ➤ .delete / .del
│ ➤ .kick @user
│ ➤ .warnings @user
│ ➤ .warn @user
│ ➤ .antilink
│ ➤ .antibadword
│ ➤ .clear
│ ➤ .tag <message>
│ ➤ .tagall
│ ➤ .tagnotadmin
│ ➤ .hidetag <message>
│ ➤ .chatbot
│ ➤ .resetlink
│ ➤ .antitag <on/off>
│ ➤ .welcome <on/off>
│ ➤ .goodbye <on/off>
│ ➤ .setgdesc <description>
│ ➤ .setgname <new name>
│ ➤ .setgpp (reply to image)
│
└─────────────────────────┈⊷

┌───『 🔒 *𝖮𝖶𝖭𝖤𝖱 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲* 』
│
│ ➤ .mode <public/private>
│ ➤ .antiviewonce <on/off>
│ ➤ .clearsession
│ ➤ .antidelete
│ ➤ .cleartmp
│ ➤ .update
│ ➤ .settings
│ ➤ .setpp <reply to image>
│ ➤ .autoreact <on/off>
│ ➤ .autostatus <on/off>
│ ➤ .autostatus react <on/off>
│ ➤ .autotyping <on/off>
│ ➤ .autoread <on/off>
│ ➤ .anticall <on/off>
│ ➤ .pmblocker <on/off/status>
│ ➤ .pmblocker setmsg <text>
│ ➤ .setmention <reply to msg>
│ ➤ .mention <on/off>
│
└─────────────────────────┈⊷

┌───『 🎨 *𝖨𝖬𝖠𝖦𝖤 & 𝖲𝖳𝖨𝖢𝖪𝖤𝖱* 』
│
│ ➤ .blur <image>
│ ➤ .simage <reply to sticker>
│ ➤ .sticker <reply to image>
│ ➤ .removebg
│ ➤ .remini
│ ➤ .crop <reply to image>
│ ➤ .tgsticker <Link>
│ ➤ .meme
│ ➤ .take <packname>
│ ➤ .emojimix <emj1>+<emj2>
│ ➤ .igs <insta link>
│ ➤ .igsc <insta link>
│
└─────────────────────────┈⊷

┌───『 📥 *𝖣𝖮𝖶𝖭𝖫𝖮𝖠𝖣𝖤𝖱𝖲* 』
│
│ ➤ .play <song_name>
│ ➤ .song <song_name>
│ ➤ .spotify <query>
│ ➤ .instagram <link>
│ ➤ .facebook <link>
│ ➤ .tiktok <link>
│ ➤ .video <song name>
│ ➤ .ytmp4 <Link>
│
└─────────────────────────┈⊷

┌───『 🤖 *𝖠𝖨 𝖤𝖭𝖦𝖨𝖭𝖤𝖲* 』
│
│ ➤ .gpt <question>
│ ➤ .gemini <question>
│ ➤ .imagine <prompt>
│ ➤ .flux <prompt>
│ ➤ .sora <prompt>
│
└─────────────────────────┈⊷

┌───『 🎮 *𝖦𝖠𝖬𝖤𝖲 𝖧𝖴𝖡* 』
│
│ ➤ .tictactoe @user
│ ➤ .hangman
│ ➤ .guess <letter>
│ ➤ .trivia
│ ➤ .answer <answer>
│ ➤ .truth
│ ➤ .dare
│
└─────────────────────────┈⊷

┌───『 🎯 *𝖥𝖴𝖭 & 𝖱𝖮𝖬𝖠𝖭𝖢𝖤* 』
│
│ ➤ .compliment @user
│ ➤ .insult @user
│ ➤ .flirt
│ ➤ .shayari
│ ➤ .goodnight
│ ➤ .roseday
│ ➤ .character @user
│ ➤ .wasted @user
│ ➤ .ship @user
│ ➤ .simp @user
│ ➤ .stupid @user [text]
│
└─────────────────────────┈⊷

┌───『 𝔖 *𝖯𝖨𝖤𝖲 𝖬𝖤𝖭𝖴* 』
│
│ ➤ .pies <country>
│ ➤ .china
│ ➤ .indonesia
│ ➤ .japan
│ ➤ .korea
│ ➤ .hijab
│
└─────────────────────────┈⊷

┌───『 𝔚 *𝖳𝖤𝖳𝖷𝖬𝖠𝖪𝖤𝖱 𝖤𝖥𝖥𝖤𝖢𝖳𝖲* 』
│
│ ➤ .metallic | .ice | .snow
│ ➤ .impressive | .matrix | .light
│ ➤ .neon | .devil | .purple
│ ➤ .thunder | .leaves | .1917
│ ➤ .arena | .hacker | .sand
│ ➤ .blackpink | .glitch | .fire
│
└─────────────────────────┈⊷

┌───『 🌸 * those 𝖠𝖭𝖨𝖬𝖤* 』
│
│ ➤ .nom  | .poke | .cry
│ ➤ .kiss | .pat  | .hug
│ ➤ .wink | .facepalm
│
└─────────────────────────┈⊷

┌───『 💻 *𝖦𝖨𝖳𝖧𝖴𝖡 𝖢𝖮𝖭𝖭𝖤𝖢𝖳* 』
│
│ ➤ .git    | .github
│ ➤ .sc     | .script
│ ➤ .repo
│
└─────────────────────────┈⊷

┌───『 🧩 *𝖬𝖨𝖲𝖢 𝖹𝖮𝖭𝖤* 』
│
│ ➤ .heart     | .horny    | .circle
│ ➤ .lgbt      | .lolice   | .its-so-stupid
│ ➤ .namecard  | .oogway   | .tweet
│ ➤ .ytcomment | .comrade  | .gay
│ ➤ .glass     | .jail     | .passed
│ ➤ .triggered
│
└─────────────────────────┈⊷

📢 *Join our channel for updates:*
${global.channelLink || 'https://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A'}`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        const contextNewsletter = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363161513685998@newsletter',
                newsletterName: '𝖬𝖠𝖢𝖧𝖠-𝖡𝖮𝖴𝖭𝖣 𝖲𝖴𝖯𝖤𝖱 𝖠𝖨',
                serverMessageId: -1
            }
        };
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: contextNewsletter
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: contextNewsletter
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage }, { quoted: message });
    }
}

module.exports = helpCommand;
