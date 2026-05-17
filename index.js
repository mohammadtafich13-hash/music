const { Client, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { YouTubePlugin } = require("@distube/youtube");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const distube = new DisTube(client, {
  plugins: [new YouTubePlugin()]
});

const prefix = "!";

client.on("ready", () => {
  console.log(`${client.user.tag} جاهز 🎧`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift();

  // المساعدة
  if (cmd === "مساعده") {
    return message.reply(`
📌 الأوامر:

!ادخل
!شغل اسم الأغنية
!وقف
!تشغيل
!تخطي
!مساعده
    `);
  }

  // دخول الفويس
  if (cmd === "ادخل") {
    const vc = message.member.voice.channel;
    if (!vc) return message.reply("ادخل روم صوتي أول");

    message.reply("دخلت الفويس 🎧");
  }

  // تشغيل أغنية
  if (cmd === "شغل") {
    const song = args.join(" ");
    if (!song) return message.reply("اكتب اسم الأغنية");

    const vc = message.member.voice.channel;
    if (!vc) return message.reply("ادخل روم صوتي أول");

    distube.play(vc, song, {
      textChannel: message.channel,
      member: message.member
    });

    message.reply(`🎶 جاري التشغيل: ${song}`);
  }

  // إيقاف
  if (cmd === "وقف") {
    distube.pause(message);
    message.reply("⏸️ توقف");
  }

  // تشغيل
  if (cmd === "تشغيل") {
    distube.resume(message);
    message.reply("▶️ يكمل التشغيل");
  }

  // تخطي
  if (cmd === "تخطي") {
    distube.skip(message);
    message.reply("⏭️ تم التخطي");
  }
});

client.login(process.env.TOKEN);
