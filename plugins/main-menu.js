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
╭━━🎌 *K A N E K I B O T  -  M E N Ú* 🎌━━⬣
┃👤 *Usuario:* ${userName}
┃📱 *Número:* +${userNumber}
┃📆 *Fecha:* ${formattedDate}
┃⏰ *Hora:* ${formattedTime}
┃💬 *Saludo:* ${saludo}
╰━━━━━━━━━━━━━━━━━━━━━━━━⬣\n`;

  const footer = `
╭══🎌 *C R E A D O R* 🎌══⬣
┃👾 *Nombre:* Bajo Bots
┃🌐 *WhatsApp:* wa.me/573162402768
╰━━━━━━━━━━━━━━━━━━━━━━⬣`;

  const txt = header + global.menutext + footer;
  const mention = [m.sender];

  try {
    const imageURL = "https://qu.ax/RkiEC.jpg"; // Puedes usar tu propia imagen
    const imgBuffer = await got(imageURL).buffer();

    await conn.sendMessage(
      m.chat,
      {
        image: imgBuffer,
        caption: txt,
        contextInfo: {
          mentionedJid: mention,
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "🔥 KanekiBot - Menú Oficial",
            body: "Pulsa para acceder a nuestro canal",
            thumbnail: imgBuffer,
            sourceUrl: "https://whatsapp.com/channel/kaneki-channel-id", // Cambia esto
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
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

// 🎯 Saludo automático según hora
function ucapan() {
  const hour = moment().tz("America/Los_Angeles").format("HH");
  if (hour >= 18) return "🌙 Buenas noches";
  if (hour >= 12) return "🌞 Buenas tardes";
  return "🌅 Buenos días";
}

// 📂 Construcción del menú
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
    tools: "🛠",
    fun: "🎲",
    game: "🎮",
    admin: "🛡",
    sticker: "🎨",
    group: "👥",
    internet: "🌐",
    download: "📥",
    anime: "🍙",
    roleplay: "🎭",
    premium: "💎",
    economy: "💰",
    search: "🔎",
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
      text += commands.map(cmd => `┃ ⤷ ${cmd}`).join("\n");
      text += `\n╰────────────────────────⬣\n\n`;
    }
  }

  global.menutext = text.trim();
};
