const { inviteLogChannelId } = require("./config.json");

module.exports = async function (client) {
    const jingle = client.guilds.cache.array()[0];
    const inviteLogChannel = await client.channels.fetch(inviteLogChannelId);

    // cache invites
    let invite = await jingle.fetchInvites();

    client.on("guildMemberAdd", async (member) => {
        try {
            const cachedInvite = invite;
            invite = await member.guild.fetchInvites();

            const usedInvite = invite.find((i) => {
                return cachedInvite.get(i?.code)?.uses < i?.uses;
            });

            if (!usedInvite) {
                inviteLogChannel.send(
                    `누가 ${member.user.tag}님을 초대했는지 모르겠어요 ㅁㄴㅇㄹ`
                );
                return;
            }

            const inviter = client.users.cache.get(usedInvite.inviter.id);

            inviteLogChannel.send(
                `**${inviter.tag}**님이 **${member.user.tag}**님을 초대했습니다. 이 초대 링크는 ${usedInvite.uses}번 사용되었습니다.`
            );
        } catch (err) {
            console.error(err);
        }
    });
};
