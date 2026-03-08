const { EmbedBuilder } = require('discord.js');
const { sendRandomMathQuestion } = require('../messageCreate/game_match');

module.exports = async (client) => {


    // กำหนดชื่อช่องที่ต้องการให้บอทส่งข้อความ
    const allowedChannelName = '°🔢₊︱คำนวณเลข'; // เปลี่ยนชื่อช่องตามต้องการ

    // หา channel ตามชื่อที่กำหนดและเริ่มเกมอัตโนมัติ
    const channel = client.channels.cache.find(ch => ch.name === allowedChannelName);
    if (channel) {
        // const startEmbed = new EmbedBuilder()
        //     .setTitle('เริ่มเกมบวกลบ')
        //     .setDescription('เกมบวกลบเริ่มต้นขึ้น!')
        //     .setColor('#0099ff');
        // channel.send({ embeds: [startEmbed] });

        await client.channels.fetch('1305024378148229183')
            .then(channel => channel.bulkDelete(100));

        console.log(`เกม °🔢₊︱คำนวณเลข สามารถใช้งานได้`);

        sendRandomMathQuestion(client, channel);

    } else {
        console.log(`ไม่พบช่องที่ชื่อ ${allowedChannelName}`);
    }
};
