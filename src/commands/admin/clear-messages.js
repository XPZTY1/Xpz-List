const { EmbedBuilder } = require('discord.js');
const { re } = require('mathjs');

module.exports = {
    data: {
        name: 'clear-messages',
        description: 'ลบข้อความทั้งหมดในช่องที่ใช้คำสั่งนี้',
    },

    run: async ({ client, interaction }) => {
        const channel = interaction.channel;
        const limit = 100;  // จำกัดจำนวนข้อความสูงสุดต่อรอบ
        const user = interaction.user; // ผู้ที่ใช้คำสั่ง

        // ✅ defer เพื่อให้ไม่หมดอายุ
        await interaction.deferReply({ ephemeral: true });

        let totalDeletedMessages = 0;
        let messages;

        // ตรวจสอบว่ามีข้อความในช่องหรือไม่
        let messagesCount = (await channel.messages.fetch({ limit: 100 })).size;
        
        // ถ้ามีข้อความในช่องมากกว่า 0
        while (messagesCount > 0) {
            // Fetch ข้อความในช่อง
            messages = await channel.messages.fetch({ limit: limit });
            const messagesToDelete = messages.filter(msg => msg);

            // ลบข้อความในจำนวนที่ fetch ได้
            if (messagesToDelete.size > 0) {
                await channel.bulkDelete(messagesToDelete);
                totalDeletedMessages += messagesToDelete.size;
            }

            // อัพเดตจำนวนข้อความที่ยังคงอยู่
            messagesCount = (await channel.messages.fetch({ limit: 100 })).size;
        }

        // สร้าง Embed เมื่อการลบเสร็จ
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Clear', iconURL: client.user.avatarURL() })
            .setTitle(`ลบข้อความแล้ว ${totalDeletedMessages} ข้อความ`)
            .setTimestamp()
            .setColor('Random');

        // ตอบกลับเฉพาะผู้ใช้ที่ใช้คำสั่ง
        await interaction.editReply({ embeds: [embed],  ephemeral: true });
    },

    options: {
        devOnly: true,
        deleted: false,
    },
};
