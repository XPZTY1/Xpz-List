const fs = require('fs');

module.exports = () => {
    const commandFolders = fs.readdirSync('./src/commands').filter(folder => !folder.startsWith('.'));
    const commandByCategory = {};

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
        const commands = [];

        for (const file of commandFiles) {
            const command = require(`../../commands/${folder}/${file}`);
            commands.push({name: command?.data?.name ?? 'Unknown', description: command?.data?.description ?? 'No description provided' });
        }

        // commandByCategory[folder] = commands;
        // console.log(folder);
        // console.table(commands);
        
        
    }
};