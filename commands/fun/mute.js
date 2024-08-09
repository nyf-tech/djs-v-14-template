const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const connectToDatabase = require('../../db.js'); // Ścieżka do db.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a member.')
        .addUserOption(option => option.setName('target').setDescription('User to mute').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for mute'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        if (member.roles.cache.some(role => role.name === 'Muted')) {
            return interaction.reply({ content: 'User is already muted.', ephemeral: true });
        }

        const db = await connectToDatabase();
        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        if (!muteRole) {
            return interaction.reply({ content: 'Muted role not found. Please create one.', ephemeral: true });
        }

        await member.roles.add(muteRole, reason);
        await db.collection('mutes').insertOne({ userId: target.id, guildId: interaction.guild.id, reason });

        return interaction.reply({ content: `${target.username} has been muted.`, ephemeral: true });
    },
};
