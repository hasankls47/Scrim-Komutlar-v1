const { PermissionsBitField } = require("discord.js");
const db = require("croxydb")
const { prefix, color, emojiler  } = require("../ayarlar.js")
exports.run = async (client, message, args) => {
    const yetkili = db.fetch(`${message.guild.id}_scrimyetkili`);


    if (!message.member.roles.cache.has(yetkili) && !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.channel.send({
            embeds: [{
                color: color,
                author: {
                    name: `${client.user.username} - Oto Free Yaz`, icon_url: message.author.avatarURL({ dynamic: true })
                },
                description: `${emojiler.hayir} Bu komutu kullanabilmek için <@&${yetkili}> rolüne ya da Mesajları Yönet yetkisine ihtiyacın var.`
            }]
        });
    }

    const hedefKanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

    if (!hedefKanal) {
        return message.channel.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Oto Free Yaz`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                description: `${emojiler.hayir} Mesajların gönderileceği bir hedef kanal etiketlemelisin. (Örn: ${prefix}otofreeyaz #hedef-kanal)`,
                footer: {
                    text: `Bu komutu kullanan kullanıcı ${message.author.tag}`,
                    iconURL: `${message.author.displayAvatarURL()}`
                },
                color: color
            }]
        });
    }


    const kaynakKanal = message.channel;

    try {
        const fetchedMessages = await kaynakKanal.messages.fetch({ limit: 30 });
        const messagesToSend = fetchedMessages.filter(msg => !msg.author.bot && msg.id !== message.id).first(100);


        if (messagesToSend.length === 0) {
            return message.channel.send({
                embeds: [{
                    color: color,
                    author: {
                        name: `${client.user.username} - Oto Free Yaz`, icon_url: message.author.avatarURL({ dynamic: true })
                    },
                    description: `${emojiler.hayir} Bu kanalda (${kaynakKanal}) gönderilecek (bot olmayan ve komut dışı) mesaj bulunamadı.`
                }]
            });
        }

        for (const msg of messagesToSend) { 
            await hedefKanal.send(`${msg.content}\n${msg.author}`);
        }

        await kaynakKanal.send({
            embeds: [{
                color: color,
                description: `${emojiler.onay} ${messagesToSend.length} mesaj başarıyla ${hedefKanal} kanalına gönderildi.`
            }]
        });

    } catch (error) {
        console.error("Mesajlar işlenirken hata oluştu:", error);
        kaynakKanal.send({
            embeds: [{
                color: "RED",
                description: `${emojiler.hayir} Mesajlar ${hedefKanal} kanalına gönderilirken bir hata oluştu. Lütfen botun her iki kanalda da gerekli (okuma, yazma) izinlere sahip olduğundan emin olun.`
            }]
        });
    }
};

exports.conf = {
    aliases: ["free-yaz"]
};

exports.help = {
    name: "otofreeyaz",
    description: "Komutun kullanıldığı kanaldaki mesajları, etiketlenen 'register' kanalına yazar."
   
};