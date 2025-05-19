const Discord = require("discord.js");
const db = require("croxydb");
const { color, prefix, emojiler } = require("../ayarlar.js")

exports.run = async (client, message, args) => {
     try {
          let cmd = client.commands.map(e => `**${prefix}${e.help.name}** - ${e.help.description}`).join('\n')

          const embed = new Discord.EmbedBuilder()
               .setTitle('Yardım Menüsü')
               .setDescription(`${cmd || "Bilinmiyor."}`)
               .setTimestamp()

          await message.channel.send({ embeds: [embed] })
     } catch (err) {
          console.log(err)
     }
};

exports.conf = {
     aliases: []
};

exports.help = {
     name: "yardım",
     description: "Botun Komutlarını Gösterir."
};
