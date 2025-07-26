import got from "got";
import moment from "moment-timezone";

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

  const menuTexto = `
╭━━〔 👾 𝗞𝗔𝗡𝗘𝗞𝗜𝗕𝗢𝗧 - 𝗠𝗘𝗡𝗨 〕━━⬣
┃ ✦ 𝗨𝘀𝘂𝗮𝗿𝗶𝗼: ${userName}
┃ ✦ 𝗡𝘂́𝗺𝗲𝗿𝗼: +${userNumber}
┃ ✦ 𝗙𝗲𝗰𝗵𝗮: ${formattedDate}
┃ ✦ 𝗛𝗼𝗿𝗮: ${formattedTime}
┃ ✦ 𝗦𝗮𝗹𝘂𝗱𝗼: ${saludo}
╰━━━━━━━━━━━━━━━━━━⬣

${global.menutext.trim()}

╭━━〔 🧠 𝗔𝗨𝗧𝗢𝗥 〕━━⬣
┃ ✦ 𝗕𝗼𝘁: *KanekiBot*
┃ ✦ 𝗖𝗿𝗲𝗮𝗱𝗼𝗿: *Bajo Bots*
┃ ✦ 🌐 wa.me/573162402768
╰━━━━━━━━━━━━━━━━⬣`;

  const mention = [m.sender];
  const imageURL = "https://qu.ax/RkiEC.jpg";

  try {
    const imgBuffer = await got(imageURL).buffer();

    await conn.sendMessage(m.chat, {
      image: imgBuffer,
      caption: menuTexto,
      mentions: mention,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: mention,
        externalAdReply: {
          title: "🔥 KanekiBot - Menú de comandos",
          body: "Explora todo lo que puedo hacer por ti",
          thumbnail: imgBuffer,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: ""
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error("[❌ Error al mostrar el menú]:", e);
    conn.reply(m.chat, menuTexto, m, { mentions: mention });
  }
};

handler.command = /^menu|menú|help|comandos|commands|\?$/i;
export default handler;

function ucapan() {
  const hour = moment().tz("America/Mexico_City").format("HH");
  if (hour >= 18) return "🌙 Buenas noches";
  if (hour >= 12) return "🌞 Buenas tardes";
  return "🌅 Buenos días";
}

global.menu = async function getMenu() {
  let text = "";
  const help = Object.values(global.plugins).filter(p => !p.disabled).map(p => ({
    help: Array.isArray(p.help) ? p.help.filter(Boolean) : [],
    tags: Array.isArray(p.tags) ? p.tags.filter(Boolean) : [],
  }));

  const tags = {};
  for (const plugin of help) {
    for (const tag of plugin.tags) {
      if (tag) tags[tag] = tag.toUpperCase();
    }
  }

  const icons = {
    tools: "🛠", fun: "🎲", game: "🎮", admin: "🛡",
    sticker: "🎨", group: "👥", internet: "🌐",
    download: "📥", anime: "🍙", roleplay: "🎭", default: "📂"
  };

  for (const category of Object
