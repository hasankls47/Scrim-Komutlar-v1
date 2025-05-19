const Discord = require("discord.js");
const db = require("croxydb");
const { prefix, color, emojiler } = require("../ayarlar.js")
exports.run = async (client, message, args) => {
    if (!message.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) {
        return message.channel.send({
            embeds: [{
                author: { name: `${client.user.username} - Passdevir`, iconURL: message.author.avatarURL() },
                color: color,
                description: `${emojiler.hayir} \`Rolleri Yönet\` yetkim bulunmadığından işlemi gerçekleştiremedim.`,
                timestamp: new Date().toISOString(),
                footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
            }]
        })

    }
    const pass = db.fetch(`${message.guild.id}_scrimpassrole`);
    const passdevirkanalı = db.fetch(`${message.guild.id}_passdevirkanal`);

    if (!passdevirkanalı) {
        return message.channel.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Pass Devir`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                description: `${emojiler.hayir} Pass devir kanalı ayarlanmamış: \`${prefix}scrim ayarla passdevir #kanal\``,
                footer: {
                    text: `Bu komutu kullanan kullanıcı ${message.author.tag}`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                color: color
            }]
        });
    }
    if (message.channel.id !== passdevirkanalı) {
        return message.reply(`Bu komutu <#${passdevirkanalı}> kanalında kullanabilirsiniz.`);
    }
    if (!pass) {
        return message.channel.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Pass Devir`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                description: `${emojiler.hayir} Pass rolü ayarlanmamış; \`${prefix}scrim ayarla pass @pass\``,
                footer: {
                    text: `Bu komutu kullanan kullanıcı ${message.author.tag}`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                color: color
            }]
        });
    }

    const kullanıcı = message.mentions.members.first();
    if (!kullanıcı) {
        return message.channel.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Pass Devir`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                description: `${emojiler.hayir} Bir kullanıcı etiketlemelisin.`,
                footer: {
                    text: `Bu komutu kullanan kullanıcı ${message.author.tag}`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                color: color
            }]
        });
    }

    // Komutu kullanan kişinin Pass rolüne sahip olup olmadığı kontrolü
    if (!message.member.roles.cache.has(pass)) {
        return message.channel.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Pass Devir`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                description: `${emojiler.hayir} Pass rolüne sahip değilsin.`,
                footer: {
                    text: `Bu komutu kullanan kullanıcı ${message.author.tag}`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                color: color
            }]
        });
    }
    let passrolü = message.guild.roles.cache.get(pass)
    if (passrolü.position >= message.guild.members.me.roles.highest.position) {
        return message.channel.send({
            embeds: [{
                author: { name: `${client.user.username} - Passdevir`, iconURL: message.author.avatarURL() },
                color: color,
                description: `${emojiler.hayir} Pass rolü benim rolümün üstünde olduğundan işlemi gerçekleştiremedim.`,
                timestamp: new Date().toISOString(),
                footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
            }]
        })
    }

    await message.member.roles.remove(pass);
    await kullanıcı.roles.add(pass);
    await message.channel.send({
        embeds: [{
            author: { name: `${client.user.username} - Passdevir`, iconURL: message.author.avatarURL() },
            color: color,
            description: `${passrolü} rolün başarıyla ${kullanıcı} kullanıcısına devredildi.`,
            timestamp: new Date().toISOString(),
            footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
        }]
    })
};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "passdevir",
    description: "Pass rolünü başka bir kullanıcıya devreder."
};
