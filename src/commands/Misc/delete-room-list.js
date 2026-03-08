const { EmbedBuilder } = require('discord.js');
const { command_channel } = require('../../../config-channels.json');

module.exports = {
    data: {
        name: 'delete-room',
        description: 'ลบช่องสำหรับ list',
    },

    run: async ({ interaction, client }) => {
        try {

            function convertToLowerCase(message) {
                return message.toLowerCase();
            }
            const name = interaction.user.globalName;
            const name2 = convertToLowerCase(name);
    
    
            
            if (interaction.channelId == command_channel) {
                // กำหนดชื่อของห้องที่ต้องการลบ
                const channelName = `◞📖รายการ-${name2}`

                // ค้นหาห้องที่มีชื่อตรงกับที่กำหนด
                const channelToDelete = interaction.guild.channels.cache.find(channel => channel.name === channelName);

                // ถ้าหากห้องที่ต้องการลบมีอยู่จริง
                if (channelToDelete) {
                    // ลบห้อง

                    const channel_c = new EmbedBuilder()
                        .setDescription(`ช่อง "${channelName}" ได้ถูกลบเรียบร้อย`)
                        .setColor('Yellow');

                    interaction.reply({ embeds: [channel_c], ephemeral: true });


                    await channelToDelete.delete();

                    const roleID = '1235933039788556389';
                    const roles = interaction.guild.roles.cache.get(roleID);
                    const member = interaction.guild.members.cache.get(interaction.user.id);

                    await member.roles.remove(roles);
                } else {
                    // หากห้องที่ต้องการลบไม่พบ
                    const channel_x = new EmbedBuilder()
                        .setDescription(`ไม่พบช่อง "${channelName}"`)
                        .setColor('Red');
                     interaction.reply({ embeds: [channel_x], ephemeral: true });
                }
            } else {
                const channel_c = new EmbedBuilder()
                    .setDescription(`โปรดใช้ command ในช่อง\n<#${command_channel}>`)
                    .setColor('Red');

                interaction.reply({ embeds: [channel_c], ephemeral: true });
            }
        } catch (error) {
            console.error('Error deleting channel:', error);
            await interaction.reply('An error occurred while deleting the channel.');
        }
    },
    options: {
        devOnly: false,
        // userPermissions: ['Administrator', 'AddReactions'],
        // botPermissions: ['Administrator', 'AddReactions'],
        deleted: true,
    }
}