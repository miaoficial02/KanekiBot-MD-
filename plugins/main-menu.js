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

  // Generar el menú si aún no está
  await global.menu();

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
    const imageURL = "https://qu.ax/RkiEC.jpg"; // Fondo personalizado
    const imgBuffer = await got(imageURL).buffer();

    await conn.sendMessage(
      m.chat,
      {
        image: imgBuffer,
        caption: txt.trim(),
        contextInfo: {
          mentionedJid: mention,
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "🔥 KanekiBot - Menú Oficial",
            body: "Pulsa para ver comandos disponibles",
            thumbnail: imgBuffer,
            sourceUrl: "https://whatsapp.com/channel/kaneki-channel-id", // Opcional
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("Error al enviar menú:", e);
    conn.reply(m.chat, txt.trim(), m, { mentions: mention });
  }
};

handler.command = /^menu|menú|help|comandos|commands|\?$/i;
export default handler;

// 🎯 Saludo automático
function ucapan() {
  const hour = moment().tz("America/Mexico_City").format("HH");
  if (hour >= 18) return "🌙 Buenas noches";
  if (hour >= 12) return "🌞 Buenas tardes";
  return "🌅 Buenos días";
}

// 📂 Generador del menú por categorías
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
