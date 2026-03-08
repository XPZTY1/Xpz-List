const { ButtonStyle, ActionRowBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { ButtonKit } = require('commandkit');

const { games_channel } = require('./../../../config-channels.json')
module.exports = {
    data: {
        name: 'games',
        description: 'เล่นเกม!!',
        options: [
            {
                name: 'games',
                description: 'เลือกเกม',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: 'เกมทายหัวก้อย',
                        value: 'เกมทายหัวก้อย',
                    },
                    {
                        name: 'เกมเป่ายิ่งฉุบ',
                        value: 'เกมเป่ายิ่งฉุบ',
                    }
                ],
            },
        ],
    },

    run: async ({ interaction, client }) => {
        const game = interaction.options.get('games').value;


        if (interaction.channelId === games_channel) {

            // เกมหัวก้อย
            if (game === 'เกมทายหัวก้อย') {
                var answer = '';
                if (Math.floor(Math.random() * 2) < 1) {
                    answer = 'หัว'
                } else {
                    answer = 'ก้อย';
                };


                const id = Math.floor(Math.random() * 1000);


                const embedMain = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setTitle('เกมทายหัวก้อย')
                    .setDescription('เลือก หัว หรือ ก้อย')
                    .setColor('Blue');

                const embedTrue = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor('Green')
                    .setTitle('เกมทายหัวก้อย')
                    .setThumbnail('https://media.giphy.com/media/6jqfXikz9yzhS/giphy.gif?cid=790b7611p626msjxywx7c1fjyxsqbo86ywhdpl8xh0y6jbiu&ep=v1_gifs_search&rid=giphy.gif&ct=g')
                    .setDescription(`คุณตอบถูก\nคำตอบคือ ${answer}`);

                const embedFalse = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setColor('Red')
                    .setTitle('เกมทายหัวก้อย')
                    .setThumbnail('https://media.giphy.com/media/6jqfXikz9yzhS/giphy.gif?cid=790b7611p626msjxywx7c1fjyxsqbo86ywhdpl8xh0y6jbiu&ep=v1_gifs_search&rid=giphy.gif&ct=g')
                    .setDescription(`คุณตอบผิด\nคำตอบคือ ${answer}`);



                // สร้างปุ่ม
                const buttonGame_T = new ButtonKit()
                    .setCustomId(`ButtonT${id}`)
                    .setLabel('ก้อย')
                    .setStyle(ButtonStyle.Secondary);
                const buttonGame_H = new ButtonKit()
                    .setCustomId(`ButtonH${id}`)
                    .setLabel('หัว')
                    .setStyle(ButtonStyle.Secondary);


                const buttonRow = new ActionRowBuilder().addComponents(buttonGame_T, buttonGame_H);

                // ส่งปุ่ม
                await interaction.reply({ components: [buttonRow], embeds: [embedMain] });

                client.on('interactionCreate', async interaction => {
                    if (!interaction.isButton()) return;

                    if (interaction.customId === `ButtonT${id}`) {
                        if (answer === 'ก้อย') {
                            interaction.update({ components: [], embeds: [embedTrue] });
                        } else {
                            interaction.update({ components: [], embeds: [embedFalse] });
                        }
                    };

                    if (interaction.customId === `ButtonH${id}`) {
                        if (answer === 'หัว') {
                            interaction.update({ components: [], embeds: [embedTrue] });
                        } else {
                            interaction.update({ components: [], embeds: [embedFalse] });
                        }
                    };

                })
            };


            // เกมเป่ายิ่งฉุบ
            if (game === 'เกมเป่ายิ่งฉุบ') {
                var answer = '';
                const random = Math.floor(Math.random() * 3);
                const id = Math.floor(Math.random() * 1000);

                if (random === 0) {
                    answer = 'ค้อน'
                } else if (random === 1) {
                    answer = 'กระดาษ'
                } else if (random === 2) {
                    answer = 'กรรไกร'
                };

                const embedMain = new EmbedBuilder()
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setTitle('เกมเป่ายิ่งฉุบ')
                    .setDescription('ค้อน กรรไกร กระดาษ')
                    .setColor('Blue');

                const button1 = new ButtonKit()
                    .setCustomId(`button1${id}`)
                    .setLabel('ค้อน')
                    .setStyle(ButtonStyle.Secondary);

                const button2 = new ButtonKit()
                    .setCustomId(`button2${id}`)
                    .setLabel('กระดาษ')
                    .setStyle(ButtonStyle.Secondary);

                const button3 = new ButtonKit()
                    .setCustomId(`button3${id}`)
                    .setLabel('กรรไกร')
                    .setStyle(ButtonStyle.Secondary);

                const buttonRow = new ActionRowBuilder().addComponents(button1, button2, button3);

                await interaction.reply({ components: [buttonRow], embeds: [embedMain] });



                client.on('interactionCreate', async interaction => {
                    if (!interaction.isButton()) return;

                    var inputs = '';
                    if (interaction.customId === `button1${id}`) {
                        inputs = 'ค้อน'
                    } else if (interaction.customId === `button2${id}`) {
                        inputs = 'กระดาษ'
                    } else if (interaction.customId === `button3${id}`) {
                        inputs = 'กรรไกร'
                    };


                    const embedTrue = new EmbedBuilder()
                        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                        .setTimestamp()
                        .setColor('Green')
                        .setTitle('เกมเป่ายิ่งฉุบ')
                        .setThumbnail('https://media.giphy.com/media/JoDQSE8d1tB2tsPAAg/giphy.gif?cid=790b7611t9tp0zrygt1oey7kjpsv6jjz3lkwz66qij9z4hnn&ep=v1_gifs_search&rid=giphy.gif&ct=g')
                        .setDescription(`${inputs} vs ${answer}\nคุณชนะ`);

                    const embedFalse = new EmbedBuilder()
                        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                        .setTimestamp()
                        .setColor('Red')
                        .setTitle('เกมเป่ายิ่งฉุบ')
                        .setThumbnail('https://media.giphy.com/media/JoDQSE8d1tB2tsPAAg/giphy.gif?cid=790b7611t9tp0zrygt1oey7kjpsv6jjz3lkwz66qij9z4hnn&ep=v1_gifs_search&rid=giphy.gif&ct=g')
                        .setDescription(`${inputs} vs ${answer}\nคุณแพ้`);

                    const embedSa = new EmbedBuilder()
                        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                        .setTimestamp()
                        .setColor('DarkBlue')
                        .setTitle('เกมเป่ายิ่งฉุบ')
                        .setThumbnail('https://media.giphy.com/media/JoDQSE8d1tB2tsPAAg/giphy.gif?cid=790b7611t9tp0zrygt1oey7kjpsv6jjz3lkwz66qij9z4hnn&ep=v1_gifs_search&rid=giphy.gif&ct=g')
                        .setDescription(`${inputs} vs ${answer}\nเสมอ`);

                    if (interaction.customId === `button1${id}`) {
                        if (answer === 'ค้อน') {
                            interaction.update({ components: [], embeds: [embedSa] });
                        } else if (answer === 'กระดาษ') {
                            interaction.update({ components: [], embeds: [embedFalse] });
                        } else if (answer === 'กรรไกร') {
                            interaction.update({ components: [], embeds: [embedTrue] });
                        }
                    } else if (interaction.customId === `button2${id}`) {
                        if (answer === 'กระดาษ') {
                            interaction.update({ components: [], embeds: [embedSa] });
                        } else if (answer === 'กรรไกร') {
                            interaction.update({ components: [], embeds: [embedFalse] });
                        } else if (answer === 'ค้อน') {
                            interaction.update({ components: [], embeds: [embedTrue] });
                        }
                    } else if (interaction.customId === `button3${id}`) {
                        if (answer === 'กรรไกร') {
                            interaction.update({ components: [], embeds: [embedSa] });
                        } else if (answer === 'ค้อน') {
                            interaction.update({ components: [], embeds: [embedFalse] });
                        } else if (answer === 'กระดาษ') {
                            interaction.update({ components: [], embeds: [embedTrue] });
                        }
                    }
                });

            };
        } else {
            const channel_c = new EmbedBuilder()
                .setDescription(`โปรดใช้ command ในช่อง\n<#${games_channel}>`)
                .setColor('Red');

            interaction.reply({ embeds: [channel_c], ephemeral: true });
        };

    },
    options: {
        // devOnly: true,
        // userPermissions: ['Administrator', 'AddReactions'],
        // botPermissions: ['Administrator', 'AddReactions'],
        deleted: false,
    },
};