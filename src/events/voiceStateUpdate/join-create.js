const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');

module.exports = (oldState, newState) => {
    if (oldState.channel !== newState.channel) {
        if (!oldState.channel && newState.channel) {
            const member = newState.member.user.username;
            const channelName = newState.channel.name;

            if (channelName === 'join to create') {
                const category = '1235962153421377626'; // หมวดหมู่ของห้อง
                const memberRoleId = '1230392687954235483'; // เปลี่ยนเป็น ID ของ Role ที่คุณต้องการ (เช่น member)

                newState.guild.channels.create({
                    name: `voice-${member}`,
                    type: ChannelType.GuildVoice,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: newState.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel], // ไม่ให้มองเห็นห้อง
                        },
                        {
                            id: memberRoleId, // Role member
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect], // ให้มองเห็นและเข้าได้
                        },
                        {
                            id: newState.member.id, // เจ้าของห้อง
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                        },
                    ],
                }).then(voiceChannel => {
                    newState.member.voice.setChannel(voiceChannel)
                        .then(() => {
                            newState.guild.channels.create({
                                name: `setting-${member}`,
                                type: ChannelType.GuildText,
                                parent: category,
                                permissionOverwrites: [
                                    {
                                        id: newState.guild.roles.everyone.id,
                                        deny: [PermissionsBitField.Flags.ViewChannel],
                                    },
                                    {
                                        id: memberRoleId,
                                        deny: [PermissionsBitField.Flags.ViewChannel],
                                    },
                                    {
                                        id: newState.member.id,
                                        allow: [PermissionsBitField.Flags.ViewChannel],
                                    },
                                ],
                            }).then(textChannel => {
                                const embed = new EmbedBuilder()
                                    .setTitle(`สถานะของช่องเสียง: ${voiceChannel}`)
                                    .addFields(
                                        { name: 'สถานะการล็อก',value: '🔓 ไม่ล็อก', inline: true },
                                        { name: 'สถานะการมองเห็น', value: '👁️ แสดง', inline: true },
                                        { name: 'จำนวนผู้ใช้สูงสุด', value: 'ไม่จำกัด', inline: true }
                                    );

                                const row = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId(`toggle-visibility-voice-${member}`)
                                            .setLabel('👁️ Hide/Show')
                                            .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                            .setCustomId(`lock-voice-${member}`)
                                            .setLabel('🔒 Lock/Unlock')
                                            .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                            .setCustomId(`limit-voice-${member}`)
                                            .setLabel('👥 User Limit')
                                            .setStyle(ButtonStyle.Secondary),
                                        new ButtonBuilder()
                                            .setCustomId(`disconnect-user-${member}`)
                                            .setLabel("🥾 User Disconnect")
                                            .setStyle(ButtonStyle.Danger)

                                    );


                                textChannel.send({ embeds: [embed], components: [row] });
                            }).catch(console.error);
                        }).catch(console.error);
                }).catch(console.error);
            }
        }

        if (oldState.channel && oldState.channel.name.startsWith('voice-')) {
            if (oldState.channel.members.size === 0) {
                oldState.channel.delete().catch(console.error);

                const textChannelName = `setting-${oldState.channel.name.split('-')[1]}`;
                const textChannel = oldState.guild.channels.cache.find(
                    ch => ch.name === textChannelName && ch.type === ChannelType.GuildText
                );
                if (textChannel) {
                    textChannel.delete().catch(console.error);
                }
            }
        }
    }
};
