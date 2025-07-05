import got from "got";
import moment from "moment-timezone";
import { promises as fs } from "fs";

let handler = async (m, { conn }) => {
  m.react("📜");

  const senderId = m.sender;
  const userNumber = senderId.split("@")[0];
  const userName = await conn.getName(senderId);
  const time = moment().tz("America/Mexico_City");
  const formattedDate = time.format("dddd, D [de] MMMM YYYY");
  const formattedTime = time.format("hh:mm A");
  const saludo = ucapan();

  if (!global.menutext) await global.menu();

  const header = `
╭━〔 🤖 *KANEKIBOT* 〕━⬣
┃ 🧑‍💼 *Usuario:* ${userName}
┃ 📱 *Número:* +${userNumber}
┃ 📅 *Fecha:* ${formattedDate}
┃ ⏰ *Hora:* ${formattedTime}
┃ 💬 *Saludo:* ${saludo}
╰━━━━━━━━━━━━━━━━━━━━⬣`;

  const footer = `
╭─〔 👤 *Creador del Bot* 〕──⬣
┃ 👨‍💻 Nombre: *Bajo Bots*
┃ 🌐 GitHub: github.com/kleiner1-1
┃ 📱 WhatsApp: wa.me/573162402768
╰────────────────────────⬣

╭─〔 📦 *Acerca de KanekiBot* 〕──⬣
┃ 🤖 Bot estable y optimizado
┃ 🧠 IA y funciones múltiples
┃ 🛠 En constante desarrollo
┃ 🔒 Privacidad garantizada
╰────────────────────────⬣

╭─〔 📢 *Soporte y Comunidad* 〕──⬣
┃ 💬 Únete a nuestro grupo
┃ 📣 Próximas actualizaciones
┃ 📌 Usa .help para más info
╰────────────────────────⬣`;

  const txt = header + "\n" + global.menutext + "\n" + footer;
  const mention = [m.sender];

  try {
    const imageURL = "https://qu.ax/RkiEC.jpg";
    const { body: imgBuffer } = await got(imageURL, { responseType: 'buffer' });

    await conn.sendMessage(
      m.chat,
      {
        document: imgBuffer,
        fileName: 'KanekiBot - Menu.pdf',
        mimetype: 'application/pdf',
        caption: txt,
        fileLength: 99999999,
        contextInfo: {
          mentionedJid: mention,
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "✨ KanekiBot - Menú",
            body: "🤖 Diseño único por Bajo Bots",
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
    conn.reply(m.chat, "❎ Error al mostrar el menú principal: " + e, m);
  }
};

handler.command = /^menu|help|menú|commands|comandos|\?$/i;
export default handler;

function ucapan() {
  const time = moment().tz("America/Los_Angeles").format("HH");
  if (time >= 18) return "Good night.";
  if (time >= 15) return "Good afternoon.";
  if (time >= 10) return "Good afternoon.";
  if (time >= 4) return "Good morning.";
  return "Hello.";
}

var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
var yStr = Object.freeze({
  1: ['ᴀ','ʙ','ᴄ','ᴅ','ᴇ','ꜰ','ɢ','ʜ','ɪ','ᴊ','ᴋ','ʟ','ᴍ','ɴ','ᴏ','ᴘ','q','ʀ','ꜱ','ᴛ','ᴜ','ᴠ','ᴡ','x','ʏ','ᴢ','1','2','3','4','5','6','7','8','9','0'],
  2: ['𝑎','𝑏','𝑐','𝑑','𝑒','𝑓','𝑔','ℎ','𝑖','𝑗','𝑘','𝑙','𝑚','𝑛','𝑜','𝑝','𝑞','𝑟','𝑠','𝑡','𝑢','𝑣','𝑤','𝑥','𝑦','𝑧','1','2','3','4','5','6','7','8','9','0'],
  3: ['𝐀','𝐁','𝐂','𝐃','𝐄','𝐅','𝐆','𝐇','𝐈','𝐉','𝐊','𝐋','𝐌','𝐍','𝐎','𝐏','𝐐','𝐑','𝐒','𝐓','𝐔','𝐕','𝐖','𝐗','𝐘','𝐙','𝟏','𝟐','𝟑','𝟒','𝟓','𝟔','𝟕','𝟖','𝟗','𝟎'],
  10: ['𝖺','𝖻','𝖼','𝖽','𝖾','𝖿','𝗀','𝗁','𝗂','𝗃','𝗄','𝗅','𝗆','𝗇','𝗈','𝗉','𝗊','𝗋','𝗌','𝗍','𝗎','𝗏','𝗐','𝗑','𝗒','𝗓','1','2','3','4','5','6','7','8','9','0']
});

global.style = async function style(text, style = 1) {
  const replacer = xStr.map((v, i) => ({
    original: v,
    convert: yStr[style]?.[i] || v,
  }));
  return text
    .toLowerCase()
    .split("")
    .map((char) => replacer.find((x) => x.original === char)?.convert || char)
    .join("");
};

global.menu = async function getMenu() {
  let text = "";

  const help = Object.values(global.plugins)
    .filter((plugin) => !plugin.disabled)
    .map((plugin) => ({
      help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
    }));

  const tags = {};
  for (const plugin of help) {
    for (const tag of plugin.tags || []) {
      if (tag) tags[tag] = tag.toUpperCase();
    }
  }

  const categoryIcons = {
    tools: "🧰",
    fun: "🎮",
    game: "🕹️",
    admin: "🛠️",
    sticker: "🎨",
    group: "👥",
    internet: "🌐",
    download: "⬇️",
    anime: "🍥",
    roleplay: "🎭",
    default: "📁"
  };

  for (const category of Object.keys(tags)) {
    const cmds = await Promise.all(
      help
        .filter((menu) => menu.tags?.includes(category))
        .map(async (menu) => {
          return await Promise.all(
            menu.help.map(
              async (cmd) => `   ┆ ⏣ ${await style(cmd, 10)}`
            )
          );
        })
    );

    if (cmds.length > 0) {
      const icon = categoryIcons[category] || categoryIcons.default;
      text += `╭━━━〔 ${icon} ${await style(tags[category], 3)} 〕━━⬣\n`;
      text += cmds.map((cmdArray) => cmdArray.join("\n")).join("\n");
      text += `\n╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n`;
    }
  }

  global.menutext = text;
};
