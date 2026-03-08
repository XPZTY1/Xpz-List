const { Client, IntentsBitField } = require('discord.js');
const { CommandKit } = require('commandkit');
const cron = require('node-cron');
const { exec } = require('child_process');
require('dotenv/config');
const { devs, server, role } = require('../config.json');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildPresences,
    ]
});

new CommandKit({
    client,
    eventsPath: `${__dirname}/events`,
    commandsPath: `${__dirname}/commands`,
    devUserIds: devs,
    devGuildIds: [server],
    devRoleIds: role,
    bulkRegister: true,
});


// ตั้งเวลาการรีสตาร์ทบอท (ทุกวันเวลาเที่ยงคืน)
cron.schedule('0 0 * * *', () => {
    console.log('Restarting bot...');
    exec('pm2 restart bot', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error restarting bot: ${error}`);
            return;
        }
        console.log(`Bot restarted: ${stdout}`);
    });
});

client.login(process.env.TOKEN);

module.exports = client;