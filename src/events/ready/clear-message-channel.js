const { command_channel, games_channel, music_channel} = require('../../../config-channels.json');
const { log_clear_message } = require('../../../config-log-channels.json');
const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {

    /* ---------------------------------------------------------------------------- */

    const embed = new EmbedBuilder()
        .setTitle(`clear message channel <#${command_channel}>`)
        .setFooter({ text: 'clear', iconURL: client.user.avatarURL() })
        .setColor('Red');

    /* ---------------------------------------------------------------------------- */

    const errors = new EmbedBuilder()
        .setDescription(`เกิดข้อผิดพลาดโปรดลองใหม่\nหากยังไม่ได้โปรดแจ้ง Admin\nเพื่อทำการแก้ไขข้อผิดพลาด`)
        .setColor('Red');

    /* ---------------------------------------------------------------------------- */

    setInterval(() => {

        try {
            client.channels.fetch(command_channel)
                .then(channel => channel.bulkDelete(100));

            // client.channels.fetch(log_clear_message)
            //     .then(channel => channel.send({ embeds: [embed] }));
        } catch (error) {
            client.channels.fetch(log_clear_message)
                .then(channel => channel.send({ embeds: [errors] }));
            console.log(error);
        }

    }, 300000);


    /* ---------------------------------------------------------------------------- */

    // setInterval(() => {

    //     try {
    //         client.channels.fetch(log_clear_message)
    //             .then(channel => channel.bulkDelete(100));
    //     } catch (error) {
    //         client.channels.fetch(log_clear_message)
    //             .then(channel => channel.send({ embeds: [errors] }));
    //         console.log(error);
    //     }

    // }, 600000);

    /* ---------------------------------------------------------------------------- */
    setInterval(() => {

        try {
            client.channels.fetch(games_channel)
                .then(channel => channel.bulkDelete(100));

            // client.channels.fetch(log_clear_message)
            //     .then(channel => channel.send({ embeds: [embed] }));
        } catch (error) {
            client.channels.fetch(log_clear_message)
                .then(channel => channel.send({ embeds: [errors] }));
            console.log(error);
        }

    }, 3000000);

    /* ---------------------------------------------------------------------------- */
    
    setInterval(() => {

        try {
            client.channels.fetch(music_channel)
                .then(channel => channel.bulkDelete(100));

            // client.channels.fetch(log_clear_message)
            //     .then(channel => channel.send({ embeds: [embed] }));
        } catch (error) {
            client.channels.fetch(log_clear_message)
                .then(channel => channel.send({ embeds: [errors] }));
            console.log(error);
        }

    }, 300000);
};