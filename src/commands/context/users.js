const { ApplicationCommandType, EmbedBuilder, RoleFlagsBitField } = require("discord.js");
const { command_channel } = require('../../../config-channels.json');
const moment = require('moment');

module.exports = {
    data: {
        name: 'User',
        type: ApplicationCommandType.User,
    },

    run: async ({ interaction, client, handler }) => {

        try {



            const targetUser = interaction.targetUser;
            const member = interaction.guild.members.cache.get(targetUser.id);
            const roles = member.roles.cache.filter(role => role.name !== '@everyone').map(role => role);

            const { guild } = interaction;


            if (interaction.channelId != command_channel) {

                const channel_c = new EmbedBuilder()
                    .setDescription(`โปรดใช้ command ในช่อง\n<#${command_channel}>`)
                    .setColor('Red');

                interaction.reply({ embeds: [channel_c], ephemeral: true });
            } else {
                const members = targetUser.id;
                const selectedUser = guild.members.cache.get(members);
                const status = selectedUser.presence?.status;

                var statuss = '';
                if (status === 'online') {
                    statuss = 'ออนไลน์ 🟢';
                }else if(status === 'idle'){
                    statuss = 'ไม่อยู่ 🌙';
                }else if(status === 'dnd'){
                    statuss = 'ห้ามรบกวน ⛔';
                }else if(status === 'offline' || !status){
                    statuss = 'ออฟไลน์ ⚫';
                };


                var nickname = ''
                if(member.nickname){
                    nickname = member.nickname;
                }else if(!member.nickname){
                    nickname = 'ไม่มีชื่อเล่น';
                }

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${targetUser.globalName ?? targetUser.username}`, iconURL: targetUser.displayAvatarURL() })
                    .setDescription(`Name : \`${targetUser.globalName ?? targetUser.username}\`\nNickname : \`${nickname}\`\nTag : \`${targetUser.tag}\`\nID : \`${targetUser.id}\`\nStatus : \`${statuss}\`\nRole : ${roles.join(' ')}`)
                    .setThumbnail(targetUser.displayAvatarURL())
                    .setFooter({ text: `เข้าร่วมเมื่อ: ${moment(targetUser.joinedAt).format('YYYY-MM-DD HH:mm:ss')}`, iconURL: guild.iconURL({ size: 256 }) })
                    .setColor('Random');

                interaction.reply({ embeds: [embed] });
            }


            // console.log(status);
            // if(targetUser.presence?.status === 'oline'){
            //     console.log('Online');
            // }


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