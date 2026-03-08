const {TH_channel} = require('../../../config-channels.json');

module.exports = (message, client) => {
    if(message.channelId == TH_channel){

        if(!message.author.username === 'Xpz' ){
            message.channel.bulkDelete(1);
        }
    };
    
};