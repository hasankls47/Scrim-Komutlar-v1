const Discord = require("discord.js");
const db = require("croxydb")
db.setReadable(true)
const { prefix, color, emojiler } = require("../ayarlar.js")
exports.run = async (client, message, args) => {


    if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return message.reply({
        embeds: [{
            color: color,
            author: {
                name: `${client.user.username} - Scrim Sistemi`, icon_url: message.author.avatarURL({ dynamic: true })
            },
            description: `${emojiler.hayir} Bu komutu kullanabilmek için \`Yönetici\` yetkisine **ihtiyacınız** var!`
        }]
    })
    if (!message.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
        return message.channel.send({
            embeds: [{
                author: { name: `${client.user.username} - Passdevir`, iconURL: message.author.avatarURL() },
                color: color,
                description: `${emojiler.hayir} \`Yönetici\` yetkim bulunmadığından işlemi gerçekleştiremedim.`,
                timestamp: new Date().toISOString(),
                footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
            }]
        })
    }
    if (!args[0]) return message.channel.send({
        embeds: [{
            author: {
                name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
            },

            description: `${emojiler.hayir} Bir argüman girmelisin;\n\`${prefix}scrim ayarla\`\n\`${prefix}scrim sıfırla\``,

            footer: {
                name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
            },
            color: color

        }]
    })
    if (args[0] === "ayarla") {
const emojidb = db.fetch(`${message.guild.id}_scrimonayemoji`);
const passroldb = db.fetch(`${message.guild.id}_scrimpassrole`);
const yetkilidb = db.fetch(`${message.guild.id}_scrimyetkili`);
const devirkanaldb = db.fetch(`${message.guild.id}_passdevirkanal`);

const emojidata = message.guild.emojis.cache.get(emojidb) ? `${message.guild.emojis.cache.get(emojidb)}` : '***Ayarlanmamış***';
const passroldata = message.guild.roles.cache.get(passroldb) ? `${message.guild.roles.cache.get(passroldb)}` : '***Ayarlanmamış***';
const yetkilidata = message.guild.roles.cache.get(yetkilidb) ? `${message.guild.roles.cache.get(yetkilidb)}` : '***Ayarlanmamış***';
const devirdata = message.guild.channels.cache.get(devirkanaldb) ? `${message.guild.channels.cache.get(devirkanaldb)}` : '***Ayarlanmamış***';
        if (!args[1]) return message.channel.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                },

                description: `${emojiler.hayir} Bir argüman girmelisin;\n\`${prefix}scrim ayarla emoji :emoji:\`(${emojidata})\n\`${prefix}scrim ayarla pass @Password\`(${passroldata})\n\`${prefix}scrim ayarla yetkili @BotKullanım\`(${yetkilidata})\n\`${prefix}scrim ayarla passdevir #passdevir\`(${devirdata})`,

                footer: {
                    name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                },
                color: color

            }]
        })
        if (args[1] === "emoji") {
            let emojiayarlı = db.fetch(`${message.guild.id}_scrimonayemoji`)
            if (emojiayarlı) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Onay emojisini zaten ayarlamışsın.`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })

            if (!args[2]) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Bir emoji girmelisin: \`${prefix}scrim ayarla emoji :emoji:\``,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })

            if (args[2]) {
                const regex = /<:\w+:(\d+)>/;
                const match = args[2].match(regex);
                if (match) {
                    const emojiID = match[1];
                    const data = message.guild.emojis.cache.get(emojiID)
                    db.set(`${message.guild.id}_scrimonayemoji`, data.id)
                    return message.channel.send({
                        embeds: [{
                            author: {
                                name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                            },

                            description: `${emojiler.onay} Başarıyla emojiyi ${data} olarak ayarladım.`,

                            footer: {
                                name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                            },
                            color: color

                        }]
                    })
                } else {
                    return message.channel.send({
                        embeds: [{
                            author: {
                                name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.displayAvatarURL()
                            },

                            description: `${emojiler.hayir} Belirttiğin emoji bu sunucuya ait değil.`,

                            footer: {
                                name: `Sorgulayan ${message.author.username}`, iconURL: message.author.displayAvatarURL()
                            },
                            color: color

                        }]
                    })
                }
            }


        }

        if (args[1] === "pass") {

            let passayarlı = db.fetch(`${message.guild.id}_scrimpassrole`)
            if (passayarlı) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.displayAvatarURL()
                    },

                    description: `${emojiler.hayir} Pass rolünü zaten ayarlamışsın`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.displayAvatarURL()
                    },
                    color: color

                }]
            })
            var rol = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == args[2])

            if (!rol) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.displayAvatarURL()
                    },

                    description: `${emojiler.hayir} Bir Rol etiketlemelisin: \`${prefix}scrim ayarla pass @Password\``,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.displayAvatarURL()
                    },
                    color: color

                }]
            })
            if (rol.position >= message.guild.members.me.roles.highest.position) {
                return message.channel.send({
                    embeds: [{
                        author: { name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL() },
                        color: color,
                        description: `Belirttiğin rol benim rolümün üstünde olduğundan işlemi gerçekleştiremedim.`,
                        timestamp: new Date().toISOString(),
                        footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
                    }]
                })
            }
            if (rol.managed === true) {
                return message.channel.send({
                    embeds: [{
                        author: { name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL() },
                        color: color,
                        description: `Belirttiğin rol bir bot rolü olduğundan işlemi gerçekleştiremedim.`,
                        timestamp: new Date().toISOString(),
                        footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
                    }]
                })
            }
            await message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.displayAvatarURL()
                    },

                    description: `${emojiler.onay} Pass rolü başarıyla ${rol} olarak ayarlandı.`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.displayAvatarURL()
                    },
                    color: color

                }]
            })
            db.set(`${message.guild.id}_scrimpassrole`, rol.id)

        }
        if (args[1] === "yetkili") {

            let yetkiliayarlı = db.fetch(`${message.guild.id}_scrimyetkili`)
            if (yetkiliayarlı) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Scrim yetkili rolünü zaten ayarlamışsın.`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })
            var rol = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == args[2])

            if (!rol) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Bir Rol etiketlemelisin: \`${prefix}scrim ayarla yetkili @BotKullanım\``,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })
            if (rol.position >= message.guild.members.me.roles.highest.position) {
                return message.channel.send({
                    embeds: [{
                        author: { name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL() },
                        color: color,
                        description: `Belirttiğin rol benim rolümün üstünde olduğundan işlemi gerçekleştiremedim.`,
                        timestamp: new Date().toISOString(),
                        footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
                    }]
                })
            }
            if (rol.managed === true) {
                return message.channel.send({
                    embeds: [{
                        author: { name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL() },
                        color: color,
                        description: `Belirttiğin rol bir bot rolü olduğundan işlemi gerçekleştiremedim.`,
                        timestamp: new Date().toISOString(),
                        footer: { text: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL() }
                    }]
                })
            }
            message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.onay} Scrim yetkili rolü başarıyla ${rol} olarak ayarlandı.`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })
            db.set(`${message.guild.id}_scrimyetkili`, rol.id)

        }

        if (args[1] === "passdevir") {

            let yetkiliayarlı = db.fetch(`${message.guild.id}_passdevirkanal`)
            if (yetkiliayarlı) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Pass Devir Kanalını zaten ayarlamışsın.`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })
            var kanal = message.mentions.channels.first() || message.guild.channels.cache.find(k => k.id == args[2])

            if (!kanal) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Bir kanal etiketlemelisin: \`${prefix}scrim ayarla passdevir #kanal\``,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })

            message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.onay} Pass Devir kanalı başarıyla ${rol} olarak ayarlandı.`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })
            db.set(`${message.guild.id}_passdevirkanal`, kanal.id)

        }

    }

    if (args[0] === "sıfırla") {
        if (!args[1]) return message.channel.send({
            embeds: [{
                author: {
                    name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                },

                description: `${emojiler.hayir} Bir argüman belirtmelisin;\n\`${prefix}scrim sıfırla emoji\`\n\`${prefix}scrim sıfırla pass\`\n\`${prefix}scrim sıfırla yetkili\`\n\`${prefix}scrim sıfırla passdevir\`\n\`${prefix}scrim sıfırla confirmlog\``,

                footer: {
                    name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                },
                color: color

            }]
        })

        if (args[1] === "emoji") {
            let emoji = db.fetch(`${message.guild.id}_scrimonayemoji`)
            if (!emoji) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Scrim onay emojisi zaten ayarlı değil!`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })

            message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.onay} Scrim onay emojisi başarıyla sıfırlandı!`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })
            db.delete(`${message.guild.id}_scrimonayemoji`)

        }
        if (args[1] === "pass") {
            let emoji = db.fetch(`${message.guild.id}_scrimpassrole`)
            if (!emoji) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Scrim pass rolü zaten ayarlı değil!`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })

            message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.onay} Scrim pass rolü başarıyla sıfırlandı!`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })
            db.delete(`${message.guild.id}_scrimpassrole`)

        }

        if (args[1] === "yetkili") {
            let emoji = db.fetch(`${message.guild.id}_scrimyetkili`)
            if (!emoji) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Scrim yetkili rolü zaten ayarlı değil!`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })

            message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.onay} Scrim yetkili rolü başarıyla sıfırlandı!`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })
            db.delete(`${message.guild.id}_scrimyetkili`)

        }
        if (args[1] === "passdevir") {
            let emoji = db.fetch(`${message.guild.id}_passdevirkanal`)
            if (!emoji) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Pass devir kanalı zaten ayarlı değil!`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })

            message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.onay} Pass devir kanalı başarıyla sıfırlandı!`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })
            db.delete(`${message.guild.id}_passdevirkanal`)

        }

        if (args[1] === "confirmlog") {
            let emoji = db.fetch(`confirmlog_${message.guild.id}`)
            if (!emoji) return message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.hayir} Confirm Log kanalı zaten ayarlı değil!`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })

            message.channel.send({
                embeds: [{
                    author: {
                        name: `${client.user.username} - Scrim Sistemi`, iconURL: message.author.avatarURL()
                    },

                    description: `${emojiler.onay} Confirm Log kanalı başarıyla sıfırlandı!`,

                    footer: {
                        name: `Sorgulayan ${message.author.username}`, iconURL: message.author.avatarURL()
                    },
                    color: color

                }]
            })
            db.delete(`confirmlog_${message.guild.id}`)

        }
    }
}

exports.conf = {
    aliases: []
};
exports.help = {
    name: "scrim",
    description: "Scrim ayarlarını yaparsın."
};