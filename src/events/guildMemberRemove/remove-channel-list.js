module.exports = async (member, interaction) => {
        function convertToLowerCase(message) {
                return message.toLowerCase();
        };

        const name = member.user.globalName;
        const name2 = convertToLowerCase(name);

        const channelName = `◞📖รายการ-${name2}`;
        const channelToDelete = member.guild.channels.cache.find(channel => channel.name === channelName);

        if (!channelToDelete) {
                return true;
        } else { await channelToDelete.delete(); }

};