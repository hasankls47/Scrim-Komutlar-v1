const Discord = require("discord.js");
const db = require("croxydb");
const { prefix, color, emojiler } = require("../ayarlar.js")
exports.run = async (client, message, args) => {
    const yetkili = db.fetch(`${message.guild.id}_scrimyetkili`);

    if (!message.member.roles.cache.has(yetkili) || !message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) {
        return message.channel.send({
            embeds: [{
                color: color,
                author: {
                    name: `${client.user.username} - Oto Pass`, icon_url: message.author.avatarURL({ dynamic: true })
                },
                description: `${emojiler.hayir} Bu komutu kullanabilmek için <@&${yetkili}> rolüne yada \`Rolleri Yönet\` yetkisine ihtiyacın var.`
            }]
        });
    }
    if (!message.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.ManageRoles)) {
        return message.channel.send({
            embeds: [{
                color: color,
                author: {
                    name: `${client.user.username} - Oto Pass`, icon_url: message.author.avatarURL({ dynamic: true })
                },
                description: `${emojiler.hayir} \`Rolleri Yönet\` yetkim olmadığı için işlemi gerçekleştiremedim.`
            }]
        });
    }
    const pass = db.fetch(`${message.guild.id}_scrimpassrole`);
    const emojiId = db.fetch(`${message.guild.id}_scrimonayemoji`);

    if (!pass) {
        return message.channel.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Oto Pass`,
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

    if (!emojiId) {
        return message.channel.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Oto Pass`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                description: `${emojiler.hayir} Onay emojisi ayarlanmamış; \`${prefix}scrim ayarla emoji :emoji:\``,
                footer: {
                    text: `Bu komutu kullanan kullanıcı ${message.author.tag}`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                color: color
            }]
        });
    }

    const role = message.guild.roles.cache.get(pass);
    if (!role) {
        return message.channel.send({
            embeds: [{
                author: { name: `${client.user.username} - Oto Pass`, iconURL: message.author.avatarURL() },
                color: color,
                description: `${emojiler.hayir} Pass rolü sunucuda bulunmuyor.`,
                timestamp: new Date().toISOString(),
                footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
            }]
        })
    }
    if (role.position >= message.guild.members.me.roles.highest.position) {
        return message.channel.send({
            embeds: [{
                author: { name: `${client.user.username} - Oto Pass`, iconURL: message.author.avatarURL() },
                color: color,
                description: `${emojiler.hayir} Pass rolü benim rolümün üstünde olduğundan işlemi gerçekleştiremedim.`,
                timestamp: new Date().toISOString(),
                footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
            }]
        })
    }
    const messages = await message.channel.messages.fetch({ limit: 100 });

    for (const [id, msg] of messages) {
        const reaction = msg.reactions.cache.find(r => r.emoji.id === emojiId);
        if (reaction) {
            const users = await reaction.users.fetch();
            const messageAuthor = msg.author;
            const member = message.guild.members.cache.get(messageAuthor.id);
            if (member && !member.roles.cache.has(role.id)) {
                await member.roles.add(role);
            }
        }
    }
    await message.channel.send({
        embeds: [{
            author: { name: `${client.user.username} - Oto Pass`, iconURL: message.author.avatarURL() },
            color: color,
            description: `Onay alan takımlara ${role} rolü verildi.`,
            timestamp: new Date().toISOString(),
            footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
        }]
    })
};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "otopass",
    description: "Onay alan takımlara Pass rolü verir."
};
