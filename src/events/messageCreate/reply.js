const { take_bot } = require('../../../config-channels.json');

module.exports = (message, client) => {
    if (message.channelId == take_bot) {
        if (message.content === 'hello') {
            message.reply('Hello world!');
        }
        if(message.content === 'บั้ม') {
            message.reply('คนนี้ป่าวที่บอกว่าซูชิใส่น้ำปลา');
        }else if(message.content === 'เนย์'){
            message.reply('เนย์หวานเจี๊ยบ');
        }else if(message.content === 'ปาย'){
            message.reply('ปายน้องฟันเหล็ก');
        }else if(message.content === 'เต้'){
            message.reply(' ');
        }

    };


};