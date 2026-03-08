const { ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { command_channel } = require('../../../config-channels.json');

module.exports = {
    data: {
        name: 'create-room',
        description: 'สร้างห้องสำหรับ list',
    },
    run: async ({ interaction, client }) => {

        

        const restrictedRoleIDs = ['1235933039788556389']; // เปลี่ยนเป็น ID ของยศที่ไม่สามารถใช้คำสั่งได้

        // ตรวจสอบว่าสมาชิกมียศที่ไม่สามารถใช้คำสั่งได้หรือไม่
        const memberRoles = interaction.member.roles.cache.map(role => role.id);
        const isRestricted = memberRoles.some(roleID => restrictedRoleIDs.includes(roleID));

        if (interaction.channelId == command_channel) {
            // ถ้าสมาชิกมียศที่ไม่สามารถใช้คำสั่งได้
            if (isRestricted) {
                await interaction.reply({ content: 'คุณได้ทำการสร้างห้องไปแล้ว สามารถสร้างได้ห้องเดียว', ephemeral: true });
                return;
            }

            if (!isRestricted) {
                // const role = interaction.guild.roles.cache.get('1230392687954235483');
                function convertToLowerCase(message) {
                    return message.toLowerCase();
                }
                const name = interaction.user.globalName;
                const name2 = convertToLowerCase(name);
        
        
                const channelName = `◞📖รายการ-${name2}`

                const { guild } = interaction;

                const category = '1235859465945743371';

                await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.ViewChannel],
                            deny: [PermissionsBitField.Flags.SendMessages],
                        },
                        // {
                        //     id: role.id,
                        //     allow: [PermissionsBitField.Flags.ViewChannel],
                        //     deny: [PermissionsBitField.Flags.SendMessages],
                        // },
                    ],
                });

                const list = interaction.guild.channels.cache.find(channel => channel.name === channelName);

                const channel_c = new EmbedBuilder()
                    .setDescription(`สร้างห้อง ${list} เรียบร้อย`)
                    .setColor('Green');

                await interaction.reply({ embeds: [channel_c], ephemeral: true });


                const roleID = '1235933039788556389';
                const roles = interaction.guild.roles.cache.get(roleID);
                const member = interaction.guild.members.cache.get(interaction.user.id);

                await member.roles.add(roles);
            }
        } else {
            const channel_c = new EmbedBuilder()
                .setDescription(`โปรดใช้ command ในช่อง\n<#${command_channel}>`)
                .setColor('Red');

            interaction.reply({ embeds: [channel_c], ephemeral: true });
        }

    },
    options: {
        devOnly: false,
        // userPermissions: ['Administrator', 'AddReactions'],
        // botPermissions: ['Administrator', 'AddReactions'],
        deleted: true,
    }
}