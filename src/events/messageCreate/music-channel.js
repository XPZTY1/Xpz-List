const {music_channel} = require('../../../config-channels.json');

module.exports = (message, client) => {
    if(message.channelId == music_channel){
        if(!message.content.startsWith('m!')){
            if(message.author.username == 'Xpz'){
                return;
            }else if(message.author.username !== 'Jockie Music'){
                message.channel.bulkDelete(1);
    
                message.reply({content :'ห้องนี้สำหรับเปิดเพลงเท่านั้น ครับ'});
            }
        }
    };
    
};