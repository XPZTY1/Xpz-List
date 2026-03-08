const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// ฟังก์ชันสำหรับโหลดข้อมูลคะแนน
function loadScores() {
    const scoresFilePath = path.join(__dirname, '..', '..', 'data', 'scoreTyping.json');
    let scores = {};
    if (fs.existsSync(scoresFilePath)) {
        scores = JSON.parse(fs.readFileSync(scoresFilePath, 'utf8'));
    }
    return scores;
}

// ฟังก์ชันสำหรับบันทึกข้อมูลคะแนน
function saveScores(scores) {
    const scoresFilePath = path.join(__dirname, '..', '..', 'data', 'scoreTyping.json');
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 2));
}

// ฟังก์ชันสำหรับสุ่มตัวอักษร
function getRandomLetters() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomLetters = '';
    const length = Math.floor(Math.random() * 3) + 3; // ความยาวตั้งแต่ 3 ถึง 5 ตัวอักษร
    for (let i = 0; i < length; i++) {
        randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return randomLetters;
}

let currentLetters = '';

module.exports = async (message, client) => {
    const allowedChannelName = '°🔤₊︱อักษรหรรษา';

    if (message.channel.name !== allowedChannelName) {
        return;
    }

    if (message.author.bot) {
        return;
    }

    const scores = loadScores();

    if (message.content === currentLetters) {
        const userId = message.author.id;
        if (!scores[userId]) {
            scores[userId] = { score: 0 };
        }
        scores[userId].score += 1;
        saveScores(scores);

        const embed = new EmbedBuilder()
            .setTitle('ถูกต้อง!')
            .setThumbnail(`${message.author.displayAvatarURL()}`)
            .setTimestamp()
            .setDescription(`<@${message.author.id}> \nพิมพ์ตัวอักษรถูกต้อง!`)
            .setFooter({text: '!score | !s ดูคะแนน'})
            .setColor('#00ff00');

        message.channel.send({ embeds: [embed] });

        currentLetters = getRandomLetters();

        const newEmbed = new EmbedBuilder()
            .setTitle('เกมพิมพ์ตามตัวอักษร')
            .setDescription(`พิมพ์ตัวอักษรเหล่านี้: \`${currentLetters}\``)
            .setFooter({ text: '!help ดูคำสั่ง' })
            .setThumbnail('https://media.giphy.com/media/Qbptue8E6z9qfCWb0s/giphy.gif?cid=790b7611uh9a1v9m6okiyi7tawzia3xtebazx2pe5vgk0bsq&ep=v1_gifs_search&rid=giphy.gif&ct=g')
            .setColor('NotQuiteBlack');

        message.channel.send({ embeds: [newEmbed] });
    }

    if (!currentLetters) {
        currentLetters = getRandomLetters();

        const embed = new EmbedBuilder()
            .setTitle('เกมพิมพ์ตามตัวอักษร')
            .setDescription(`พิมพ์ตัวอักษรเหล่านี้: \`${currentLetters}\``)
            .setFooter({ text: '!help ดูคำสั่ง' })
            .setThumbnail('https://media.giphy.com/media/Qbptue8E6z9qfCWb0s/giphy.gif?cid=790b7611uh9a1v9m6okiyi7tawzia3xtebazx2pe5vgk0bsq&ep=v1_gifs_search&rid=giphy.gif&ct=g')
            .setColor('NotQuiteBlack');

        message.channel.send({ embeds: [embed] });
    }

    if (message.content === '!score' || message.content === '!s') {
        const userId = message.author.id;
        if (!scores[userId]) {
            scores[userId] = { score: 0 };
        }
        saveScores(scores);

        const sortedScores = Object.keys(scores).sort((a, b) => scores[b].score - scores[a].score).slice(0, 10);

        let description = sortedScores.map((id, index) => {
            const user = message.guild.members.cache.get(id);
            const username = user ? user.user.id : "Unknown User";
            return `${index + 1}. <@${username}> : ${scores[id].score} คะแนน`;
        }).join('\n');

        description += `\n\nคะแนนของคุณ: <@${message.author.id}> - ${scores[userId].score} คะแนน`;

        const embed = new EmbedBuilder()
            .setTitle('อันดับคะแนน')
            .setDescription(description)
            .setColor('Random');

        message.channel.send({ embeds: [embed] });
    }

    if (message.content === '!help') {
        const embed = new EmbedBuilder()
            .setTitle('วิธีการเล่นเกมพิมพ์ตามตัวอักษร')
            .setDescription('คำสั่งและวิธีการเล่นเกมพิมพ์ตามตัวอักษร')
            .addFields(
                { name: '```!score```', value: 'ดูอันดับคะแนน 10 อันดับสูงสุดและคะแนนของคุณ' },
                { name: '```การพิมพ์ตามตัวอักษร```', value: 'พิมพ์ตัวอักษรที่บอทส่งมาให้ตรงกับที่บอทส่งมา' }
            )
            .setColor('Random');

        message.channel.send({ embeds: [embed] });
    }
};

module.exports.loadScores = loadScores;
module.exports.saveScores = saveScores;
