const { ActivityType } = require('discord.js');

module.exports = (client) => {
    let status = [
        {
            name: 'เล่นเกมทยเลขสิ',
            type: ActivityType.Custom,
        },
        {
            name: 'เล่นเกมคิดเลขเร็วสิ',
            type: ActivityType.Custom,
        },
        {
            name: 'เล่นเกมอักษรหรรษาสิ',
            type: ActivityType.Custom,
        },
        {
            name: 'แจ้งปัญหาที่ ticket',
            type: ActivityType.Custom,
        },
        {
            name: 'ดูข้อมูล /about',
            type: ActivityType.Custom,
        },
        {
            name: 'ดูคำสั่งต่างๆ /help',
            type: ActivityType.Custom,
        },
        {
            name: 'ลองใช้ !s หรือ !score ในช่องเกมเพื่อดูคะแนน',
            type: ActivityType.Custom,
        },
    ];


    setInterval(() => {
        let random = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[random]);

    }, 10000);
};