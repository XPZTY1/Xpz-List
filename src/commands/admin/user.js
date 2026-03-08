const { Client, Integration, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { ban_channel, command_channel } = require('../../../config-channels.json');

module.exports = {


    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */



    data: {
        name: 'user',
        description: 'จัดการ User',
        options: [
            {
                name: 'options',
                description: 'selection option',
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'ban',
                        value: 'ban'
                    },
                    {
                        name: 'kick',
                        value: 'kick'
                    },
                    {
                        name: 'timeout',
                        value: 'timeout'
                    }

                ],
            },
            {
                name: 'user',
                description: 'select user',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'reason',
                description: 'เหตุผลการแบน',
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: 'time',
                description: 'time minute',
                type: ApplicationCommandOptionType.Number,
                required: false,
            }
        ],


    },



    run: async ({ interaction, client, handler }) => {


        const option = interaction.options.get('options').value;
        const targetUserId = interaction.options.get('user').value;
        const targetUser = await interaction.guild.members.fetch(targetUserId);
        const reason = interaction.options.get('reason')?.value || 'No reason provided';
        const time = interaction.options.get('time')?.value || 1;


        var timeSet = time * 60_000;

        await interaction.deferReply();

        
        try {
            if (interaction.channelId == command_channel) {
                if (option == 'ban') {


                    const embedBan = new EmbedBuilder()
                        .setDescription(`User: ${targetUser} โดน${option}\nสาเหตุ: ${reason}`)
                        .setColor('Red')
                        .setTimestamp()
                        .setThumbnail(targetUser.user.avatarURL());
                    await targetUser.send({ embeds: [embedBan] })
                    await targetUser.ban({ reason });
                    await interaction.editReply({content: `User ${targetUser} was ${option}\nReason: ${reason}`});
                    await client.channels.fetch(ban_channel)
                        .then(channel => channel.send({ embeds: [embedBan] }));

                } else if (option == 'kick') {


                    const embedKick = new EmbedBuilder()
                        .setDescription(`User: ${targetUser} โดน${option}\nสาเหตุ: ${reason}`)
                        .setColor('Red')
                        .setTimestamp()
                        .setThumbnail(targetUser.user.avatarURL());

                    await targetUser.send({ embeds: [embedKick] })
                    await targetUser.kick();
                    await interaction.editReply({content: `User ${targetUser} was Kick\nReason: ${reason}`});
                    await client.channels.fetch(ban_channel)
                        .then(channel => channel.send({ embeds: [embedKick] }));

                } else if (option == 'timeout') {


                    const embedTimeout = new EmbedBuilder()
                        .setDescription(`User: ${targetUser} โดน${option}\nสาเหตุ: ${reason}\n${time} minute`)
                        .setColor('Red')
                        .setTimestamp()
                        .setThumbnail(targetUser.user.avatarURL());

                    await targetUser.send({ embeds: [embedTimeout] })
                    await targetUser.timeout(timeSet);
                    await interaction.editReply({content: `User ${targetUser} was Timeout\n ${time} minute`});
                    await client.channels.fetch(ban_channel)
                        .then(channel => channel.send({ embeds: [embedTimeout] }));
                }
            } else {
                const channel_c = new EmbedBuilder()
                    .setDescription(`โปรดใช้ command ในช่อง\n<#${command_channel}>`)
                    .setColor('Red');

                interaction.editReply({ embeds: [channel_c], ephemeral: true });
            }
        } catch (error) {
            const errors = new EmbedBuilder()
                .setDescription(`เกิดข้อผิดพลาดโปรดลองใหม่\nหากยังไม่ได้โปรดแจ้ง Admin\nเพื่อทำการแก้ไขข้อผิดพลาด`)
                .setColor('Red');

            await handler.reloadCommands();
            interaction.editReply({ embeds: [errors], ephemeral: true });
            console.log(error);
        }

    },


    options: {
        devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false,
    },


};