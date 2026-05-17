const {
  Client,
  GatewayIntentBits,
} = require("discord.js");

const {
  DisTube
} = require("distube");

const {
  YouTubePlugin
} = require("@distube/youtube");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = "!";

const distube = new DisTube(client, {
  plugins: [new YouTubePlugin()]
});

client.on("ready", () => {
  console.log(`${client.user.tag} جاهز`);
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // مساعده
  if (command === "مساعده") {

    message.reply(`
📜 اوامر البوت:

!مساعده
!شغل اسم_الاغنية
!وقف
!تشغيل
!ادخل
!تخطي
    `);
  }

  // ادخل
  if (command === "ادخل") {

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel)
      return message.reply("ادخل روم صوتي اول");

    voiceChannel.join?.();

    message.reply("دخلت للفويس 🎧");
  }

  // شغل
  if (command === "شغل") {

    const song = args.join(" ");

    if (!song)
      return message.reply("اكتب اسم اغنية");

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel)
      return message.reply("ادخل روم صوتي اول");

    distube.play(voiceChannel, song, {
      textChannel: message.channel,
      member: message.member
    });

    message.reply(`🎶 يتم تشغيل: ${song}`);
  }

  // وقف
  if (command === "وقف") {

    distube.pause(message);

    message.reply("⏸️ تم ايقاف الاغنية");
  }

  // تشغيل
  if (command === "تشغيل") {

    distube.resume(message);

    message.reply("▶️ رجعت الاغنية تشتغل");
  }

  // تخطي
  if (command === "تخطي") {

    distube.skip(message);

    message.reply("⏭️ تم تخطي الاغنية");
  }

});

client.login("MTUwNTYzNzMxMDQ2NzgwMTIxOQ.GpPSnK.h6TXFeNE-4GoPXk-9c_lOZwTmgHRDnOAa2j6H4");
