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

  // 🧾 Nuevo diseño del menú de comandos
  const customMenu = `
╭━━〔 📜 *MENÚ DE KANEKIBOT* 〕━━⬣
┃
┃ 👤 *Usuario:* ${userName}
┃ 📞 *Número:* +${userNumber}
┃ 🗓️ *Fecha:* ${formattedDate}
┃ ⏰ *Hora:* ${formattedTime}
┃ 💬 *${saludo}*, @${userNumber}!
┃
┣━━〔 🛠️ COMANDOS DISPONIBLES 〕━━⬣

📁 *Información*
├ 📄 .menu — Ver este menú
├ 🧠 .estado — Estado del bot
├ 📊 .infobot — Info general

🎮 *Juegos*
├ 🎲 .ppt (piedra/papel/tijera)
├ 🧩 .adivinanza
├ 🎯 .reto

🔍 *Búsquedas*
├ 🔎 .imagen <texto>
├ 🎵 .play <canción>
├ 📘 .letra <canción>

🎨 *Diversión*
├ 👻 .stickermenu
├ 🤖 .tiktok <url>
├ 🎭 .memes

👑 *Admin*
├ 🚫 .ban @usuario
├ ✅ .unban @usuario
├ 🛡️ .grupo abrir/cerrar

┣━━━━━━━━━━━━━━━━━━━━⬣
┃ ✨ Usa los comandos con "." al inicio
┃ 📬 Soporte: wa.me/1234567890
╰━━━━━━━━━━━━━━━━━━━━⬣
`;

  const mention = conn.parseMention(customMenu);

  try {
    const img = await fs.readFile("./src/menu.jpg");

    await conn.sendMessage(
      m.chat,
      {
        document: img,
        mimetype: "image/png",
        caption: customMenu,
        fileLength: 1900,
        contextInfo: {
          mentionedJid: mention,
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "Menú de comandos actualizado",
            body: `Disfruta los comandos de KanekiBot ✨`,
            thumbnail: img,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  } catch (e) {
    conn.reply(m.chat, customMenu, m, { mentions: mention });
    conn.reply(m.chat, "❎ Error al mostrar el menú: " + e.message, m);
  }

  await global.menu();
};

handler.command = ["menu", "help", "menú", "commands", "comandos", "?"];
export default handler;

function ucapan() {
  const hour = moment().tz("America/Mexico_City").hour();
  if (hour >= 18) return "Buenas noches";
  if (hour >= 12) return "Buenas tardes";
  if (hour >= 6) return "Buenos días";
  return "Hola";
}
