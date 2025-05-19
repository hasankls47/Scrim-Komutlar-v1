const Discord = require("discord.js");
const db = require("croxydb");
const { prefix, color, emojiler } = require("../ayarlar.js")
exports.run = async (client, message, args) => {
    const yetkili = db.fetch(`${message.guild.id}_scrimyetkili`);

    if (!message.member.roles.cache.has(yetkili) || !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
        return message.channel.send({
            embeds: [{
                color: color,
                author: {
                    name: `${client.user.username} - Pass Olmayan Sil`, icon_url: message.author.avatarURL({ dynamic: true })
                },
                description: `${emojiler.hayir} Bu komutu kullanabilmek için <@&${yetkili}> rolüne yada Yönetici yetkisine ihtiyacın var.`
            }]
        });
    }

    const rol = db.fetch(`${message.guild.id}_scrimpassrole`);
    const passRole = message.guild.roles.cache.get(rol);

    if (!rol) {
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

    const messages = await message.channel.messages.fetch({ limit: 100 });

    const messagesToDelete = [];
    messages.forEach(msg => {
        const member = message.guild.members.cache.get(msg.author.id);
        if (member && !member.roles.cache.has(passRole.id) && !msg.author.bot) {
            messagesToDelete.push(msg);
        }
    });

    await message.channel.bulkDelete(messagesToDelete, true);

    await message.channel.send(`Onaylanmayan ${messagesToDelete.length} takım silindi.`).then(e => {
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
    aliases: ["passolmayansil"]
};

exports.help = {
    name: "pass-olmayan-sil",
    description: "Pass rolü olmayan kullanıcıların mesajlarını siler."
};
