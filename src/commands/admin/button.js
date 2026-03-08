const { ButtonStyle, ApplicationCommandOptionType, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { ButtonKit } = require('commandkit');

module.exports = {
    data: {
        name: 'create-button',
        description: 'create a new button',
        options: [
            {
                name: 'custom-id',
                description: 'Custom button name',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },

    run: async ({ interaction, handler, client }) => {
        const customId = interaction.options.get('custom-id').value; //ดึงค่าจาก options

        // await interaction.reply({content: 'ตั้งค่าปุ่ม', ephemeral: true})

        const setButton = new ButtonKit() //ปุ่มสำหรับตั้งค่า
            .setCustomId(`openModle-${customId}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Set custom button');

        const buttonRow = new ActionRowBuilder().addComponents(setButton);

        await interaction.reply({ //ส่งปุ่มตั้งค่า
            components: [buttonRow],
            ephemeral: true
        });


        const modalSetButton = new ModalBuilder()
            .setCustomId(`setButton-${customId}`)
            .setTitle('Set custom button');

        const labelButton = new TextInputBuilder()
            .setCustomId('labelInput')
            .setLabel('ข้อความบนปุ่ม')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const styleButton = new TextInputBuilder()
            .setCustomId('styleInput')
            .setLabel('สไตล์ของปุ่ม')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Example : danger , primary , secondary , success')
            .setRequired(false);


        const firsActionRow = new ActionRowBuilder()
            .addComponents(labelButton);

        const secondActionRow = new ActionRowBuilder()
            .addComponents(styleButton);

        modalSetButton.addComponents(firsActionRow, secondActionRow,);

        client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;

            if (interaction.customId === `openModle-${customId}`) {
                interaction.showModal(modalSetButton);
            }
        });

        // setButton.onClick(
        //     (interaction) => {
        //         interaction.showModal(modalSetButton);
        //     },
        //     { message },
        // );

        const buttonSetEmbed = new ButtonKit()
            .setCustomId(`setEmbed-${customId}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel('Set embed');

        const buttonEmbedRow = new ActionRowBuilder().addComponents(buttonSetEmbed);


        const embedSetButton = new ModalBuilder()
            .setCustomId(`setEmbeds-${customId}`)
            .setTitle('Set embed');

        const titleEmbed = new TextInputBuilder()
            .setCustomId('titleInput')
            .setLabel('Title')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const descriptionEmbed = new TextInputBuilder()
            .setCustomId('descriptionInput')
            .setLabel('Description')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const firsSetActionRow = new ActionRowBuilder()
            .addComponents(titleEmbed);

        const seconSetdActionRow = new ActionRowBuilder()
            .addComponents(descriptionEmbed);

        embedSetButton.addComponents(firsSetActionRow, seconSetdActionRow);

        const filter = (interaction) => interaction.customId === `setButton-${customId}`;
        interaction
            .awaitModalSubmit({ filter, time: 60_000 })
            .then(async (modalInteraction) => {

                const labelValue = modalInteraction.fields.getTextInputValue('labelInput');
                const styleValue = modalInteraction.fields.getTextInputValue('styleInput');

                var style = {};
                if (styleValue === 'danger') {
                    style = ButtonStyle.Danger;
                } else if (styleValue === 'primary') {
                    style = ButtonStyle.Primary;
                } else if (styleValue === 'secondary') {
                    style = ButtonStyle.Secondary;
                } else if (styleValue === 'success') {
                    style = ButtonStyle.Success;
                } else {
                    style = ButtonStyle.Secondary;
                }


                const message = await modalInteraction.update({
                    components: [buttonEmbedRow],
                    ephemeral: true,
                    content: 'โปรดตั้งค่า embed'
                });

                client.on('interactionCreate', async interaction => {
                    if (!interaction.isButton()) return; // ตรวจสอบว่าเป็นปุ่มหรือไม่

                    if (interaction.customId === `setEmbed-${customId}`) {
                        interaction.showModal(embedSetButton);
                        const filter = (interaction) => interaction.customId === `setEmbeds-${customId}`;
                        interaction
                            .awaitModalSubmit({ filter, time: 60_000 })
                            .then(async (modalInteraction) => {
                                const titleValue = modalInteraction.fields.getTextInputValue('titleInput');
                                const descriptionValue = modalInteraction.fields.getTextInputValue('descriptionInput');

                                const embed = new EmbedBuilder({
                                    title: titleValue || undefined,
                                    description: descriptionValue || undefined,
                                }).setColor('Blue');

                                await modalInteraction.reply({ content: 'finish!! ', ephemeral: true, components: [buttonDoneRow] });

                                const doneEmbed = new EmbedBuilder()
                                    .setTitle('Click Done for send.')
                                    .setColor('Green');

                                const buttonDone = new ButtonKit()
                                    .setCustomId(`done-${customId}`)
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel('Done!');

                                const buttonDoneRow = new ActionRowBuilder().addComponents(buttonDone);
                                const filter = (interaction) => interaction.customId === `setButton-${customId}`;
                                interaction
                                    .awaitModalSubmit({ filter, time: 60_000 })
                                    .then(async (modalInteraction) => {

                                    })
                                // const button = new ButtonKit()
                                //     .setCustomId(customId)
                                //     .setStyle(style)
                                //     .setLabel(labelValue || 'default');

                                // const row = new ActionRowBuilder().addComponents(button);

                                // await modalInteraction.channel.send({
                                //     embeds: [embed],
                                //     components: [row]
                                // });

                                console.log(`สร้างปุ่มใหม่ ID : ${customId}`);

                            })
                            .catch((err) => {
                                console.log(err)
                            });
                    }
                });

            })
            .catch((err) => {
                console.log(err)
            });

    },

    options: {
        devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false,
    },
}
