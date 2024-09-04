const { token } = require("./config.json");
const { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } = require("discord.js");

// Define the roles to be given to users
const rolesToGive = [
    "Coscritto",
    "Divisione Orientale",
    "Guardia d'Interna Sicurezza",
    'Fucilieri del Sicurezza "Il Temuto"',
    "Esercito NapoIetano",
];

const botID = "1280381285348675657";
const rest = new REST().setToken(token);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'sicurezzaenlist') {
        const member = interaction.guild.members.cache.get(options.getUser('user').id);
        if (!member) {
            await interaction.deferReply({content: 'User not found.', ephemeral: true});
            return;
        }

        // Get the roles from the rolesToGive array
        const roles = rolesToGive.map(roleName => interaction.guild.roles.cache.find(role => role.name === roleName)).filter(Boolean);
        await member.roles.add(roles);
        let newName = '[SI] ';
        const result = newName.concat(member.displayName);
        await member.setNickname(result)
        await interaction.deferReply({content: `Applied Sicurezza roles to user, add them to the SF spreadsheet now.`, ephemeral: true});
    }
});

const slashregister = async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(botID), {
            body: [
                new SlashCommandBuilder()
                    .setName("sicurezzaenlist")
                    .setDescription('Apply all predefined roles to a user')
                    .addUserOption(option => 
                        option.setName('user')
                              .setDescription('The user to whom roles will be applied')
                              .setRequired(true)
                    ),
            ]
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};
slashregister();

client.login(token);