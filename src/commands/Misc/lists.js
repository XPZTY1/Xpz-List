const { command_channel } = require('../../../config-channels.json');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ApplicationCommandOptionType } = require("discord.js");
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

// Ensure the src/data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Path to the JSON file to store transaction data
const dataFilePath = path.join(dataDir, 'transactions.json');

// Helper function to check if the date is today
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

// Helper function to format a date to YYYY-MM-DD
function formatDate(dateString) {
    const date = moment(dateString, 'DD/MM/YYYY', true);
    if (!date.isValid()) {
        return null;
    }
    return date.format('YYYY-MM-DD');
}

module.exports = {
    data: {
        name: 'list-money',
        description: 'บันทึกรายรับ-รายจ่าย',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'type',
                description: 'เลือกประเภทรายการ (รายรับ/รายจ่าย)',
                required: true,
                choices: [
                    { name: 'รายรับ', value: 'รายรับ' },
                    { name: 'รายจ่าย', value: 'รายจ่าย' },
                ],
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'description',
                description: 'รายละเอียดของรายการ',
                required: true,
            },
            {
                type: ApplicationCommandOptionType.Number,
                name: 'amount',
                description: 'ระบุจำนวนเงิน',
                required: true,
            },
        ],
    },
    run: async ({ interaction, client }) => {
        try {

            function convertToLowerCase(message) {
                return message.toLowerCase();
            }
            const name = interaction.user.globalName;
            const name2 = convertToLowerCase(name);

            const channelName = `◞📖รายการ-${name2}`
            const list = interaction.guild.channels.cache.find(channel => channel.name === channelName);
            const type = interaction.options.getString('type');
            const description = interaction.options.getString('description');
            const amount = interaction.options.getNumber('amount');

            // Read existing transaction data
            let transactions = [];
            if (fs.existsSync(dataFilePath)) {
                transactions = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
            }

            // Add new transaction
            const newTransaction = {
                type,
                description,
                amount,
                timestamp: moment().tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm:ss'), // Add timestamp in short date format
            };
            transactions.push(newTransaction);

            // Save updated transaction data
            fs.writeFileSync(dataFilePath, JSON.stringify(transactions, null, 2), 'utf-8');

            // Group transactions by date
            const transactionsByDate = transactions.reduce((acc, tran) => {
                const date = formatDate(tran.timestamp.split(' ')[0]);
                if (!date) {
                    return acc;
                }
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(tran);
                return acc;
            }, {});

            // Create the summary embed message for today
            const today = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
            const todayTransactions = transactionsByDate[today] || [];
            const incomeTotal = todayTransactions.filter(tran => tran.type === 'รายรับ').reduce((sum, tran) => sum + tran.amount, 0);
            const expenseTotal = todayTransactions.filter(tran => tran.type === 'รายจ่าย').reduce((sum, tran) => sum + tran.amount, 0);
            const balance = incomeTotal - expenseTotal;

            const summaryEmbed = new EmbedBuilder()
                // .setAuthor({name: name, iconURL: interaction.user.displayAvatarURL()})
                .setTitle(`บันทึกรายรับ-รายจ่าย`)
                .setThumbnail('https://media.giphy.com/media/3oKIPbnhOJJVSGAbKM/giphy.gif?cid=ecf05e47vg2kx4yutmqs45vwgjlf6r9xml5zwgl4hc81tjd3&ep=v1_gifs_search&rid=giphy.gif&ct=g')
                .setColor('Random')
                .setTimestamp()
                .setFooter({text: `by ${name}`, iconURL: interaction.user.displayAvatarURL()})
                .addFields(
                    { name: 'สรุปรายการ', value: `ยอดเงินเข้า: ${incomeTotal} บาท\nยอดเงินออก: ${expenseTotal} บาท\nยอดคงเหลือ: ${balance} บาท`, inline: false }
                );

            // Create date options for the Select Menu
            const dateOptions = Object.keys(transactionsByDate).map((date) => {
                const shortDate = date.length > 25 ? date.slice(0, 25) : date;
                return {
                    label: shortDate,
                    value: date,
                    description: `วันที่มีรายการ: ${transactionsByDate[date].length} รายการ`
                };
            });

            // Create the Select Menu
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('date_select')
                .setPlaceholder('เลือกวันที่')
                .addOptions(dateOptions);

            const row = new ActionRowBuilder()
                .addComponents(selectMenu);

            

            // Send or update the message in the log channel
            const logChannel = await client.channels.fetch(list.id);

            if (interaction.channelId == command_channel) {
                // Fetch the last message in the log channel
                const messages = await logChannel.messages.fetch({ limit: 1 });
                const lastMessage = messages.first();

                if (lastMessage && lastMessage.author.id === client.user.id && isToday(new Date(lastMessage.createdTimestamp))) {
                    // Edit the last message if it's from today
                    lastMessage.edit({ embeds: [summaryEmbed], components: [row] });
                } else {
                    // Send a new message if the last message is not from today
                    logChannel.send({ embeds: [summaryEmbed], components: [row] });
                }

                interaction.reply({ content: 'รายการถูกบันทึกเรียบร้อยแล้ว!', ephemeral: true });
            } else {
                const channel_c = new EmbedBuilder()
                    .setDescription(`โปรดใช้คำสั่งในช่อง \n<#${command_channel}>`)
                    .setColor('Red');

                interaction.reply({ embeds: [channel_c], ephemeral: true });
            }

            // Handle the Select Menu interactions
            client.on('interactionCreate', async selectInteraction => {
                try {
                    if (!selectInteraction.isStringSelectMenu() || selectInteraction.customId !== 'date_select') return;

                    const selectedDate = selectInteraction.values[0];
                    const selectedTransactions = transactionsByDate[selectedDate];

                    const transactionDetails = selectedTransactions.map((tran, index) => (
                        `**${index + 1}.** ประเภท: ${tran.type}\nรายละเอียด: ${tran.description}\nจำนวน: ${tran.amount} บาท\nเวลา: ${tran.timestamp}`
                    )).join('\n\n');

                    const transactionEmbed = new EmbedBuilder()
                        .setTitle(`รายละเอียดรายการวันที่ ${selectedDate}`)
                        .setColor('Blue')
                        .setDescription(transactionDetails);

                    await selectInteraction.reply({ embeds: [transactionEmbed], ephemeral: true });

                    // Refresh the Select Menu
                    const refreshedSelectMenu = new StringSelectMenuBuilder()
                        .setCustomId('date_select')
                        .setPlaceholder('เลือกวันที่')
                        .addOptions(dateOptions);

                    const refreshedRow = new ActionRowBuilder()
                        .addComponents(refreshedSelectMenu);

                    // Update the log channel with refreshed Select Menu
                    const logMessages = await logChannel.messages.fetch({ limit: 1 });
                    const logMessage = logMessages.first();

                    if (logMessage && logMessage.author.id === client.user.id) {
                        await logMessage.edit({ embeds: [summaryEmbed], components: [refreshedRow] });
                    }
                } catch (error) {
                    console.error('Error handling Select Menu interaction:', error);
                    await selectInteraction.reply({ content: 'เกิดข้อผิดพลาดขณะประมวลผลการเลือกวันที่', ephemeral: true });
                }
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'เกิดข้อผิดพลาดขณะบันทึกข้อมูล', ephemeral: true });
        }
    },

    options: {
        deleted: true,
    },
};
