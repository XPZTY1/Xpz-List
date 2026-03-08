const { EmbedBuilder } = require('discord.js');

module.exports = async (client) => {

    const allowedChannelName = '°🔤₊︱อักษรหรรษา';

    const channel = client.channels.cache.find(ch => ch.name === allowedChannelName);
    if (channel) {
        channel.bulkDelete(100)
            .then(() => {
                const embed = new EmbedBuilder()
                    .setTitle('เกมพิมพ์ตามตัวอักษรเริ่มต้นขึ้น!')
                    .setDescription('พิมพ์ . เพื่อเริ่ม!')
                    .setColor('#0099ff');
                
                channel.send({ embeds: [embed] });
                console.log(`เกม °🔤₊︱อักษรหรรษา สามารถใช้งานได้`);
            })
            .catch(err => console.error('Error while deleting messages:', err));
    } else {
        console.log(`ไม่พบช่องที่ชื่อ ${allowedChannelName}`);
    }
};
