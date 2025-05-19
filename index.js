const { Client, GatewayIntentBits, Partials, ButtonBuilder, ButtonComponent, ButtonStyle, ActionRowBuilder, PermissionsFlags, ModalBuilder, TextInputBuilder, TextInputStyle, Collection, AttachmentBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const fs = require("fs")
const { prefix, color, botdurum, token } = require("./ayarlar.js")
const db = require("croxydb")
db.setReadable(true)
const Discord = require("discord.js")
const client = new Client({
     intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildBans,
          GatewayIntentBits.GuildEmojisAndStickers,
          GatewayIntentBits.GuildIntegrations,
          GatewayIntentBits.GuildWebhooks,
          GatewayIntentBits.GuildInvites,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.GuildPresences,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.GuildMessageTyping,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.DirectMessageReactions,
          GatewayIntentBits.DirectMessageTyping,
          GatewayIntentBits.MessageContent,
     ],
     partials: [
          Partials.Message,
          Partials.Channel,
          Partials.GuildMember,
          Partials.Reaction,
          Partials.GuildScheduledEvent,
          Partials.User,
          Partials.ThreadMember,
     ],
});

module.exports = client;

const { error } = require("console");

client.login(token)


client.on("messageCreate", async (message) => {
     if (!message.guild) return;
     if (message.author.bot) return;
     if (!message.content.startsWith(prefix)) return;
     let command = message.content.toLocaleLowerCase().split(" ")[0].slice(prefix.length);
     let params = message.content.split(" ").slice(1);
     let cmd;
     if (client.commands.has(command)) {
          cmd = client.commands.get(command);
     } else if (client.aliases.has(command)) {
          cmd = client.commands.get(client.aliases.get(command));
     }
     if (cmd) {
          cmd.run(client, message, params)
     }
});

client.commands = new Collection();
client.aliases = new Collection();

client.on('ready', () => {

     client.user.setPresence({ activities: [{ name: `${botdurum || "Code World"}` }] });

     console.log('_________________________________________');
     console.log(`Bot Adı     : ${client.user.username}`);
     console.log(`Prefix      : ${prefix}`);
     console.log(`Durum       : Bot Çevrimiçi!`);
     console.log('_________________________________________');
});

fs.readdir("./komutlar", (err, files) => {
     if (err) console.error(err);
     files.forEach(f => {
          let props = require(`./komutlar/${f}`);
          client.commands.set(props.help.name, props);
          props.conf.aliases.forEach(alias => {
               client.aliases.set(alias, props.help.name);
          });
     });

})