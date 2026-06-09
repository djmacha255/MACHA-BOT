// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
    console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./commands/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./commands/autoread');

// Command imports
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./commands/mention');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const clearCommand = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const spotifyCommand = require('./commands/spotify');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const urlCommand = require('./commands/url');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const { anticallCommand, readState: readAnticallState } = require('./commands/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');
const settingsCommand = require('./commands/settings');
const soraCommand = require('./commands/sora');

// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A";
global.ytch = "🎧 DJ MACHA 255";

// Mfumo wa Urembo wa Brand
const machaBranding = (text) => {
    return `🎧 *𝖣𝖩 𝖬𝖠𝖢𝖧𝖠 255* ⚡\n\n${text}`;
};

// =================================================================
// ⚙️ SWITCH TOGGLE SYSTEM MANAGER (MACHALABS CORE)
// =================================================================
const getMachaSettings = () => {
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, 'machaSettings.json');
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({ antiViewOnce: true, autoReact: true }, null, 2));
    }
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (e) {
        return { antiViewOnce: true, autoReact: true };
    }
};

const updateMachaSettings = (key, value) => {
    const filePath = path.join(process.cwd(), 'data', 'machaSettings.json');
    const mSettings = getMachaSettings();
    mSettings[key] = value;
    fs.writeFileSync(filePath, JSON.stringify(mSettings, null, 2));
};

// =================================================================
// 🛡️ MACHABOUND PHISHING & SCAM DETECTION ENGINE
// =================================================================
const detectPhishingScam = (text) => {
    if (!text) return null;
    
    const scamKeywords = [
        'zawadi', 'free-gift', 'giveaway', 'bando la bure', 'bando la krismasi',
        'free data', 'angalia nani amekutembelea', 'crypto bonus', 'invest and double',
        'pata pesa', 'ajira mpya', 'm-pesa bonus', 'tigo-pesa zawadi', 'airtel-money free'
    ];
    
    const scamPatterns = [
        /whatsapp-gift/i, /free-bando/i, /claim-bonus/i, /login-secure/i,
        /\.xyz/i, /\.club/i, /\.top/i, /\.win/i, /\.loan/i, /\.free/i
    ];

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hasLink = urlRegex.test(text);

    if (hasLink) {
        for (const word of scamKeywords) {
            if (text.includes(word)) {
                return `⚠️ *Sababu:* Maandishi yana viashiria vya utapeli wa kijamii (*${word.toUpperCase()}*).`;
            }
        }
        for (const pattern of scamPatterns) {
            if (pattern.test(text)) {
                return `⚠️ *Sababu:* Domain inayotumika haina usalama au imetengenezwa kwa ajili ya hadaa (*Phishing Domain*).`;
            }
        }
    }
    return null;
};

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363161513685998@newsletter',
            newsletterName: '𝖬𝖠𝖢𝖧𝖠-𝖡𝖮𝖴𝖭𝖣 𝖲𝖴𝖯𝖤𝖱 𝖠𝖨',
            serverMessageId: -1
        }
    }
};

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        const currentMachaState = getMachaSettings();

        // =================================================================
        // 🎭 SMART CONTEXTUAL AUTOREACT ENGINE
        // =================================================================
        if (userMessage && currentMachaState.autoReact) {
            let reactionEmoji = null;

            if (userMessage.startsWith('.')) {
                reactionEmoji = '⚡'; 
            } else if (userMessage.includes('macha') || userMessage.includes('dj')) {
                reactionEmoji = '🎧'; 
            } else if (userMessage.includes('bot') || userMessage.includes('ai')) {
                reactionEmoji = '🤖'; 
            } else if (userMessage.includes('kali') || userMessage.includes('beat') || userMessage.includes('amapiano')) {
                reactionEmoji = '🎹'; 
            } else if (userMessage.includes('code') || userMessage.includes('panel') || userMessage.includes('it')) {
                reactionEmoji = '💻'; 
            } else if (userMessage.includes('piga') || userMessage.includes('washa') || userMessage.includes('moto')) {
                reactionEmoji = '🔥';
            }

            if (reactionEmoji) {
                try {
                    await sock.sendMessage(chatId, {
                        react: { text: reactionEmoji, key: message.key }
                    });
                } catch (reactErr) {
                    console.error('Autoreact failed softly:', reactErr);
                }
            }
        }

        // =================================================================
        // 🕵️‍♂️ SILENT ANTI-VIEW ONCE INTERCEPTOR
        // =================================================================
        const viewOnceMsg = message.message?.viewOnceMessageV2 || message.message?.viewOnceMessage;
        if (viewOnceMsg && currentMachaState.antiViewOnce) {
            try {
                const ownerJid = '255612801118@s.whatsapp.net';
                const mediaType = Object.keys(viewOnceMsg.message)[0];
                const mediaContent = viewOnceMsg.message[mediaType];

                if (mediaContent) {
                    delete mediaContent.viewOnce;
                    const chatLocation = isGroup ? '📢 Kikundi (Group Chat)' : '👤 Inbox ya Mtu (DM)';
                    const senderDigits = senderId.split('@')[0];
                    
                    const reportCaption = `🎧 *𝖣𝖩 𝖬𝖠𝖢𝖧𝖠 255 𝖲𝖯𝖸-𝖵𝖨𝖤𝖶*\n\n` +
                                          `⚡ *Eneo:* ${chatLocation}\n` +
                                          `👤 *Mtumaji:* @${senderDigits}\n` +
                                          `🆔 *Chat JID:* ${chatId}\n\n` +
                                          `💬 *Caption:* ${mediaContent.caption || '_Haina Maandishi_'}`;

                    await sock.sendMessage(ownerJid, {
                        [mediaType.replace('Message', '')]: mediaContent,
                        caption: reportCaption,
                        mentions: [senderId]
                    });
                }
            } catch (vError) {
                console.error('Error intercepting view once:', vError);
            }
        }

        // Handle autoread functionality
        await handleAutoread(sock, message);

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            const chatId = message.key.remoteJid;

            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, {
                    text: machaBranding('📢 *Join our Official Brand Channel:*\nhttps://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A')
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                const ownerCommand = require('./commands/owner');
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'support') {
                await sock.sendMessage(chatId, {
                    text: machaBranding(`🔗 *Macha Support Lounge*\n\nhttps://chat.whatsapp.com/GA4WrOFythU6g3BFVubYM7?mode=wwt`)
                }, { quoted: message });
                return;
            }
        }

        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        if (userMessage.startsWith('.')) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }
        
        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Error checking access mode:', error);
        }
        
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;
        
        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: machaBranding('❌ *𝖴𝖬𝖤𝖹𝖴𝖨𝖫𝖨𝖶𝖠 / 𝖡𝖠𝖭𝖭𝖤𝖣*\n\nHuna ruhusa ya kutumia mifumo ya bot hii kwa sasa.'),
                    ...channelInfo
                });
            }
            return;
        }

        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // =================================================================
        // 🛡️ GROUP SECURITY & SHIELD FILTERS
        // =================================================================
        if (isGroup) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
                
                // Real-time Phishing Alert Interceptor
                const scamReason = detectPhishingScam(userMessage);
                if (scamReason) {
                    const senderDigits = senderId.split('@')[0];
                    const alertMessage = `🚨 *𝖬𝖠𝖢𝖧𝖠 𝖢𝖸𝖡𝖤𝖱-𝖲𝖧𝖨𝖤𝖫𝖣 𝖠𝖫𝖤𝖱𝖳* 🚨\n\n` +
                                         `⚠️ *Onyo la Kiintelijensia:* Link iliyotumwa hapo juu ina viashiria vikubwa vya *Phishing / Utapeli wa Kimtandao*.\n\n` +
                                         `👤 *Mtumaji:* @${senderDigits}\n` +
                                         `${scamReason}\n\n` +
                                         `💡 *Ushauri:* Ndugu wanakikundi, *USIBONYEZE* link hiyo ili kulinda usalama wa akaunti zenu na simu zenu!`;

                    try { await sock.sendMessage(chatId, { react: { text: '🚨', key: message.key } }); } catch(e){}
                    await sock.sendMessage(chatId, { text: machaBranding(alertMessage), mentions: [senderId] });
                }
            }
            await Antilink(message, sock);
        }

        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    await sock.sendMessage(chatId, { text: pmState.message || '⚠️ DM System Blocked by DJ MACHA 255. Tumia magroup.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        if (!userMessage.startsWith('.')) {
            await handleAutotypingForMessage(sock, chatId, userMessage);

            if (isGroup) {
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);

                if (isPublic || isOwnerOrSudoCheck) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }
        
        if (!isPublic && !isOwnerOrSudoCheck) {
            return;
        }

        const adminCommands = ['.mute', '.unmute', '.ban', '.unban', '.promote', '.demote', '.kick', '.tagall', '.tagnotadmin', '.hidetag', '.antilink', '.antitag', '.setgdesc', '.setgname', '.setgpp'];
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        const ownerCommands = ['.mode', '.autostatus', '.antidelete', '.cleartmp', '.setpp', '.clearsession', '.areact', '.autoreact', '.autotyping', '.autoread', '.pmblocker', '.antiviewonce', '.iplookup', '.hash', '.hostcheck'];
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: machaBranding('⚠️ *𝖬𝖠𝖢𝖧𝖠-𝖡𝖮𝖴𝖭𝖣 𝖠𝖣𝖬𝖨𝖭 𝖤𝖱𝖱𝖮𝖱*\nTafadhali mpe bot vyeo vya U-admin.') }, { quoted: message });
                return;
            }

            if (
                userMessage.startsWith('.mute') ||
                userMessage === '.unmute' ||
                userMessage.startsWith('.ban') ||
                userMessage.startsWith('.unban') ||
                userMessage.startsWith('.promote') ||
                userMessage.startsWith('.demote')
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: machaBranding('❌ Amri hii ni maalum kwa ma-admin pekee!') }, { quoted: message });
                    return;
                }
            }
        }

        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                await sock.sendMessage(chatId, { text: machaBranding('❌ Amri hii imefungwa na ni maalum kwa DJ MACHA 255 pekee!') }, { quoted: message });
                return;
            }
        }

        let commandExecuted = false;

        switch (true) {
            // =================================================================
            // 🔘 SWITCH COMMAND HANDLERS
            // =================================================================
            case userMessage.startsWith('.antiviewonce'): {
                const args = userMessage.split(' ')[1];
                if (args === 'on') {
                    updateMachaSettings('antiViewOnce', true);
                    await sock.sendMessage(chatId, { text: machaBranding('✅ *𝖬𝖠𝖢𝖧𝖠 𝖲𝖯𝖸-𝖵𝖨𝖤𝖶 𝖮𝖭*\n\nMfumo wa siri wa kudaka picha za View Once umewashwa!') }, { quoted: message });
                } else if (args === 'off') {
                    updateMachaSettings('antiViewOnce', false);
                    await sock.sendMessage(chatId, { text: machaBranding('❌ *𝖬𝖠𝖢𝖧𝖠 𝖲𝖯𝖸-𝖵𝖨𝖤𝖶 𝖮𝖥𝖥*\n\nMfumo umezimwa rasmi.') }, { quoted: message });
                } else {
                    const status = getMachaSettings().antiViewOnce ? '𝖮𝖭' : '𝖮𝖥𝖥';
                    await sock.sendMessage(chatId, { text: machaBranding(`💡 *Matumizi:* .antiviewonce on/off\nStatus: *${status}*`) }, { quoted: message });
                }
                break;
            }

            case userMessage.startsWith('.autoreact'): {
                const args = userMessage.split(' ')[1];
                if (args === 'on') {
                    updateMachaSettings('autoReact', true);
                    await sock.sendMessage(chatId, { text: machaBranding('✅ *𝖬𝖠𝖢𝖧𝖠 𝖠𝖴𝖳𝖮-𝖱𝖤𝖠𝖢𝖳 𝖮𝖭*\n\nMfumo wa kuitikia meseji kwa emoji umewashwa!') }, { quoted: message });
                } else if (args === 'off') {
                    updateMachaSettings('autoReact', false);
                    await sock.sendMessage(chatId, { text: machaBranding('❌ *𝖬𝖠𝖢𝖧𝖠 𝖠𝖴𝖳𝖮-𝖱𝖤𝖠𝖢𝖳 𝖮𝖥𝖥*\n\nMfumo umezimwa rasmi.') }, { quoted: message });
                } else {
                    const status = getMachaSettings().autoReact ? '𝖮𝖭' : '𝖮𝖥𝖥';
                    await sock.sendMessage(chatId, { text: machaBranding(`💡 *Matumizi:* .autoreact on/off\nStatus: *${status}*`) }, { quoted: message });
                }
                break;
            }

            // =================================================================
            // 🕵️‍♂️ CYBER & OSINT HACKER SUITE
            // =================================================================
            case userMessage.startsWith('.iplookup'): {
                const query = userMessage.split(' ')[1];
                if (!query) {
                    await sock.sendMessage(chatId, { text: machaBranding('⚠️ *Weka IP au Domain!* \n\nMfano: `.iplookup 8.8.8.8`') }, { quoted: message });
                    break;
                }
                try {
                    const res = await axios.get(`http://ip-api.com/json/${query}`);
                    const d = res.data;
                    if (d.status === 'fail') {
                        await sock.sendMessage(chatId, { text: machaBranding('❌ *Data Haikupatikana!*') }, { quoted: message });
                        break;
                    }
                    const info = `🕵️‍♂️ *OSINT TARGET DETECTED*\n\n` +
                                  `🌐 *Target host:* ${d.query}\n` +
                                  `🏳️ *Nchi:* ${d.country} (${d.countryCode})\n` +
                                  `📍 *Mkoa/Mji:* ${d.regionName} / ${d.city}\n` +
                                  `📡 *ISP/Mtandao:* ${d.isp}\n` +
                                  `🏢 *Organization:* ${d.org || 'N/A'}\n` +
                                  `🗺️ *Coordinates:* ${d.lat}, ${d.lon}\n` +
                                  `⏰ *Timezone:* ${d.timezone}`;
                    
                    await sock.sendMessage(chatId, { text: machaBranding(info) }, { quoted: message });
                } catch (e) {
                    await sock.sendMessage(chatId, { text: machaBranding('❌ Mfumo umeshindwa kuwasiliana na OSINT server.') }, { quoted: message });
                }
                break;
            }

            case userMessage.startsWith('.hash'): {
                const args = userMessage.split(' ');
                const type = args[1]; 
                const textToHash = args.slice(2).join(' ');
                
                if (!type || !textToHash) {
                    await sock.sendMessage(chatId, { text: machaBranding('⚠️ *Matumizi:* `.hash md5 siri123` au `.hash sha256 siri123`') }, { quoted: message });
                    break;
                }
                if (!['md5', 'sha256', 'sha1'].includes(type.toLowerCase())) {
                    await sock.sendMessage(chatId, { text: machaBranding('❌ Algorithms zinazokubalika: *md5, sha1, sha256*') }, { quoted: message });
                    break;
                }
                
                const hash = crypto.createHash(type.toLowerCase()).update(textToHash).digest('hex');
                const hashReport = `🔐 *MACHABOUND CRYPTO ENGINE*\n\n` +
                                   `📥 *Maandishi:* ${textToHash}\n` +
                                   `🧬 *Algorithm:* ${type.toUpperCase()}\n` +
                                   `🔑 *Hash Output:* \`\`\`${hash}\`\`\``;
                
                await sock.sendMessage(chatId, { text: machaBranding(hashReport) }, { quoted: message });
                break;
            }

            case userMessage.startsWith('.hostcheck'): {
                let domain = userMessage.split(' ')[1];
                if (!domain) {
                    await sock.sendMessage(chatId, { text: machaBranding('⚠️ *Weka Target Domain!* \n\nMfano: `.hostcheck google.com`') }, { quoted: message });
                    break;
                }
                domain = domain.replace(/^(^\w+:|^)\/\//, '');
                const startTime = Date.now();
                try {
                    const res = await axios.get(`https://${domain}`, { timeout: 6000 });
                    const responseTime = Date.now() - startTime;
                    
                    const hostInfo = `🌐 *HOST MONITOR REPORT*\n\n` +
                                     `🖥️ *Domain:* ${domain}\n` +
                                     `🟢 *Status:* ONLINE (HTTP ${res.status})\n` +
                                     `⚡ *Kasi (Ping):* ${responseTime}ms\n` +
                                     `📦 *Server Header:* ${res.headers['server'] || 'Siri ya Jeshi'}`;
                                     
                    await sock.sendMessage(chatId, { text: machaBranding(hostInfo) }, { quoted: message });
                } catch (e) {
                    const responseTimeErr = Date.now() - startTime;
                    const deadHost = `🌐 *HOST MONITOR REPORT*\n\n` +
                                     `🖥️ *Domain:* ${domain}\n` +
                                     `🔴 *Status:* CRITICAL / OFFLINE\n` +
                                     `⚠️ *Sababu:* ${e.message}\n` +
                                     `⏱️ *Time Elapsed:* ${responseTimeErr}ms`;
                                     
                    await sock.sendMessage(chatId, { text: machaBranding(deadHost) }, { quoted: message });
                }
                break;
            }

            // =================================================================
            // STANDARD COMMANDS
            // =================================================================
            case userMessage === '.simage': {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: machaBranding('Please reply to a sticker with .simage to extract it.') }, { quoted: message });
                }
                break;
            }
            case userMessage.startsWith('.kick'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
            case userMessage.startsWith('.mute'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: machaBranding('Weka dakika halali.') }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                break;
            case userMessage === '.unmute':
                await unmuteCommand(sock, chatId, senderId);
                break;
            case userMessage.startsWith('.ban'):
                await banCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.unban'):
                await unbanCommand(sock, chatId, message);
                break;
            case userMessage === '.help':
                await helpCommand(sock, chatId, message);
                break;
        }
    } catch (globalError) {
        console.error('Main engine failure:', globalError);
    }
}

module.exports = { handleMessages };
