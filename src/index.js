const { Client, IntentsBitField } = require('discord.js');
const { CommandKit } = require('commandkit');
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


// หมายเหตุ: เดิมมี cron job สั่ง `pm2 restart bot` ทุกเที่ยงคืน
// แต่ Render ไม่ได้รันแอปผ่าน pm2 (ใช้ Node process ตรงๆ) จึงลบออก
// ถ้าต้องการ auto-restart เป็นระยะ ให้ตั้งค่า Health Check บน Render แทน

client.login(process.env.TOKEN);

module.exports = client;