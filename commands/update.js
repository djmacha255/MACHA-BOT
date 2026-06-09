const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
            if (err) return reject(new Error((stderr || stdout || err.message || '').toString()));
            resolve((stdout || '').toString());
        });
    });
}

async function hasGitRepo() {
    const gitDir = path.join(process.cwd(), '.git');
    if (!fs.existsSync(gitDir)) return false;
    try {
        await run('git --version');
        return true;
    } catch {
        return false;
    }
}

async function updateViaGit() {
    const oldRev = (await run('git rev-parse HEAD').catch(() => 'unknown')).trim();
    await run('git fetch --all --prune');
    const newRev = (await run('git rev-parse origin/main')).trim();
    const alreadyUpToDate = oldRev === newRev;
    const commits = alreadyUpToDate ? '' : await run(`git log --pretty=format:"%h %s (%an)" ${oldRev}..${newRev}`).catch(() => '');
    const files = alreadyUpToDate ? '' : await run(`git diff --name-status ${oldRev} ${newRev}`).catch(() => '');
    await run(`git reset --hard ${newRev}`);
    await run('git clean -fd');
    return { oldRev, newRev, alreadyUpToDate, commits, files };
}

async function updateCommand(sock, chatId, message) {
    const senderId = message.key.participant || message.key.remoteJid;
    const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
    
    // 1. Ulinzi wa Mfumo - Owner au Sudo tu anapiga amri
    if (!message.key.fromMe && !isOwner) {
        await sock.sendMessage(chatId, { text: '❌ *𝖬𝖠𝖢𝖧𝖠-...* Amri hii ni maalum kwa mmiliki wa mfumo tu.' }, { quoted: message });
        return;
    }

    try {
        // 2. Weka Reaction ya mzunguko kuonyesha kazi imeanza
        try { 
            await sock.sendMessage(chatId, { react: { text: '🔄', key: message.key } }); 
        } catch (e) {}

        // 3. Hakikisha kama mfumo una Git Repo uliyounganishwa
        if (!(await hasGitRepo())) {
            const noGit = `🎧 *𝖬𝖠𝖢𝖧𝖠-𝖠𝖨 𝖴𝖯𝖣𝖠𝖳𝖤*\n\n❌ *𝖤𝖱𝖱𝖮𝖱:* Mfumo haujapata folda la \`.git\`. Tafadhali hakikisha umeunganisha Panel yako na repo la \`djmacha255/MACHA-BOT\` kwanza.`;
            await sock.sendMessage(chatId, { text: noGit }, { quoted: message });
            return;
        }

        // Tuma ujumbe wa kuanza upekuzi
        await sock.sendMessage(chatId, { text: '🎧 *𝖬𝖠𝖢𝖧𝖠-𝖠𝖨 𝖢𝖮𝖱𝖤*\n\n🔄 Mfumo unaanza kuvuta maboresho kutoka kwenye GitHub Repository (`djmacha255/MACHA-BOT`)...' }, { quoted: message });

        // 4. Run Git Pull / Update Logic
        const { oldRev, newRev, alreadyUpToDate, commits, files } = await updateViaGit();

        // Kama mfumo upo kwenye toleo la mwisho tayari
        if (alreadyUpToDate) {
            const upToDate = `🎧 *𝖬𝖠𝖢𝖧𝖠-𝖠𝖨 𝖴𝖯𝖣𝖠𝖳𝖤*\n\n🟢 *𝖲𝖸𝖲𝖳𝖤𝖬 𝖫𝖠𝖳𝖤𝖲𝖳*\nMifumo yako yote ipo kwenye toleo la sasa hivi kulingana na repo la \`djmacha255/MACHA-BOT\`. Hakuna maboresho mapya bado.`;
            await sock.sendMessage(chatId, { text: upToDate }, { quoted: message });
            return;
        }

        // Kusakinisha upya "dependencies" kama kuna package mpya imezidishwa
        await run('npm install --no-audit --no-fund');

        // Muundo wa Jibu la mafanikio ya sasisho (Cyber Grid Layout)
        const jibuLaMafanikio = 
`┌───『 🔄 *𝖲𝖸𝖲𝖳𝖤𝖬 𝖴𝖯𝖣𝖠𝖳𝖤𝖣* 』
│
│ ✅ *𝖲𝗍𝖺𝗍𝗎𝖲:* Maboresho yamevutwa kikamilifu!
│ 📁 *𝖱𝖾𝖯𝗈:* djmacha255/MACHA-BOT
│ 🆔 *𝖵𝖾𝗋𝗌𝗂𝗈𝖭:* ${oldRev.slice(0, 7)} ➔ ${newRev.slice(0, 7)}
│
├─『 📊 *𝖢𝖧𝖠𝖭𝖦𝖤𝖫𝖮𝖦𝖲* 』
│ \`\`\`${commits ? commits.trim() : 'Maboresho ya ndani ya kodi yamekamilika.'}\`\`\`
│
└─────────────────────────┈⊷

💡 _Mfumo unajizima sasa hivi kwa sekunde 2 ili kuwaka upya ukiwa na kodi mpya._

🎧 *𝖯𝖮𝖶𝖤𝖱𝖤𝖣 𝖡𝖸 𝖣𝖱𝖨𝖵𝖤 𝖬𝖠𝖢𝖧𝖠 𝖢𝖮𝖱𝖤*`;

        await sock.sendMessage(chatId, { text: jibuLaMafanikio }, { quoted: message });

        // 5. Zima mfumo ili uwashe upya ukiwa "Fresh"
        setTimeout(() => {
            process.exit(0);
        }, 2000);

    } catch (err) {
        console.error('Update failed:', err);
        const jibuBaya = `🎧 *𝖬𝖠𝖢𝖧𝖠-𝖠𝖨 𝖴𝖯𝖣𝖠𝖳𝖤*\n\n❌ *𝖴𝖯𝖣𝖠𝖳𝖤  𝖥𝖠𝖨𝖫𝖤𝖣*\n\`\`\`${String(err.message || err)}\`\`\``;
        await sock.sendMessage(chatId, { text: jibuBaya }, { quoted: message });
    }
}

module.exports = updateCommand;
