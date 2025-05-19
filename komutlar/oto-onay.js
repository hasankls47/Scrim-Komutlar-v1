const Discord = require("discord.js");
const db = require("croxydb");
const { prefix, color, emojiler } = require("../ayarlar.js")

exports.run = async (client, message, args) => {
    const emoji = db.fetch(`${message.guild.id}_scrimonayemoji`);
    
    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.AddReactions)) {
        return message.channel.send({
            embeds: [{
                color: color,
                author: {
                    name: `${client.user.username} - Oto Onay`, icon_url: message.author.avatarURL({ dynamic: true })
                },
                description: `Bu komutu kullanabilmek için <@&${yetkili}> rolüne yada Yönetici yetkisine ihtiyacın var.`
            }]
        });
    }
    if (!message.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.AddReactions)) {
        return message.channel.send({
            embeds: [{
                color: color,
                author: {
                    name: `${client.user.username} - Oto Onay`, icon_url: message.author.avatarURL({ dynamic: true })
                },
                description: `\`Emoji Ekle\` yetkim olmadığından işlemi gerçekleştiremedim.`
            }]
        });
    }


    const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });

    const messagesWithRoles = [];

    fetchedMessages.forEach(msg => {
        if (msg.id !== message.id) {
            const member = message.guild.members.cache.get(msg.author.id);
            if (member) {
                const highestRole = member.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .first();
                messagesWithRoles.push({ msg, highestRole });
            }
        }
    });

    const sortedMessages = messagesWithRoles.sort((a, b) => b.highestRole.position - a.highestRole.position);
    const count = Number(args[0]);

    let messageCount = 0;
    if (!args[0]) return message.channel.send(`Kaç takıma onay vermek istiyorsun?\n(maximum = 25)`)
    if (!count) return message.channel.send(`Düzgün bir sayı girmelisin!`)
    if (count > 25) return message.channel.send(`Maksimum 25 takım onaylayabilirsin!`)
    await message.delete()
    for (const { msg } of sortedMessages) {
        if (messageCount >= count) break;
        await msg.react(emoji)
            .catch(err => console.error('Emoji eklenirken bir hata oluştu:', err));
        messageCount++;
    }
    await message.channel.send(`Başarıyla ${messageCount} tane mesaj onayladım.`).then(e => {
        setTimeout(() => {
            e.delete().catch(err => {
                if (err.code !== 10008) {
                    return;
                }
            });
        }, 5000);
    })
};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "oto-onay",
    description: "Checkleri otomatik onaylar."
};
