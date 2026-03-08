const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ApplicationCommandType,
    InteractionType,
    MessageFlags
} = require('discord.js');

module.exports = {
    data: {
        name: 'add-button',
        type: ApplicationCommandType.Message
    },

    run: async ({ interaction, client }) => {
        const targetMessage = await interaction.channel.messages.fetch(interaction.targetId);

        const modal = new ModalBuilder()
            .setCustomId(`add_button_modal_${targetMessage.id}`)
            .setTitle('ตั้งค่าปุ่มใหม่');

        const labelInput = new TextInputBuilder()
            .setCustomId('label_input')
            .setLabel('Label ของปุ่ม')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const customIdInput = new TextInputBuilder()
            .setCustomId('custom_id_input')
            .setLabel('Custom ID')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const styleInput = new TextInputBuilder()
            .setCustomId('style_input')
            .setLabel('Style (Primary, Secondary, Success, Danger)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(labelInput),
            new ActionRowBuilder().addComponents(customIdInput),
            new ActionRowBuilder().addComponents(styleInput)
        );

        await interaction.showModal(modal);

        const modalSubmitHandler = async (modalInteraction) => {
            if (
                modalInteraction.type !== InteractionType.ModalSubmit ||
                modalInteraction.customId !== `add_button_modal_${targetMessage.id}` ||
                modalInteraction.user.id !== interaction.user.id
            ) return;

            const label = modalInteraction.fields.getTextInputValue('label_input');
            const customId = modalInteraction.fields.getTextInputValue('custom_id_input');
            const styleText = modalInteraction.fields.getTextInputValue('style_input').toLowerCase();

            const styleMap = {
                primary: ButtonStyle.Primary,
                secondary: ButtonStyle.Secondary,
                success: ButtonStyle.Success,
                danger: ButtonStyle.Danger
            };

            const style = styleMap[styleText];
            if (!style) {
                await modalInteraction.reply({
                    content: '❌ Style ไม่ถูกต้อง (ใช้ Primary, Secondary, Success, Danger)',
                    flags: MessageFlags.Ephemeral
                });
                client.removeListener('interactionCreate', modalSubmitHandler);
                return;
            }

            if (targetMessage.author.id !== client.user.id) {
                await modalInteraction.reply({
                    content: '❌ ไม่สามารถเพิ่มปุ่มได้ เพราะข้อความนี้ไม่ได้ถูกส่งโดยบอท',
                    flags: MessageFlags.Ephemeral
                });
                client.removeListener('interactionCreate', modalSubmitHandler);
                return;
            }

            const newButton = new ButtonBuilder()
                .setLabel(label)
                .setCustomId(customId)
                .setStyle(style);

            // Clone components เดิม
            let components = targetMessage.components.map(row => ActionRowBuilder.from(row));
            let added = false;

            for (const row of components) {
                if (row.components.length < 5) {
                    row.addComponents(newButton);
                    added = true;
                    break;
                }
            }

            if (!added) {
                if (components.length >= 5) {
                    await modalInteraction.reply({
                        content: '❌ ไม่สามารถเพิ่มปุ่มได้ เพราะถึงขีดจำกัด 5 แถวแล้ว',
                        flags: MessageFlags.Ephemeral
                    });
                    client.removeListener('interactionCreate', modalSubmitHandler);
                    return;
                }

                const newRow = new ActionRowBuilder().addComponents(newButton);
                components.push(newRow);
            }

            try {
                await targetMessage.edit({
                    content: targetMessage.content,
                    components: components
                });

                await modalInteraction.reply({
                    content: '✅ เพิ่มปุ่มเรียบร้อยแล้ว!',
                    flags: MessageFlags.Ephemeral
                });
            } catch (err) {
                console.error('❌ Error editing message:', err);
                await modalInteraction.reply({
                    content: '❌ เกิดข้อผิดพลาดในการแก้ไขข้อความ',
                    flags: MessageFlags.Ephemeral
                });
            }

            client.removeListener('interactionCreate', modalSubmitHandler);
        };

        client.on('interactionCreate', modalSubmitHandler);
    },

    options: {
        deleted: false,
    },
};
