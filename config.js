require('dotenv').config(); 

global.APIs = {
    xteam: 'https://api.xteam.xyz',
    dzx: 'https://api.dhamzxploit.my.id',
    lol: 'https://api.lolhuman.xyz',
    violetics: 'https://violetics.pw',
    neoxr: 'https://api.neoxr.my.id',
    zenzapis: 'https://zenzapis.xyz',
    akuari: 'https://api.akuari.my.id',
    akuari2: 'https://apimu.my.id',
    nrtm: 'https://fg-nrtm.ddns.net',
    bg: 'http://bochil.ddns.net',
    fgmods: 'https://api-fgmods.ddns.net'
};

global.APIKeys = {
    'https://api.xteam.xyz': 'd90a9e986e18778b',
    'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
    'https://api.neoxr.my.id': 'yourkey',
    'https://violetics.pw': 'beta',
    'https://zenzapis.xyz': 'yourkey',
    'https://api-fgmods.ddns.net': 'fg-dylux'
};

// =================================================================
// 🎧 DJ MACHA 255 SUPER CONFIGURATION & BRANDING 🎧
// =================================================================
global.owner = ['255612801118']; // Namba yako rasmi ya Umiliki (Kingpin)
global.ownername = '🎧 𝖣𝖩 𝖬𝖠𝖢𝖧𝖠 255'; // Chapa yako rasmi
global.botname = '⚡ 𝖬𝖠𝖢𝖧𝖠-𝖡𝖮𝖴𝖭𝖣 𝖲𝖴𝖯𝖤𝖱 𝖠𝖨'; // Jina la Bot yako
global.prefix = ['.']; // Alama ya kuanzia commands

// Mipangilio ya AI (Inajisomea yenyewe kutoka kwenye panel environment)
global.geminiKey = process.env.GEMINI_API_KEY || 'AI_READY'; 

module.exports = {
    WARN_COUNT: 3,
    APIs: global.APIs,
    APIKeys: global.APIKeys,
    owner: global.owner,
    ownername: global.ownername,
    botname: global.botname,
    prefix: global.prefix
};
