const {
    ButtonStyle,
    ApplicationCommandOptionType,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    ChannelType,
    PermissionsBitField,
} = require('discord.js');
const { ButtonKit } = require('commandkit');

module.exports = {
    data: {
        name: 'setup-ticket',
        description: 'Create room ticket',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'category-id',
                description: 'Selete category',
                required: true,

            },
        ]
    },

    run: async ({ interaction, handler, client }) => {
        
        const category = interaction.options.getString('category-id');

        const { guild } = interaction;



        const restrictedRoleIDs = ['1230392687954235483']; // เปลี่ยนเป็น ID ของยศที่ไม่สามารถใช้คำสั่งได้

        // ตรวจสอบว่าสมาชิกมียศที่ไม่สามารถใช้คำสั่งได้หรือไม่
        const memberRoles = interaction.member.roles.cache.map(role => role.id);
        const isRestricted = memberRoles.some(roleID => restrictedRoleIDs.includes(roleID));



        await guild.channels.create({
            name: 'ticket',
            type: ChannelType.GuildText,
            parent: category,
            // permissionOverwrites: [
            //     {
            //         id: interaction.guild.id,
            //         deny: [
            //             PermissionsBitField.Flags.SendMessages,
            //             PermissionsBitField.Flags.ViewChannel
            //         ],
            //     },
            //     {
            //         id: memberRoles,
            //         allow: [PermissionsBitField.Flags.ViewChannel],
            //         deny: [],
            //     },
            // ]
        });



        const embed = new EmbedBuilder()
            .setTitle('Ticket')
            .setDescription('แจ้งปัญหาให้คลิกปุ่ม\nห้ามกดเล่นหากหกเล่นจะโดนหมดเวลา')
            .setColor('Aqua');


        const button_create_ticket = new ButtonKit()
            .setCustomId('create_ticket_room')
            .setLabel('Create Ticket')
            .setStyle('Success');

        const button_delete_ticket = new ButtonKit()
            .setCustomId('delete_ticket_room')
            .setLabel('Delete Ticket')
            .setStyle('Danger');

        const buttonEmbedRow = new ActionRowBuilder().addComponents(button_create_ticket).addComponents(button_delete_ticket);


        // กำหนดชื่อของห้องที่ต้องการลบ
        const channelName = `ticket`

        // ค้นหาห้องที่มีชื่อตรงกับที่กำหนด
        const channel = interaction.guild.channels.cache.find(channel => channel.name === channelName);


        await channel.send({ embeds: [embed], components: [buttonEmbedRow] });


        await interaction.reply({ content : 'สร้างห้อง Ticket แล้ว' , ephemeral: true});


    },
    options: {
        devOnly: false,
        // userPermissions: ['Administrator', 'AddReactions'],
        // botPermissions: ['Administrator', 'AddReactions'],
        deleted: false,
    }
}