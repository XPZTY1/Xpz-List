const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: {
        name: 'help',
        description: 'ดูคำสั่งในเซิฟ!',
    },

    async run({ interaction, client }) {
        try {
            const commandFolders = fs.readdirSync('./src/commands').filter(folder => !folder.startsWith('.'));
            const commandByCategory = {};

            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
                const commands = [];

                for (const file of commandFiles) {
                    const command = require(`./../${folder}/${file}`);
                    commands.push({ name: command.data.name ?? 'Unknown', description: command.data.description ?? 'No description provided' });
                }

                commandByCategory[folder] = commands;
            }

            const dropdownOptions = Object.keys(commandByCategory).map(folder => ({
                label: folder,
                value: folder,
            }));

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('help-menu')
                .setPlaceholder('Select a category')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(...dropdownOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                })));

            const embed = new EmbedBuilder()
                .setTitle('Help Menu')
                .setColor('Random')
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription('ดูคำสั่งในเซิฟ มีดังนี้!');

            const actionRow = new ActionRowBuilder()
                .addComponents(selectMenu);

            await interaction.reply({
                embeds: [embed],
                components: [actionRow],
            });

            const filter = i => i.isStringSelectMenu() && i.customId === 'help-menu';

            const collector = interaction.channel.createMessageComponentCollector({ filter });

            try {
                collector.on('collect', async i => {
                    const selectCategory = i.values[0];
                    const categoryCommands = commandByCategory[selectCategory];

                    const categoryEmbed = new EmbedBuilder()
                        .setTitle(`${selectCategory} commands`)
                        .setDescription('ดูคำสั่งในเซิฟ มีดังนี้!')
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor('Random')
                        .addFields(...categoryCommands.map(command => ({
                            name: `__${command.name}__`,
                            value: `\`${command.description}\``,
                            inline: false,
                        })));

                    await i.update({ embeds: [categoryEmbed] });
                    return;
                });
            } catch (error) {
                console.error('An error occurred:', error);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    },

    options: {
        devOnly: false,
        userPermissions: [''],
        botPermissions: [''],
        deleted: false,
    }
}
