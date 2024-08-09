const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const connectToDatabase = require('../../db.js'); // Ścieżka do db.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a member.')
        .addUserOption(option => option.setName('target').setDescription('User to unmute').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        const db = await connectToDatabase();
        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        if (!muteRole || !member.roles.cache.some(role => role.id === muteRole.id)) {
            return interaction.reply({ content: 'User is not muted or Muted role not found.', ephemeral: true });
        }

        await member.roles.remove(muteRole);
        await db.collection('mutes').deleteOne({ userId: target.id, guildId: interaction.guild.id });

        return interaction.reply({ content: `${target.username} has been unmuted.`, ephemeral: true });
    },
};
