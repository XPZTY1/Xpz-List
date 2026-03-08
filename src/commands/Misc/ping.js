const { command_channel } = require('../../../config-channels.json');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: 'ping',
        description: 'send pong!'
    },

    run: ({ interaction, client }) => {

        if (interaction.channelId == command_channel) {
            interaction.reply(`:ping_pong: Pong! ${client.ws.ping}ms`);
        } else {
            const channel_c = new EmbedBuilder()
                .setDescription(`โปรดใช้ command ในช่อง\n<#${command_channel}>`)
                .setColor('Red');

            interaction.reply({ embeds: [channel_c], ephemeral: true });
        }
    },
    options: {
        // devOnly: true,
        // userPermissions: ['Administrator', 'AddReactions'],
        // botPermissions: ['Administrator', 'AddReactions'],
        // deleted: true,
    },
};