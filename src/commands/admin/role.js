const { EmbedBuilder, ApplicationCommandOptionType} = require('discord.js');
const { command_channel } = require('../../../config-channels.json')

module.exports = {
    data: {
        name: 'role',
        description: 'Add role / Remove role',
        options: [
            {
                name: 'add-remove',
                description: 'add or remove',
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'add',
                        value: 'add',
                    },
                    {
                        name: 'remove',
                        value: 'remove',
                    }
                ],
            },
            {
                name: 'user',
                description: 'Selection user',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'roles',
                description: 'Selection role',
                type: ApplicationCommandOptionType.Role,
                required: true
            }
        ],
    },


    run: async ({ interaction, handler, client }) => {

        /* --------------------------------------------------------------------------------------- */
        // const interaction

        const option = interaction.options.get('add-remove').value;
        const user = interaction.options.getMember('user');
        const role = interaction.options.getRole('roles');

        /* --------------------------------------------------------------------------------------- */

        // embed add role

        const embedADD = new EmbedBuilder()
            .setDescription(`ได้ทำการให้ยศ \n ||${role.name}|| ให้แก่ ||${user.user.username}||`)
            .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL()})
            .setTimestamp()
            .setThumbnail(user.user.displayAvatarURL())
            .setColor('Green');



        /* --------------------------------------------------------------------------------------- */

        // embed remove role

        const embedREMOVE = new EmbedBuilder()
            .setDescription(`ได้ทำการลบยศ \n ||${role.name}|| ให้แก่ ||${user.user.username}||`)
            .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL()})
            .setTimestamp()
            .setThumbnail(user.user.displayAvatarURL())
            .setColor('Red');


        /* --------------------------------------------------------------------------------------- */
        // channel command

        if (interaction.channelId == command_channel) {


            /* --------------------------------------------------------------------------------------- */

            // add role
            if (option == 'add') {
                try {
                    await user.roles.add(role);

                    interaction.reply({
                        embeds: [embedADD],
                        ephemeral: true
                    });
                } catch (error) {
                    const errors = new EmbedBuilder()
                        .setDescription(`เกิดข้อผิดพลาดโปรดลองใหม่\nหากยังไม่ได้โปรดแจ้ง Admin\nเพื่อทำการแก้ไขข้อผิดพลาด`)
                        .setColor('Red');

                    await handler.reloadCommands();
                    interaction.reply({ embeds: [errors], ephemeral: true });
                }
            }

            /* --------------------------------------------------------------------------------------- */
            // remove role

            if (option == 'remove') {
                try {

                    await user.roles.remove(role);

                    interaction.reply({
                        embeds: [embedREMOVE],
                        ephemeral: true
                    });
                } catch (error) {
                    const errors = new EmbedBuilder()
                        .setDescription(`เกิดข้อผิดพลาดโปรดลองใหม่\nหากยังไม่ได้โปรดแจ้ง Admin\nเพื่อทำการแก้ไขข้อผิดพลาด`)
                        .setColor('Red');

                    await handler.reloadCommands();
                    interaction.reply({ embeds: [errors], ephemeral: true });
                }
            }


            /* --------------------------------------------------------------------------------------- */


        // not channel command
        } else {
            const channel_c = new EmbedBuilder()
                .setDescription(`โปรดใช้ command ในช่อง\n<#${command_channel}>`)
                .setColor('Red');

            interaction.reply({ embeds: [channel_c], ephemeral: true });
        }

        /* --------------------------------------------------------------------------------------- */
    },

    options: {
        devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false,
    },

};