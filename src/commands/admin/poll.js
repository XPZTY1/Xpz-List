const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ApplicationCommandOptionType, ComponentType } = require('discord.js');

module.exports = {
    data: {
        name: 'poll',
        description: 'สร้างโพลให้โหวต',
        options: [
            {
                name: 'question',
                description: 'คำถามของโพล',
                required: true,
                type: ApplicationCommandOptionType.String
            },
            {
                name: 'choices',
                description: 'ตัวเลือกของโพล (คั่นด้วยคอมม่า)',
                required: true,
                type: ApplicationCommandOptionType.String
            },
            {
                name: 'mode',
                description: 'โหมดการโหวต: single หรือ double',
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: 'single', value: 'single' },
                    { name: 'double', value: 'double' }
                ]
            },
            {
                name: 'time',
                description: 'ระยะเวลาโหวต (วินาที)',
                required: true,
                type: ApplicationCommandOptionType.Integer
            }
        ]
    },
    run: async ({ interaction, client }) => {
        const question = interaction.options.getString('question');
        const choices = interaction.options.getString('choices').split(',').map(c => c.trim());
        const mode = interaction.options.getString('mode');
        const totalSeconds = interaction.options.getInteger('time');

        const voteCounts = {};
        const userVotes = {};

        choices.forEach(choice => voteCounts[choice] = 0);

        const buttons = choices.map((choice, index) =>
            new ButtonBuilder()
                .setCustomId(`vote_${index}`)
                .setLabel(choice)
                .setStyle(ButtonStyle.Primary)
        );

        const actionRow = new ActionRowBuilder().addComponents(...buttons);

        const pollEmbed = new EmbedBuilder()
            .setTitle('📊 Poll : ' + question)
            .setDescription(`**ตัวเลือก**\n${choices.map((c, i) => `**${i + 1}.** ${c}`).join('\n')}\n\n⏳ เวลาที่เหลือ : \` ${totalSeconds} \` วินาที`)
            .setColor('Random')
            .setTimestamp();

        const pollMessage = await interaction.reply({
            embeds: [pollEmbed],
            components: [actionRow],
            fetchReply: true,
        });

        const collector = pollMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: totalSeconds * 1000,
        });

        let secondsLeft = totalSeconds;
        const interval = setInterval(async () => {
            secondsLeft--;

            if (secondsLeft <= 0) {
                clearInterval(interval);
                return;
            }

            pollEmbed.setDescription(`**ตัวเลือก**\n${choices.map((c, i) => `**${i + 1}.** ${c}`).join('\n')}\n\n⏳ เวลาที่เหลือ : \` ${secondsLeft} \` วินาที`);
            try {
                await pollMessage.edit({ embeds: [pollEmbed] });
            } catch (error) {
                clearInterval(interval);
            }
        }, 1000);

        collector.on('collect', async i => {
            const userId = i.user.id;
            const index = parseInt(i.customId.split('_')[1]);
            const choice = choices[index];
        
            if (!userVotes[userId]) {
                userVotes[userId] = [];
            }
        
            if (mode === 'single') {
                if (userVotes[userId].length > 0) {
                    voteCounts[userVotes[userId][0]] -= 1;
                    userVotes[userId] = [];
                }
                userVotes[userId].push(choice);
                voteCounts[choice] += 1;
                await i.reply({ content: `✅ คุณโหวต : **${choice}** แล้ว!`, ephemeral: true, });
            } else if (mode === 'double') {
                if (userVotes[userId].includes(choice)) {
                    userVotes[userId] = userVotes[userId].filter(c => c !== choice);
                    voteCounts[choice] -= 1;
                    await i.reply({ content: `❌ คุณยกเลิกโหวต : **${choice}** แล้ว!`, ephemeral: true, });
                } else {
                    if (userVotes[userId].length >= 2) {
                        await i.reply({ content: '❌ คุณเลือกครบ 2 ตัวเลือกแล้ว! ยกเลิกตัวเลือกเก่าก่อน', ephemeral: true, });
                    } else {
                        userVotes[userId].push(choice);
                        voteCounts[choice] += 1;
                        await i.reply({ content: `✅ คุณโหวตเพิ่ม : **${choice}** แล้ว!`, ephemeral: true, });
                    }
                }
            }
        });

        collector.on('end', async () => {
            // สร้างปุ่ม "ดูผู้โหวต" ใน Embed สรุปผล
            const viewVotesButton = new ButtonBuilder()
                .setCustomId('view_votes')
                .setLabel('รายชื่อ')
                .setStyle(ButtonStyle.Secondary);

            const actionRowWithView = new ActionRowBuilder().addComponents(viewVotesButton);

            // สรุปผลโหวต
            const resultEmbed = new EmbedBuilder()
                .setTitle('📊 **ผลโหวต**')
                .setDescription(`
                    🗳️ **คำถาม :** ${question}
                    **ผลโหวต**
                    ${choices.map((choice, i) => {
                        return `**${choice} :** ${voteCounts[choice]} โหวต ${getEmojiForVotes(voteCounts[choice])}`;
                    }).join('\n')}
                `)
                .setColor('Random')  // หรือเลือกสีที่ต้องการ
                .setThumbnail('https://i.pinimg.com/736x/0d/0f/a6/0d0fa6d21e1f6450dab290ad6f5069d7.jpg')  // ใส่โลโก้หรือภาพที่ต้องการ
                .setFooter({ text: 'Xpz Bot', iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            // แก้ไขข้อความที่โพสต์เพื่อแสดงสรุปผลโหวต
            await pollMessage.edit({ embeds: [resultEmbed], components: [actionRowWithView] });
        });

        // ฟังก์ชันที่ใช้แสดง Emoji ตามจำนวนโหวต
        function getEmojiForVotes(votes) {
            if (votes >= 10) return '🏆';
            if (votes >= 5) return '🥇';
            if (votes >= 1) return '👍';
            return '❌';
        }

        // เมื่อกดปุ่ม "ดูผู้โหวต"
        const viewVotesCollector = pollMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000,  // กำหนดเวลาในการรอผู้ใช้กดปุ่ม
        });

        viewVotesCollector.on('collect', async i => {
            if (i.customId === 'view_votes') {
                const userVotesEmbed = new EmbedBuilder()
                    .setTitle('📋 รายชื่อผู้โหวต')
                    .setDescription(`${Object.keys(userVotes).map(userId => {
                        const votes = userVotes[userId].join(', ');
                        return `<@${userId}> : ${votes}`;
                    }).join('\n') || 'ไม่มีการโหวต'}`)
                    .setColor('Random')
                    .setTimestamp();

                await i.reply({ embeds: [userVotesEmbed], components: [], ephemeral:true });
            }
        });
    }
};
