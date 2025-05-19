const Discord = require("discord.js");
const db = require("croxydb");
const { color, prefix, emojiler } = require("../ayarlar.js")

exports.run = async (client, message, args) => {
    const yetkili = db.fetch(`${message.guild.id}_scrimyetkili`);

    if (!message.member.roles.cache.find(r => r.id === yetkili) || !message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) {
        return message.channel.send({
            embeds: [{
                color: color,
                author: {
                    name: `${client.user.username} - Takım Sil`, icon_url: message.author.avatarURL({ dynamic: true })
                },
                description: `${emojiler.hayir} Bu komutu kullanabilmek için \`Mesajları Yönet\` yetkisine ihtiyacın var.`
            }]
        });
    }
    if (!message.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) {
        return message.channel.send({
            embeds: [{
                color: color,
                author: {
                    name: `${client.user.username} - Takım Sil`, icon_url: message.author.avatarURL({ dynamic: true })
                },
                description: `${emojiler.hayir} \`Mesajları Yönet\` yetkisi bende bulunmadığından işlemi gerçekleştiremedim.`
            }]
        });
    }

    const emojiId = db.fetch(`${message.guild.id}_scrimonayemoji`);
    if (!emojiId) {
        return message.channel.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Takım Sil`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                description: `${emojiler.hayir} Onay emojisi ayarlanmamış: \`${prefix}scrim ayarla emoji :${client.user.username}:\``,
                footer: {
                    text: `Bu komutu kullanan kullanıcı ${message.author.tag}`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                color: color
            }]
        });
    }

    const messages = await message.channel.messages.fetch({ limit: 100 });

    const messagesToDelete = [];
    for (const [id, msg] of messages) {
        const hasEmoji = msg.reactions.cache.some(reaction => reaction.emoji.id === emojiId);
        if (!hasEmoji && !msg.author.bot) {
            messagesToDelete.push(msg);
        }
    }

    await message.channel.bulkDelete(messagesToDelete, true);
    await message.channel.send({
        embeds: [{
            author: { name: `${client.user.username} - Takım Sil`, iconURL: message.author.avatarURL() },
            color: color,
            description: `${messagesToDelete.length} adet onay almayan takım silindi!`,
            timestamp: new Date().toISOString(),
            footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
        }]
    }).then(e => {
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
    name: "takım-sil",
    description: "Onaylanmayan takım checklerini siler."
};
