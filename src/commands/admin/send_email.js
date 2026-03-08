const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { command_channel } = require('../../../config-channels.json');
require('dotenv/config');
const nodemailer = require('nodemailer');

module.exports = {
    data: {
        name: 'send_email',
        description: 'ส่งอีเมล',
        options: [
            {
                name: 'email',
                description: 'email ที่ต้องการส่งถึง',
                required: true,
                type: ApplicationCommandOptionType.String,
            },
            {
                name: 'message',
                description: 'ข้อความที่ต้องการส่ง',
                required: true,
                type: ApplicationCommandOptionType.String,
            }
        ]
    },

    run: async ({ interaction, handler }) => {

        const { guild, options } = interaction;

        const email = options.get('email').value;
        const message = options.get('message').value;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'phantomschool2007@gmail.com',        // ใส่อีเมลของคุณ
                pass: 'acjw uzef qhff enkd',           // ถ้าเปิด 2FA ให้ใช้ App Password
            },
        });

        // ตั้งค่า email
        let mailOptions = {
            from: '"ชื่อของคุณ" <your_email@gmail.com>',
            to: email,              // อีเมลผู้รับ
            subject: 'ทดสอบส่งอีเมลจาก Node.js',
            text: message,
            // html: '<h1>สวัสดีครับ</h1><p>นี่คืออีเมลที่ส่งจาก <b>Node.js</b></p>'
        };

        // ส่ง email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('เกิดข้อผิดพลาด: ', error);
            }
            console.log('ส่งสำเร็จ: ' + info.response);
            interaction.reply({ content:'ส่งสำเร็จ: ' + info.response , ephemeral: true });
        });
        
    },

    options: {
        devOnly: true,
        userPermissions: ['Administrator', 'AddReactions'],
        botPermissions: ['Administrator', 'AddReactions'],
        deleted: false,
    },
}