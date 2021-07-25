// 누가 초대했는지랑 , 메세지 로그, 입장 퇴장 로그

const { Client } = require("discord.js");
const messageLogger = require("./messageLogger");
const inviteLogger = require("./memberLogger");

const { token } = require("./config.json");

const client = new Client();

client.on("ready", () => {
    console.log("Bot Ready!");

    setTimeout(() => {
        messageLogger(client);
        inviteLogger(client);
    }, 1000);
});

client.login(token);
