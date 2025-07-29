import got from "got";
import moment from "moment-timezone";
import fetch from "node-fetch";

let handler = async (m, { conn, args }) => {
  m.react("🌐");

const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: "𝖬𝖤𝖭𝖴 𝖢𝖮𝖬𝖯𝖫𝖤𝖳𝖮 👾",
        jpegThumbnail: await (await fetch('https://iili.io/F8Y2bS9.jpg')).buffer(),
        vcard:
          "BEGIN:VCARD\n" +
          "VERSION:3.0\n" +
          "N:;Unlimited;;;\n" +
          "FN:Unlimited\n" +
          "ORG:Unlimited\n" +
          "TITLE:\n" +
          "item1.TEL;waid=19709001746:+1 (970) 900-1746\n" +
          "item1.X-ABLabel:Unlimited\n" +
          "X-WA-BIZ-DESCRIPTION:ofc\n" +
          "X-WA-BIZ-NAME:Unlimited\n" +
          "END:VCARD"
      }
    },
    participant: "0@s.whatsapp.net"
  };
  const targetUser = m.sender;
  const creatorNumber = '573162402768';
  const creatorMention = '@' + creatorNumber;
  const userMention = '@' + targetUser.split('@')[0];
  const mentionText = args[0] ? '@' + args[0] : userMention;

  const senderId = m.sender;
  const userNumber = senderId.split("@")[0];
  const userName = await conn.getName(senderId);

  const time = moment().tz("America/Mexico_City").locale("es");
  const formattedDate = time.format("D [de] MMMM");
  const formattedTime = time.format("hh:mm A");
  const saludo = ucapan();

  if (!global.menutext) await global.menu();

  const header = `
╭━━〔 👾 𝗞𝗔𝗡𝗘𝗞𝗜𝗕𝗢𝗧 〕━━⬣
┃ 👤 𝗨𝘀𝘂𝗮𝗿𝗶𝗼: ${mentionText}
┃ 🤖 𝗖𝗿𝗲𝗮𝗱𝗼𝗿: ${creatorMention}
┃ 📱 𝗡𝘂𝗺𝗲𝗿𝗼: +${userNumber}
┃ 📆 𝗙𝗲𝗰𝗵𝗮: ${formattedDate}
┃ ⏰ 𝗛𝗼𝗿𝗮: ${formattedTime}
┃ 💬 𝗦𝗮𝗹𝘂𝗱𝗼: ${saludo}
╰━━━━━━━━━━━━━━━━━━⬣\n\n`;

  const footer = `Power By Bajo Bots`;
  const txt = header + global.menutext + footer;

  const mention = [m.sender, creatorNumber + '@s.whatsapp.net'];

  try {
    const imageURL = "https://qu.ax/RkiEC.jpg";
    const imgBuffer = await got(imageURL).buffer();

    await conn.sendMessage(
      m.chat,
      {
        document: imgBuffer,
        caption: txt,
        fileLength: 99999999,
        contextInfo: {
          mentionedJid: mention,
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "🔥 KanekiBot - Panel de comandos",
            body: "Explora todas las funciones del bot desde este menú",
            thumbnail: imgBuffer,
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: fkontak }
    );
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, txt, m, { mentions: mention });
    conn.reply(m.chat, "⚠️ Error al enviar el menú: " + e, m);
  }
};

handler.command = ['menuhtg'];
export default handler;

function ucapan() {
  const hour = moment().tz("America/Los_Angeles").format("HH");
  if (hour >= 18) return "🌙 Buenas noches";
  if (hour >= 12) return "🌞 Buenas tardes";
  return "🌅 Buenos días";
}

global.menu = async function getMenu() {
  let text = "";

  const help = Object.values(global.plugins)
    .filter(plugin => !plugin.disabled)
    .map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help.filter(Boolean) : [],
      tags: Array.isArray(plugin.tags) ? plugin.tags.filter(Boolean) : [],
    }));

  const tags = {};
  for (const plugin of help) {
    for (const tag of plugin.tags || []) {
      if (tag) tags[tag] = tag.toUpperCase();
    }
  }

  const icons = {
    tools: "🛠️",
    fun: "🎲",
    game: "🎮",
    admin: "🛡️",
    sticker: "🖼️",
    group: "👥",
    internet: "🌐",
    download: "📥",
    anime: "🍙",
    roleplay: "🎭",
    default: "📂"
  };

  for (const category of Object.keys(tags)) {
    const commands = help
      .filter(menu => menu.tags?.includes(category))
      .flatMap(menu => menu.help)
      .filter(cmd => typeof cmd === "string" && cmd.trim());

    if (commands.length) {
      const icon = icons[category] || icons.default;
      text += `╭──〔 ${icon} ${tags[category]} 〕──⬣\n`;
      text += commands.map(cmd => `┃ ✦ 〉 _${cmd}_`).join("\n");
      text += `\n╰──────────────────⬣\n\n`;
    }
  }

  global.menutext = text;
};
