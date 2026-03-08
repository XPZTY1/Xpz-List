const { server } = require('../../../config.json');

module.exports = async (client) => {
    let guild = client.guilds.cache.get(server);

    var total = guild.memberCount;
    var bot = guild.members.cache.filter(member => member.user.bot).size;
    var members = total - bot;


    client.channels.cache.get('1235488157026357268').setName(`₊˚🌸꒱・TOTAL : ${guild.memberCount}`);
    client.channels.cache.get('1235488481300447276').setName(`₊˚🌟꒱・MEMBER : ${members}`);
    client.channels.cache.get('1235488503966466068').setName(`₊˚🌻꒱・BOT : ${guild.members.cache.filter(member => member.user.bot).size}`);

    function StatusCout() {
        client.channels.cache.get('1235538254149849189')
            .setName(`🟢 ${guild.members.cache.filter(member => member.presence?.status == 'online').size} 🌙 ${guild.members.cache.filter(member => member.presence?.status == 'idle').size} ⛔ ${guild.members.cache.filter(member => member.presence?.status == 'dnd').size} ⚫ ${guild.members.cache.filter(member => member.presence?.status == 'offline' || !member.presence).size}`)
    } StatusCout();

    

    setInterval(() => {
        StatusCout();
    }, 2000);


}