const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {

    const embed = new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTitle('บอทสามารถใช้งานได้แล้ว')
        .setTimestamp()
        .setDescription('Bot Online')
        .setThumbnail(client.user.displayAvatarURL())
        .setColor('Green');


    client.channels.fetch('1238806085910134885')
        .then(channel => channel.send({ embeds: [embed] }));
};