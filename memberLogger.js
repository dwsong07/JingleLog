const { memberLogChannelId } = require("./config.json");

module.exports = async function (client) {
    const jingle = client.guilds.cache.array()[0];
    const memberLogChannel = await client.channels.fetch(memberLogChannelId);

    // cache invites
    let invite = await jingle.fetchInvites();

    client.on("guildMemberAdd", async (member) => {
        try {
            memberLogChannel.send(`<@${member.id}>님, 환영합니다!`);

            const cachedInvite = invite;
            invite = await member.guild.fetchInvites();

            const usedInvite = invite.find((i) => {
                return cachedInvite.get(i?.code)?.uses < i?.uses;
            });

            if (!usedInvite) {
                memberLogChannel.send(
                    `누가 ${member.user.tag}님을 초대했는지 모르겠어요 ㅁㄴㅇㄹ`
                );
                return;
            }

            const inviter = client.users.cache.get(usedInvite.inviter.id);

            memberLogChannel.send(
                `**${inviter.tag}**님이 **${member.user.tag}**님을 초대했습니다. 이 초대 링크는 ${usedInvite.uses}번 사용되었습니다.`
            );
        } catch (err) {
            console.error(err);
        }
    });

    client.on("guildMemberRemove", async (member) => {
        try {
            memberLogChannel.send(`${member.user.tag}님, 안녕히가세요..`);
        } catch (err) {
            console.error(err);
        }
    });
};
