const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ensure the src/data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Path to the JSON file to store scores
const scoresFilePath = path.join(dataDir, 'scores.json');

// Export the function for the event
module.exports = async(message, client) => {
    if (message.author.bot) return;

    const channelId = '1304794692336091238'; // แทนที่ด้วย ID ของช่องที่ต้องการให้บอททำงาน
    if (message.channel.id !== channelId) return;

    const userGuess = parseInt(message.content);
    if (isNaN(userGuess)) return;

    if (!client.targetNumber) {
        client.targetNumber = Math.floor(Math.random() * 100) + 1;
        client.attempts = 0;
    }

    client.attempts++;

    if (userGuess === client.targetNumber) {
        // Update the player's score
        let scores = {};
        if (fs.existsSync(scoresFilePath)) {
            scores = JSON.parse(fs.readFileSync(scoresFilePath, 'utf-8'));
        }

        if (!scores[message.author.id]) {
            scores[message.author.id] = 0;
        }

        scores[message.author.id] += 1; // Increase score by 1

        fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 2), 'utf-8');

        // Sort scores and get the top 3 players
        const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a).slice(0, 3);

        // Create the embed message for the top 3 players
        const topPlayersEmbed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTitle('🏆 อันดับคะแนนสูงสุด 🏆')
            .setDescription('นี่คือ 3 อันดับผู้เล่นที่มีคะแนนมากที่สุด')
            .setColor('Blue')
            .setTimestamp();

        sortedScores.forEach(([userId, score], index) => {
            topPlayersEmbed.addFields({ name: `อันดับที่ ${index + 1}`, value: `<@${userId}>: ${score} คะแนน`, inline: false });
        });

        const winEmbed = new EmbedBuilder()
            .setAuthor({ name: 'เกมทายตัวเลข', iconURL: client.user.avatarURL() })
            .setDescription(`ยินดีด้วย! <@${message.author.id}> คุณทายถูกต้องใน ${client.attempts} ครั้ง!\nเริ่มทายใหม่ได้เลย`)
            .setTimestamp()
            .setThumbnail('https://media.giphy.com/media/3o6YfTUIfDYjPdnk52/giphy.gif?cid=ecf05e4795nfenzrv93e0ttaa0dbvuycq1uss4jkhoe2d87m&ep=v1_gifs_search&rid=giphy.gif&ct=g')
            .setColor('Random');

        // Log the new target number for the next round
        client.targetNumber = Math.floor(Math.random() * 100) + 1; // Start a new game
        client.attempts = 0;

        // Clear previous messages
        await client.channels.fetch(channelId)
            .then(channel => channel.bulkDelete(100));

        // Send the win message and top players message
        message.channel.send({ embeds: [winEmbed] });
        message.channel.send({ embeds: [topPlayersEmbed] });
    } else if (userGuess > client.targetNumber) {
        message.channel.send('ตัวเลขสูงไป! ลองใหม่อีกครั้ง');
    } else {
        message.channel.send('ตัวเลขต่ำไป! ลองใหม่อีกครั้ง');
    }
};
