const { server } = require('../../../config.json');
module.exports = (member, client, interaction, handler) => {
    let guild = client.guilds.cache.get(server);
    var total = guild.memberCount;
    var bot = guild.members.cache.filter(member => member.user.bot).size;
    var members = total - bot;

    client.channels.cache.get('1235488157026357268').setName(`₊˚🌸꒱・TOTAL : ${member.guild.memberCount}`);
    client.channels.cache.get('1235488481300447276').setName(`₊˚🌟꒱・MEMBER : ${members}`);
    client.channels.cache.get('1235488503966466068').setName(`₊˚🌻꒱・BOT : ${member.guild.members.cache.filter(member => member.user.bot).size}`);
}