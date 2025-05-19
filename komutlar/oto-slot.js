const Discord = require("discord.js");
const db = require("croxydb")
const { color, prefix, emojiler } = require("../ayarlar.js")
exports.run = async (client, message, args) => {
    const yetkili = db.fetch(`${message.guild.id}_scrimyetkili`)

    if (!message.member.roles.cache.find(r => r.id === yetkili) || !message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) return message.channel.send({
        embeds: [{
            color: color,
            author: {
                name: `${client.user.username} - Oto Slot`, icon_url: message.author.avatarURL({ dynamic: true })
            },
            description: `${emojiler.hayir} Bu komutu kullanabilmek için <@&${yetkili}> rolüne yada Yönetici yetkisine ihtiyacın var.`
        }]
    })
    try {
        const messages = await message.channel.messages.fetch({ limit: 100 });
        const sortedMessages = messages
            .map(msg => msg.content.split('\n')[0])
            .filter(line => line.trim() !== '')
            .sort()
            .join('\n');
        let user = message.author;
        await user.send(`Sıralanmış takım isimleri:\n\n${sortedMessages}`)
        await message.channel.send(`${emojiler.onay} Dm üzerinden slotları ilettim.`)
    } catch (error) {
        await message.channel.send('Dmin kapalı olduğundan mesaj gönderemedim.');
    }

}

exports.conf = {
    aliases: []
};
exports.help = {
    name: "oto-slot",
    description: "Onaylanan checklerin slotlarını atar."
};