const { EmbedBuilder } = require('discord.js');
const { log_members_add } = require('../../../config-log-channels.json');
const { welcome_channel, confirm_channel } = require('../../../config-channels.json');

module.exports = (member, client, interaction, handler) => {
    if (member.user.bot) return;

    const channel = member.guild.channels.cache.get(welcome_channel);

    /* ------------------------------------------------------------------------------- */

    const embed = new EmbedBuilder()
        .setAuthor({ name: `Welcome`, iconURL: `${member.user.displayAvatarURL()}` })
        .setTitle(`WELCOME`)
        // .setDescription(`${member}\nto server`)
        .setFields({ name: `${member.user.globalName ?? member.user.username}`, value: 'To Server List ออมเงิน' })
        .setThumbnail(`${member.user.displayAvatarURL()}`)
        .setTimestamp()
        .setFooter({ text: client.user.tag })
        .setColor('Blue');

    channel.send({ embeds: [embed], content: `||${member}||` });

    /* ------------------------------------------------------------------------------- */

    const send = new EmbedBuilder()
        .setDescription(`Name : ${member}\nTag : ${member.user.tag}\nId: ${member.id}`)
        .setTimestamp()
        .setThumbnail(`${member.user.displayAvatarURL()}`)
        .setFooter({ text: 'welcome', iconURL: client.user.displayAvatarURL() })
        .setColor('Green');

    client.channels.fetch(log_members_add)
        .then(channel => channel.send({ embeds: [send] }));

    /* ------------------------------------------------------------------------------- */


    try {
        const embedDm = new EmbedBuilder()
            .setAuthor({ name: `Welcome`, iconURL: `${member.user.displayAvatarURL()}` })
            .setTitle(`WELCOME`)
            // .setDescription(`${member}\nto server`)
            .setFields({ name: `${member.user.globalName ?? member.user.username}`, value: 'To Server List ออมเงิน' }, { name: 'โปรดแนะนำตัวเพื่อเข้าเซิฟ', value: `<#${confirm_channel}>` }, { name: 'สามารถดูวิธีการแนะนำได้ที่', value: '<#1235849962097479701>' })
            .setThumbnail(`${member.user.displayAvatarURL()}`)
            .setTimestamp()
            .setFooter({ text: client.user.tag })
            .setURL('https://discord.gg/WFVKy2QmEE')
            .setColor('Blue');


        member.send({ embeds: [embedDm], content: 'https://discord.gg/WFVKy2QmEE' });
    } catch (error) {
        console.log('bot add')
    }


    /* ------------------------------------------------------------------------------- */

};