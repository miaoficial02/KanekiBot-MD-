import got from "got";
import moment from "moment-timezone";

let handler = async (m, { conn }) => {
  m.react("🌐");

  const senderId = m.sender;
  const userNumber = senderId.split("@")[0];
  const userName = await conn.getName(senderId);
  const time = moment().tz("America/Mexico_City");
  const formattedDate = time.format("dddd, D [de] MMMM YYYY");
  const formattedTime = time.format("hh:mm A");
  const saludo = ucapan();

  if (!global.menutext) await global.menu();

  const header = `
╭━━〔 👾 𝗞𝗔𝗡𝗘𝗞𝗜𝗕𝗢𝗧 - 𝗠𝗘𝗡𝗨 〕━━⬣
┃ 🧑‍💻 𝗨𝘀𝘂𝗮𝗿𝗶𝗼: ${userName}
┃ 📱 𝗡𝘂𝗺𝗲𝗿𝗼: +${userNumber}
┃ 📆 𝗙𝗲𝗰𝗵𝗮: ${formattedDate}
┃ ⏰ 𝗛𝗼𝗿𝗮: ${formattedTime}
┃ 💬 𝗦𝗮𝗹𝘂𝗱𝗼: ${saludo}
╰━━━━━━━━━━━━━━━━━━⬣\n`;

  const footer = `
╭══〔 👑 𝗖𝗥𝗘𝗔𝗗𝗢𝗥 〕══⬣
┃ 🧠 𝗡𝗼𝗺𝗯𝗿𝗲: *Bajo Bots*
┃ 🌎 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: wa.me/573162402768
╰══════════════════⬣`;

  const txt = header + global.menutext + footer;
  const mention = [m.sender];

  try {
    const imageURL = "https://qu.ax/RkiEC.jpg"; // tu imagen de fondo
    const imgBuffer = await got(imageURL).buffer();

    await conn.sendMessage(
      m.chat,
      {
        document: imgBuffer,
       // fileName: '⚡ KanekiBot - Menú Oficial ⚡.pdf',
        mimetype: 'application/pdf',
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
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, txt, m, { mentions: mention });
    conn.reply(m.chat, "⚠️ Error al enviar el menú: " + e, m);
  }
};

handler.command = /^menu|menú|help|comandos|commands|\?$/i;
export default handler;

// 🕐 Saludo automático
function ucapan() {
  const hour = moment().tz("America/Los_Angeles").format("HH");
  if (hour >= 18) return "🌙 Buenas noches";
  if (hour >= 12) return "🌞 Buenas tardes";
  return "🌅 Buenos días";
}

// 🔠 Menú global
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
      text += `╭──〔 ${icon} 𝙈𝙊𝘿𝙐𝙇𝙊: ${tags[category]} 〕──⬣\n`;
      text += commands.map(cmd => `┃ ✦ 〉 *${cmd}*`).join("\n");
      text += `\n╰────────────────────────⬣\n\n`;
    }
  }

  global.menutext = text;
};
