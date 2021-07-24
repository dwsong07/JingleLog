const { messageLogChannelId } = require("./config.json");
const { MessageEmbed } = require("discord.js");

module.exports = async function (client) {
    let logChannel;

    try {
        logChannel = await client.channels.fetch(messageLogChannelId);
    } catch (err) {
        console.error(err);
    }

    function messageEventEmbed(author) {
        const embed = new MessageEmbed()
            .setAuthor(author?.tag, author?.avatarURL() || "")
            .setTimestamp(new Date());

        return embed;
    }

    client.on("message", (msg) => {
        if (msg.channel.type === "dm") return;
        if (msg.channel.id === messageLogChannelId) return;

        const embed = messageEventEmbed(msg.author).setDescription(
            `<@${msg.author.id}> said \`${msg.content}\` in <#${msg.channel.id}>`
        );

        logChannel.send(embed);
    });

    client.on("messageDelete", (msg) => {
        if (msg.channel.type === "dm") return;

        const embed = messageEventEmbed(msg.author).setDescription(
            `Someone deleted \`${msg.content}\` sent by <@${msg.author?.id}> in <#${msg.channel.id}>`
        );

        logChannel.send(embed);
    });

    client.on("messageUpdate", (oldMsg, newMsg) => {
        if (oldMsg.channel.type === "dm") return;

        const embed = messageEventEmbed(oldMsg.author).setDescription(
            `Someone edited \`${oldMsg.content}\` to \`${newMsg.content}\` sent by <@${oldMsg.author?.id}> in <#${oldMsg.channel.id}>`
        );

        logChannel.send(embed);
    });

    client.on("messageReactionAdd", async (reaction, user) => {
        if (reaction.message.channel.type === "dm") return;

        try {
            if (user.partial) await user.fetch();
            const { content, author } = reaction.message;

            const embed = messageEventEmbed(user).setDescription(
                `<@${
                    user.id
                }> reacted ${reaction.emoji.toString()} to \`${content}\` sent by <@${
                    author.id
                }>`
            );

            logChannel.send(embed);
        } catch (err) {
            console.error(err);
        }
    });

    client.on("messageReactionRemove", async (reaction, user) => {
        if (reaction.message.channel.type === "dm") return;

        try {
            if (user.partial) await user.fetch();
            const { content, author } = reaction.message;

            const embed = messageEventEmbed(user).setDescription(
                `<@${
                    user.id
                }> unreacted ${reaction.emoji.toString()} to \`${content}\` sent by <@${
                    author.id
                }>`
            );

            logChannel.send(embed);
        } catch (err) {
            console.error(err);
        }
    });
};
