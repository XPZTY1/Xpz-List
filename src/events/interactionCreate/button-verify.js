module.exports = async (interaction) => {
    if (!interaction.isButton()) return; // ตรวจสอบว่าเป็นปุ่มหรือไม่
        const roleID = '1236588977151283291';
        const roles = interaction.guild.roles.cache.get(roleID);
        const member = interaction.guild.members.cache.get(interaction.user.id);
        // ตรวจสอบว่า ID ของปุ่มที่คลิกตรงกับที่เราต้องการหรือไม่
        if (interaction.customId === 'verify') {
            // ทำสิ่งที่ต้องการเมื่อมีการคลิกปุ่ม
            await interaction.reply({content: 'verify', ephemeral: true });
            await member.roles.add(roles);
        }
}