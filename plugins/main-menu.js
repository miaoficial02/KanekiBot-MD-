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

  // ━━━ Diseño del encabezado ━━━
  const header = `
╭━〔 🤖 *KANEKIBOT* 〕━⬣
┃ 🧑‍💼 *Usuario:* ${userName}
┃ 📱 *Número:* +${userNumber}
┃ 📅 *Fecha:* ${formattedDate}
┃ ⏰ *Hora:* ${formattedTime}
┃ 💬 *Saludo:* ${saludo}
╰━━━━━━━━━━━━━━━━━━━━⬣
`;

  // ━━━ Pie del mensaje ━━━
  const footer = `
╭━〔 📌 *Información* 〕━⬣
┃ 💡 Usa los comandos con precaución.
┃ 📬 Contacto: wa.me/1234567890
╰━━━━━━━━━━━━━━━━━━━━⬣
`;

  // ━━━ Combinamos todo ━━━
  const fullMenu = [
    header.trim(),
    "📚 *Menú de comandos:*",
    global.menutext.trim(),
    footer.trim()
  ].join("\n\n");

  const mention = conn.parseMention(fullMenu);

  try {
    const img = await fs.readFile("./src/menu.jpg");

    await conn.sendMessage(
      m.chat,
      {
        document: img,
        mimetype: "image/png",
        caption: fullMenu,
        fileLength: 1900,
        contextInfo: {
          mentionedJid: mention,
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "Menú de comandos KanekiBot",
            body: `Gracias por usar KanekiBot`,
            thumbnail: img,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  } catch (e) {
    conn.reply(m.chat, fullMenu, m, { mentions: mention });
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
