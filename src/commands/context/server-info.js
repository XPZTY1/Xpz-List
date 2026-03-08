const { ApplicationCommandType, EmbedBuilder } = require("discord.js");
const { command_channel } = require('../../../config-channels.json');

module.exports = {
    data: {
        name: 'Server-info',
        type: ApplicationCommandType.User,
    },

    run: async ({ interaction, client, handler }) => {
        const { guild } = interaction;

        try {
            const embed = new EmbedBuilder({
                author: { name: guild.name, icon_url: guild.iconURL({ size: 256 }) },
                title: 'Server Info',
                description: 'ข้อมูลเซิฟเวอร์',
                fields: [
                    {
                        name: `Owner`,
                        value: `\`${(await guild.fetchOwner()).user.tag}\``,
                        inline: true,
                    },
                    {
                        name: 'Text Channels',
                        value: `\`${guild.channels.cache.filter((c) => c.type === 0).toJSON().length}\``,
                        inline: true,
                    },
                    {
                        name: 'Voice Channels',
                        value: `\`${guild.channels.cache.filter((c) => c.type === 2).toJSON().length}\``,
                        inline: true,
                    },
                    {
                        name: 'Category Channels',
                        value: `\`${guild.channels.cache.filter((c) => c.type === 4).toJSON().length}\``,
                        inline: true,
                    },
                    {
                        name: 'Members',
                        value: `\`${guild.memberCount}\``,
                        inline: true,
                    },
                    {
                        name: 'Roles',
                        value: `\`${guild.roles.cache.size}\``,
                        inline: true,
                    },
                    {
                        name: 'Roles List',
                        value: guild.roles.cache.toJSON().join(' '),
                        inline: true,
                    },

                ],
                footer: { text: `ID: ${guild.id} | Server Created: ${guild.createdAt.toDateString()}` },
            });

            if (interaction.channelId != command_channel) {


                const channel_c = new EmbedBuilder()
                    .setDescription(`โปรดใช้ command ในช่อง\n<#${command_channel}>`)
                    .setColor('Red');

                interaction.reply({ embeds: [channel_c], ephemeral: true });


            } else {

                interaction.reply({ embeds: [embed] });
                // client.channels.fetch(command_channel)
                // .then(channel => channel.send({ embeds: [embed], content: `${interaction.user}` }));
            }

        } catch (error) {
            const errors = new EmbedBuilder()
                .setDescription(`เกิดข้อผิดพลาดโปรดลองใหม่\nหากยังไม่ได้โปรดแจ้ง Admin\nเพื่อทำการแก้ไขข้อผิดพลาด`)
                .setColor('Red');

            await handler.reloadCommands();
            interaction.reply({ embeds: [errors], ephemeral: true });
            console.log(error)
        };

    },

    options: {
        // devOnly: true,
        // userPermissions: ['Administrator', 'AddReactions'],
        // botPermissions: ['Administrator', 'AddReactions'],
        // deleted: true,
    },
};