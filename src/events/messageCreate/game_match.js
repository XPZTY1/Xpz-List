const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// ฟังก์ชันสำหรับโหลดข้อมูลคะแนน
function loadUsers() {
    const usersFilePath = path.join(__dirname, '..', '..', 'data', 'scoreMatch.json');
    let users = {};
    if (fs.existsSync(usersFilePath)) {
        users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    }
    return users;
}

// ฟังก์ชันสำหรับบันทึกข้อมูลคะแนน
function saveUsers(users) {
    const usersFilePath = path.join(__dirname, '..', '..', 'data', 'scoreMatch.json');
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

function sendRandomMathQuestion(client, channel) {
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;
    const operation = Math.random() < 0.5 ? '+' : '-';
    const answer = operation === '+' ? num1 + num2 : num1 - num2;

    const embed = new EmbedBuilder()
        .setTitle('โจทย์คณิตศาสตร์')
        .setDescription(`โจทย์: ${num1} ${operation} ${num2} = ?`)
        .setFooter({ text: '!help ดูคำสั่ง' })
        .setThumbnail('https://media.giphy.com/media/4JVTF9zR9BicshFAb7/giphy.gif?cid=790b7611ndwd52azm5q6s691k6kwiqk159o4tm9zlisp1yt5&ep=v1_gifs_search&rid=giphy.gif&ct=g')
        .setColor('NotQuiteBlack');

    channel.send({ embeds: [embed] });

    const filter = response => {
        return parseInt(response.content) === answer;
    };

    channel.awaitMessages({ filter, max: 1, time: 0 })
        .then(collected => {
            const userId = collected.first().author.id;
            let users = loadUsers();
            if (!users[userId]) {
                users[userId] = { score: 0 };
            }
            users[userId].score += 1;
            saveUsers(users);

            const successEmbed = new EmbedBuilder()
                .setTitle('ถูกต้อง!')
                .setThumbnail(`${collected.first().author.displayAvatarURL()}`)
                .setTimestamp()
                .setFooter({text: '!score | !s ดูคะแนน'})
                .setDescription(`<@${collected.first().author.id}>\nตอบถูกต้อง`)
                .setColor('#00ff00');

            channel.send({ embeds: [successEmbed] });


            sendRandomMathQuestion(client, channel);  // ส่งโจทย์ใหม่ทันที
        })
        .catch(() => {
            // ไม่ตอบกลับอะไรเมื่อคำตอบไม่ถูกต้อง
        });
}

module.exports = async (message, client) => {
    const allowedChannelName = '°🔢₊︱คำนวณเลข'; // เปลี่ยนชื่อช่องตามต้องการ

    // ตรวจสอบว่าข้อความที่ส่งมาจากช่องที่กำหนดเท่านั้น
    if (message.channel.name !== allowedChannelName) {
        return;
    }

    if (message.content === '!score' || message.content === '!s') {
        let users = loadUsers();
        const userId = message.author.id;
        if (!users[userId]) {
            users[userId] = { score: 0 };
        }
        saveUsers(users);

        const sortedUsers = Object.keys(users).sort((a, b) => users[b].score - users[a].score).slice(0, 10);

        let description = sortedUsers.map((id, index) => {
            const user = message.guild.members.cache.get(id);
            const username = user ? user.user.id : "Unknown User";
            return `${index + 1}. <@${username}> : ${users[id].score} คะแนน`;
        }).join('\n');

        description += `\n\nคะแนนของคุณ: <@${message.author.id}> - ${users[userId].score} คะแนน`;

        const scoreEmbed = new EmbedBuilder()
            .setTitle('อันดับคะแนน')
            .setDescription(description)
            .setColor('Random');

        message.channel.send({ embeds: [scoreEmbed] });

    }

    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('วิธีการเล่นเกมบวกลบ')
            .setDescription('คำสั่งและวิธีการเล่นเกมบวกลบ')
            .addFields(
                { name: '```!score``` || ```!s```', value: 'ดูอันดับคะแนน 10 อันดับสูงสุดและคะแนนของคุณ' },
                { name: '```การตอบคำถาม```', value: 'ตอบคำถามโดยการพิมพ์คำตอบตรงๆ ในช่องแชท' }
            )
            .setColor('#0099ff');

        message.channel.send({ embeds: [helpEmbed] });

    }
};

module.exports.sendRandomMathQuestion = sendRandomMathQuestion;
module.exports.loadUsers = loadUsers;
module.exports.saveUsers = saveUsers;
