const { Client, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { YouTubePlugin } = require("@distube/youtube");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const distube = new DisTube(client, {
  plugins: [new YouTubePlugin()],
});

const prefix = "!";

client.on("ready", () => {
  console.log(`${client.user.tag} شغال 🎧`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift();

  if (command === "مساعده") {
    return message.reply(`
🎵 الأوامر:

!ادخل
!شغل اسم_الاغنية
!وقف
!تشغيل
!تخطي
!مساعده
    `);
  }

  if (command === "ادخل") {
    const vc = message.member.voice.channel;

    if (!vc) {
      return message.reply("ادخل فويس أول");
    }

    return message.reply("أنا جاهز بالفويس 🎧");
  }

  if (command === "شغل") {
    const song = args.join(" ");

    if (!song) {
      return message.reply("اكتب اسم أغنية");
    }

    const vc = message.member.voice.channel;

    if (!vc) {
      return message.reply("ادخل فويس أول");
    }

    try {
      await distube.play(vc, song, {
        textChannel: message.channel,
        member: message.member,
      });

      message.reply(`🎶 شغلت: ${song}`);
    } catch (e) {
      console.log(e);
      message.reply("صار خطأ بالتشغيل");
    }
  }

  if (command === "وقف") {
    distube.pause(message);

    message.reply("⏸️ توقف");
  }

  if (command === "تشغيل") {
    distube.resume(message);

    message.reply("▶️ كمل التشغيل");
  }

  if (command === "تخطي") {
    distube.skip(message);

    message.reply("⏭️ تخطيت الأغنية");
  }
});

client.login(process.env.TOKEN);
