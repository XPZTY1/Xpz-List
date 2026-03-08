const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ApplicationCommandOptionType, ComponentType } = require('discord.js');

module.exports = {
    data: {
        name: 'giveaway',
        description: 'สร้างการแจกของรางวัล',
        options: [
            {
                name: 'prize',
                description: 'ของรางวัลที่จะแจก',
                required: true,
                type: ApplicationCommandOptionType.String
            },
            {
                name: 'duration',
                description: 'ระยะเวลาในการแจกของ (วินาที)',
                required: true,
                type: ApplicationCommandOptionType.Integer
            },
            {
                name: 'winners',
                description: 'จำนวนผู้ชนะ',
                required: true,
                type: ApplicationCommandOptionType.Integer
            }
        ]
    },
    run: async ({ interaction, client }) => {
        const prize = interaction.options.getString('prize');
        const duration = interaction.options.getInteger('duration');
        const winnersCount = interaction.options.getInteger('winners');

        const participants = new Set();
        let secondsLeft = duration;

        const giveawayEmbed = new EmbedBuilder()
            .setTitle('🎉 Giveaway! 🎉')
            .setDescription(`**รางวัล:** ${prize}\n**เวลา:** \`${secondsLeft}\` วินาที\n\n**วิธีเข้าร่วม:** กดปุ่ม "เข้าร่วม" เพื่อมีสิทธิ์ลุ้นรางวัล!`)
            .setColor('Random')
            .setTimestamp();

        const joinButton = new ButtonBuilder()
            .setCustomId('join_giveaway')
            .setLabel('เข้าร่วม')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder().addComponents(joinButton);

        const giveawayMessage = await interaction.reply({
            embeds: [giveawayEmbed],
            components: [actionRow],
            fetchReply: true,
        });

        const collector = giveawayMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: duration * 1000,
        });

        collector.on('collect', async i => {
            if (i.customId === 'join_giveaway') {
                participants.add(i.user.id);
                await i.reply({ content: `✅ คุณเข้าร่วมการแจกของรางวัลแล้ว!`, ephemeral: true });
            }
        });

        // อัปเดตเวลาทุก ๆ 1 วินาที
        const interval = setInterval(async () => {
            secondsLeft--;

            if (secondsLeft <= 0) {
                clearInterval(interval);
                return;
            }

            giveawayEmbed.setDescription(`**รางวัล:** ${prize}\n**เวลา:** \`${secondsLeft}\` วินาที\n\n**วิธีเข้าร่วม:** กดปุ่ม "เข้าร่วม" เพื่อมีสิทธิ์ลุ้นรางวัล!`);
            try {
                await giveawayMessage.edit({ embeds: [giveawayEmbed] });
            } catch (error) {
                clearInterval(interval);
            }
        }, 1000);

        collector.on('end', async () => {
            clearInterval(interval);

            if (participants.size === 0) {
                await giveawayEmbed.setDescription(` กิจกรรม **${prize}** ไม่พบผู้เข้าร่วมในการแจกของรางวัลนี้`);
                await giveawayMessage.edit({ embeds: [giveawayEmbed],  components: [],});
                return;
            }

            const winners = [];
            const participantsArray = Array.from(participants);

            for (let i = 0; i < Math.min(winnersCount, participantsArray.length); i++) {
                const randomIndex = Math.floor(Math.random() * participantsArray.length);
                winners.push(`<@${participantsArray[randomIndex]}>`);
                participantsArray.splice(randomIndex, 1); // เอาคนที่ชนะออกจากลิสต์
            }

            const resultEmbed = new EmbedBuilder()
                .setTitle('🎉 ผลการแจกของรางวัล 🎉')
                .setDescription(`**ของรางวัล:** ${prize}\n\n**ผู้ชนะ:** ${winners.join(', ')}`)
                .setColor('Random')
                .setTimestamp();

            await giveawayMessage.edit({
                embeds: [resultEmbed],
                components: []
            });
        });
    }
};
