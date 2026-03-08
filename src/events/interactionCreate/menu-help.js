module.exports = async (interaction) => {
    if (!interaction.isButton()) return; // ตรวจสอบว่าเป็นปุ่มหรือไม่
        // ตรวจสอบว่า ID ของปุ่มที่คลิกตรงกับที่เราต้องการหรือไม่
        if (interaction.customId === 'add_min') {
            // ทำสิ่งที่ต้องการเมื่อมีการคลิกปุ่ม
            await interaction.reply({content: 'add_min', ephemeral: true });
            await member.roles.add(roles);
            
        }else if(interaction.customId === 'basic'){
            await interaction.reply({content: 'basic', ephemeral: true });
            await member.roles.add(roles);
        }
}