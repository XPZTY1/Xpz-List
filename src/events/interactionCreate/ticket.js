const { ChannelType, PermissionsBitField, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = async (interaction) => {
    if (!interaction.isButton()) return; // ตรวจสอบว่าเป็นปุ่มหรือไม่



    const { guild } = interaction;


    const restrictedRoleIDs = ['1357336009402093569']; // เปลี่ยนเป็น ID ของยศที่ไม่สามารถใช้คำสั่งได้
    // ตรวจสอบว่าสมาชิกมียศที่ไม่สามารถใช้คำสั่งได้หรือไม่
    const memberRoles = interaction.member.roles.cache.map(role => role.id);
    const isRestricted = memberRoles.some(roleID => restrictedRoleIDs.includes(roleID));


    function convertToLowerCase(message) {
        return message.toLowerCase();
    }
    const name = interaction.user.globalName;
    const name2 = convertToLowerCase(name);


    const channelName = `ticket-${name2}`;

    if (interaction.customId === 'delete_ticket_room') {

        if (isRestricted) {
            const channel = interaction.guild.channels.cache.find(channel => channel.name === channelName);

        try {
            await channel.delete();
            await interaction.reply({ flags: MessageFlags.Ephemeral, content: `ลบช่อง ticket-${name2} แล้ว` });
            const roleID = '1357336009402093569';
            const roles = interaction.guild.roles.cache.get(roleID);
            const member = interaction.guild.members.cache.get(interaction.user.id);

            member.roles.remove(roles);
        } catch (error) {

            await interaction.reply({
                content: `ไม่พบช่อง ticket-${name2}`,
                flags: MessageFlags.Ephemeral
            });

            console.log(error)
        }

        }
    }



    if (interaction.customId === 'create_ticket_room') {

        if (!isRestricted) {
            const category_1 = '1357312925500575755';

            await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: category_1,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [
                            PermissionsBitField.Flags.ViewChannel,
                        ],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        deny: [],
                    },
                ]
            });


            const embed = new EmbedBuilder()
                .setDescription('แจ้งปัญหาเลยครับแล้ว Admin จะมาตอบ')
                .setColor('Random');

            const channel = interaction.guild.channels.cache.find(channel => channel.name === channelName);

            await channel.send({ embeds: [embed] })


            interaction.reply({
                content: `${channel}`,
                flags: MessageFlags.Ephemeral
            });

            const roleID = '1357336009402093569';
            const roles = interaction.guild.roles.cache.get(roleID);
            const member = interaction.guild.members.cache.get(interaction.user.id);

            member.roles.add(roles);
        }



    }




}
