const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

module.exports = async (interaction) => {
    if (!interaction.isButton()) return;

    const channelName = `voice-${interaction.user.username}`;
    const customIdTOGGLE_VISIBILITY = `toggle-visibility-${channelName}`;
    const customLIMIT = `limit-${channelName}`;
    const customLOCK = `lock-${channelName}`;
    const customDIS = `disconnect-user-${interaction.user.username}`;

    const channelVoice = interaction.guild.channels.cache.find(channel => channel.name === channelName);

    if (interaction.customId === customIdTOGGLE_VISIBILITY || interaction.customId === customLIMIT || interaction.customId === customLOCK || interaction.customId === customDIS) {
        // ตรวจสอบว่าช่องมีอยู่หรือไม่
        if (!channelVoice) {
            return interaction.reply({ content: "ไม่พบช่องเสียงที่ตรงกับชื่อผู้ใช้ของคุณ!", ephemeral: true });
        }

        const roleID = '1230392687954235483'; // เปลี่ยนเป็น Role ID ที่คุณต้องการ
        const roles = interaction.guild.roles.cache.get(roleID);

        const role = interaction.guild.roles.cache.get(roleID);

        if (!role) {
            console.error('ไม่พบบทบาทที่มี ID ดังกล่าว');
            return;
        }

        const permissions = channelVoice.permissionsFor(role);
        const isLocked = !permissions.has(PermissionsBitField.Flags.Connect);
        const isHidden = !permissions.has(PermissionsBitField.Flags.ViewChannel);
        const userLimit = channelVoice.userLimit === 0 ? 'ไม่จำกัด' : `${channelVoice.userLimit} คน`;




        if (interaction.customId === customIdTOGGLE_VISIBILITY) {
            // ตรวจสอบสถานะ permission ปัจจุบัน
            const currentPermission = channelVoice.permissionOverwrites.cache.get(roleID);
            const isVisible = currentPermission?.allow?.has(PermissionsBitField.Flags.ViewChannel);


            const embed = new EmbedBuilder()
                .setTitle(`สถานะของช่องเสียง: ${channelVoice}`)
                .addFields(
                    { name: 'สถานะการล็อก', value: isLocked ? '🔒 ล็อก' : '🔓 ไม่ล็อก', inline: true },
                    { name: 'สถานะการมองเห็น', value: isHidden ? '👁️ แสดง' : '👁️‍🗨️ ซ่อน', inline: true },
                    { name: 'จำนวนผู้ใช้สูงสุด', value: userLimit, inline: true }
                );

            if (isVisible) {
                // ถ้ามองเห็น -> เปลี่ยนเป็นมองไม่เห็น
                await channelVoice.permissionOverwrites.edit(roles, {
                    [PermissionsBitField.Flags.ViewChannel]: false,
                });
                // await interaction.reply({ content: "คุณได้ปิดการมองเห็นช่องเสียงสำหรับบทบาทนี้แล้ว!", ephemeral: true });
                await interaction.update({ embeds: [embed] });
            } else {
                // ถ้ามองไม่เห็น -> เปลี่ยนเป็นมองเห็น
                await channelVoice.permissionOverwrites.edit(roles, {
                    [PermissionsBitField.Flags.ViewChannel]: true,
                });
                // await interaction.reply({ content: "คุณได้เปิดการมองเห็นช่องเสียงสำหรับบทบาทนี้แล้ว!", ephemeral: true });
                await interaction.update({ embeds: [embed] });
            }
        } else if (interaction.customId === customLIMIT) {
            const modal = new ModalBuilder()
                .setCustomId(`modal-${customLIMIT}`)
                .setTitle('ตั้งค่าจำนวนผู้ใช้');
            const limitInput = new TextInputBuilder()
                .setCustomId(`limitInput-${interaction.user.id}`)
                .setLabel('จำนวนผู้ใช้ที่สามารถเข้าร่วมช่องเสียงได้')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const firsActionRow = new ActionRowBuilder()
                .addComponents(limitInput);

            modal.addComponents(firsActionRow);

            await interaction.showModal(modal);

            const filter = (interaction) => interaction.customId === `modal-${customLIMIT}`;

            interaction
                .awaitModalSubmit({ filter, time: 0 })
                .then(async (modalInteraction) => {

                    let limit
                    const limitValue = parseInt(modalInteraction.fields.getTextInputValue(`limitInput-${interaction.user.id}`));
                    const lValue = modalInteraction.fields.getTextInputValue(`limitInput-${interaction.user.id}`);

                    if (lValue < 1) {
                        limit = 'ไม่จำกัด';
                    } else  {
                        limit = `${lValue} คน`
                    }

                    const embed = new EmbedBuilder()
                        .setTitle(`สถานะของช่องเสียง: ${channelVoice}`)
                        .addFields(
                            { name: 'สถานะการล็อก', value: isLocked ? '🔓 ไม่ล็อก' : '🔒 ล็อก', inline: true },
                            { name: 'สถานะการมองเห็น', value: isHidden ? '👁️ แสดง' : '👁️‍🗨️ ซ่อน', inline: true },
                            { name: 'จำนวนผู้ใช้สูงสุด', value: limit, inline: true }
                        );


                    await channelVoice.edit({ userLimit: limitValue });
                    modalInteraction.update({ embeds: [embed] });



                });


        } else if (interaction.customId === customLOCK) {
            if (!channelVoice) {
                return interaction.reply({ content: "ไม่พบช่องเสียงที่ตรงกับชื่อผู้ใช้ของคุณ!", ephemeral: true });
            }

            const currentPermission = channelVoice.permissionOverwrites.cache.get(roleID);
            const isLocked = currentPermission?.deny?.has(PermissionsBitField.Flags.Connect) ?? false;

            const embed = new EmbedBuilder()
                .setTitle(`สถานะของช่องเสียง: ${channelVoice}`)
                .addFields(
                    { name: 'สถานะการล็อก', value: isLocked ? '🔓 ไม่ล็อก' : '🔒 ล็อก', inline: true },
                    { name: 'สถานะการมองเห็น', value: isHidden ? '👁️ แสดง' : '👁️‍🗨️ ซ่อน', inline: true },
                    { name: 'จำนวนผู้ใช้สูงสุด', value: userLimit, inline: true }
                );

            if (isLocked) {
                // ปลดล็อกช่องเสียง: อนุญาตให้สมาชิกใหม่เข้าร่วม
                await channelVoice.permissionOverwrites.edit(roles, {
                    [PermissionsBitField.Flags.Connect]: null, // ลบการปฏิเสธสิทธิ์
                });
                await interaction.update({ embeds: [embed] });
                // await interaction.reply({ content:  isLocked ? '🔒 ล็อก' : '🔓 ไม่ล็อก', ephemeral: true });
            } else {
                // ล็อกช่องเสียง: ปิดการอนุญาตให้สมาชิกใหม่เข้าร่วม
                await channelVoice.permissionOverwrites.edit(roles, {
                    [PermissionsBitField.Flags.Connect]: false,
                });
                await interaction.update({ embeds: [embed] });
                // await interaction.reply({ content:  isLocked ? '🔒 ล็อก' : '🔓 ไม่ล็อก', ephemeral: true });
            }


        } else if (interaction.customId === customDIS) {
            const modal = new ModalBuilder()
                .setCustomId(`modal-${customDIS}`)
                .setTitle('ตัดการเชื่อมต่อผู็ใช้');
            const disconnectInput = new TextInputBuilder()
                .setCustomId(`disconnectInput-${interaction.user.id}`)
                .setLabel('ID ของผู้ใช้')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const firsActionRow = new ActionRowBuilder()
                .addComponents(disconnectInput);

            modal.addComponents(firsActionRow);

            await interaction.showModal(modal);

            const filter = (interaction) => interaction.customId === `modal-${customDIS}`;

            interaction
                .awaitModalSubmit({ filter, time: 0 })
                .then(async (modalInteraction) => {
                    const userId = modalInteraction.fields.getTextInputValue(`disconnectInput-${interaction.user.id}`);
                    const member = modalInteraction.guild.members.cache.get(userId);

                    if (!member) {
                        return modalInteraction.reply({ content: "ไม่พบผู้ใช้ที่มี ID นี้ในเซิร์ฟเวอร์!", ephemeral: true });
                    }

                    if (!member.voice.channel) {
                        return modalInteraction.reply({ content: "ผู้ใช้นี้ไม่ได้อยู่ในช่องเสียง!", ephemeral: true });
                    }

                    try {
                        await member.voice.disconnect();
                        await modalInteraction.reply({ content: `ตัดการเชื่อมต่อผู้ใช้ <@${userId}> จากช่องเสียงเรียบร้อยแล้ว!`, ephemeral: true });
                    } catch (error) {
                        console.error(error);
                        await modalInteraction.reply({ content: "เกิดข้อผิดพลาดในการตัดการเชื่อมต่อผู้ใช้!", ephemeral: true });
                    }

                });
        }
    }
};
