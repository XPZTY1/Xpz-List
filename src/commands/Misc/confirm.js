const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { confirm_channel } = require('../../../config-channels.json')

module.exports = {
    data: {
        name: 'confirm',
        description: 'ลงชื่อเข้าเซิฟเวิอร์',
    },

    run: async ({ interaction, client }) => {
        if (interaction.channelId != '1235810862162514031') {
            interaction.reply({ content: 'คุณใช้คำสั่งนี้แล้ว', ephemeral: true })
        } else {
            const modal = new ModalBuilder()
                .setCustomId(`comfirm-${interaction.user.id}`)
                .setTitle('Confirm');

            const Name = new TextInputBuilder()
                .setCustomId('nameUserInput')
                .setLabel('ชื่อของคุณ')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const Old = new TextInputBuilder()
                .setCustomId('oldUserInput')
                .setLabel('อายุของคุณ')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const Gender = new TextInputBuilder()
                .setCustomId('genderUserInput')
                .setLabel('เพศของคุณ')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const Status = new TextInputBuilder()
                .setCustomId('statusUserInput')
                .setLabel('สถานะของคุณ')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const firsActionRow = new ActionRowBuilder()
                .addComponents(Name);

            const secondActionRow = new ActionRowBuilder()
                .addComponents(Old);

            const thirdActionRow = new ActionRowBuilder()
                .addComponents(Gender);

            const fifthActionRow = new ActionRowBuilder()
                .addComponents(Status);

            modal.addComponents(firsActionRow, secondActionRow, thirdActionRow, fifthActionRow);

            await interaction.showModal(modal);

            const filter = (interaction) => interaction.customId === `comfirm-${interaction.user.id}`;

            interaction
                .awaitModalSubmit({ filter, time: 0 })
                .then(async (modalInteraction) => {
                    const nameValue = modalInteraction.fields.getTextInputValue('nameUserInput');
                    const oldValue = modalInteraction.fields.getTextInputValue('oldUserInput');
                    const genderValue = modalInteraction.fields.getTextInputValue('genderUserInput');
                    const fifthValue = modalInteraction.fields.getTextInputValue('statusUserInput');

                    const { guild } = interaction;

                    const roleID = '1230392687954235483';
                    const role = interaction.guild.roles.cache.get(roleID);
                    const member = interaction.guild.members.cache.get(interaction.user.id);

                    await member.roles.add(role);

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: interaction.user.tag, iconURL: client.user.avatarURL() })
                        .setColor('Green')
                        .setDescription(`ชื่อ : \`${nameValue}\`\n \nอายุ : \`${oldValue} ปี\`\n \nเพศ : \`${genderValue}\`\n \nสถานะ : \`${fifthValue}\``)
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setFooter({ text: `ID : ${interaction.user.id}` })
                        .setTimestamp();

                    // modalInteraction.reply({ content: `welcome ${nameValue} to server ${guild.name}`, ephemeral: true });
                    modalInteraction.reply({embeds:[embed], content: `${interaction.user}`});
                    // client.channels.fetch(confirm_channel)
                    //     .then(channel => channel.send({ embeds: [embed], content: `${interaction.user}` }));




                    const category = '1235859465945743371';
                    function convertToLowerCase(message) {
                        return message.toLowerCase();
                    }
                    const name = interaction.user.globalName;
                    const name2 = convertToLowerCase(name);

                    await guild.channels.create({
                        name: `◞📖รายการ-${name2}`,
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

                    const roleIDs = '1235933039788556389';
                    const roles = interaction.guild.roles.cache.get(roleIDs);

                    await member.roles.add(roles);
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    },

    options: {
        // devOnly: true,
        // userPermissions: ['Administrator', 'AddReactions'],
        // botPermissions: ['Administrator', 'AddReactions'],
        deleted: false,
    }
}