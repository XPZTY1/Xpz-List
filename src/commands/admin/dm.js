const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { command_channel } = require('../../../config-channels.json');
require('dotenv/config');

module.exports = {
    data: {
        name: 'dm',
        description: 'DM Message',
        options: [
            {
                name: 'user',
                description: 'เลือก User ที่ต้องการให้บอทส่งข้อความ',
                required: true,
                type: ApplicationCommandOptionType.User,
            },
            {
                name: 'message',
                description: 'ข้อความที่ต้องการส่ง',
                required: true,
                type: ApplicationCommandOptionType.String,
            }
        ]
    },

    run: async ({ interaction, handler }) => {

        const { guild, options } = interaction;

        const users = options.get('user').value;
        const message = options.get('message').value;

        try {
            if (interaction.channelId != command_channel) {
                const channel_c = new EmbedBuilder()
                    .setDescription(`โปรดใช้ command ในช่อง\n<#${command_channel}>`)
                    .setColor('Red');

                interaction.reply({ embeds: [channel_c], ephemeral: true });
            } else if (users === process.env.CLIENT_ID) {
                interaction.reply({ content: 'ไม่สามารถส่งข้อความหา user นี้ได้', ephemeral: true });
            } else {
                try {
                    const user = guild.members.cache.get(users);
                    user.send(`${message}`);

                    interaction.reply({ content: 'DM Succuss', ephemeral: true })
                } catch (error) {
                    const errors = new EmbedBuilder()
                        .setDescription(`เกิดข้อผิดพลาดโปรดลองใหม่\nหากยังไม่ได้โปรดแจ้ง Admin\nเพื่อทำการแก้ไขข้อผิดพลาด`)
                        .setColor('Red');

                    await handler.reloadCommands();
                    interaction.reply({ embeds: [errors], ephemeral: true });
                }
            }
        } catch (error) {
            const errors = new EmbedBuilder()
                .setDescription(`เกิดข้อผิดพลาดโปรดลองใหม่\nหากยังไม่ได้โปรดแจ้ง Admin\nเพื่อทำการแก้ไขข้อผิดพลาด`)
                .setColor('Red');

            await handler.reloadCommands();
            interaction.reply({ embeds: [errors], ephemeral: true });
        }
    },

    options: {
        devOnly: true,
        userPermissions: ['Administrator', 'AddReactions'],
        botPermissions: ['Administrator', 'AddReactions'],
        deleted: false,
    },
}