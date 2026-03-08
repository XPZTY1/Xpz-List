const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { command_channel } = require('../../../config-channels.json');


module.exports = {
    data: {
        name: 'diary', //ชื่อคำสั่ง
        description: 'เขียน Diary', //คำอธิบายคำสั่ง
    },


    run: async ({ interaction, client }) => {

        if (interaction.channelId === command_channel) {
            const modal = new ModalBuilder()
                .setCustomId(interaction.user.id)
                .setTitle('Diary');

            const Diary = new TextInputBuilder()
                .setCustomId('DiaryInput')
                .setLabel('เรื่องราวของคุณ')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const firsActionRow = new ActionRowBuilder()
                .addComponents(Diary);

            modal.addComponents(firsActionRow);

            await interaction.showModal(modal);



            const filter = (interaction) => interaction.customId === interaction.user.id;

            interaction
                .awaitModalSubmit({ filter, time: 0 })
                .then(async (modalInteraction) => {
                    const DiaryValue = modalInteraction.fields.getTextInputValue('DiaryInput');

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                        .setTitle('Diary')
                        .setColor("Random")
                        .setTimestamp()
                        .setDescription(`${DiaryValue}`);

                    modalInteraction.reply({content: 'เขียนไดอารี่และส่งเรียบร้อย', ephemeral: true })

                    client.channels.fetch('1321047295965528094')
                        .then(channel => channel.send({ embeds: [embed] }))
                        .catch((err) => {
                            console.log(err)
                        });


                })
                .catch((err) => {
                    console.log(err)
                })
        }else {
            const channel_c = new EmbedBuilder()
                .setDescription(`โปรดใช้ command ในช่อง\n<#${command_channel}>`)
                .setColor('Red');

            interaction.reply({ embeds: [channel_c], ephemeral: true });
        }


    },
    options: {
        // devOnly: true,
        // userPermissions: ['Administrator', 'AddReactions'],
        // botPermissions: ['Administrator', 'AddReactions'],
        deleted: true,
    },
}