import moment from "moment-timezone";
import { promises as fs } from "fs";

let handler = async (m, { conn }) => {
  m.react("⚙️");

  const senderId = m.sender;
  const userNumber = senderId.split("@")[0];
  const userName = await conn.getName(senderId);
  const time = moment().tz("America/Mexico_City");
  const formattedDate = time.format("dddd, D [de] MMMM YYYY");
  const formattedTime = time.format("HH:mm A");
  const saludo = ucapan();

  if (!global.menutext) await global.menu();

  const userInfo = [
    `👤 Usuario: ${userName}`,
    `📞 Número: +${userNumber}`,
    `🕒 Hora: ${formattedTime}`,
    `📅 Fecha: ${formattedDate}`,
    "",
    `👾 𝐒𝐎𝐘 𝐊𝐀𝐍𝐄𝐊𝐈 𝐀 𝐓𝐔 𝐒𝐄𝐑𝐕𝐈𝐂𝐈𝐎 ${saludo}, @${userNumber}!`,
    "",
    global.menutext
  ].join("\n");

  const mention = conn.parseMention(userInfo);

  try {
    const img = await fs.readFile("./src/menu.jpg");

    await conn.sendMessage(
      m.chat,
      {
        document: img,
        mimetype: "image/png",
        caption: userInfo,
        fileLength: 1900,
        contextInfo: {
          mentionedJid: mention,
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "Menú de comandos",
            body: `Atte: KanekiBot`,
            thumbnail: img,
            sourceUrl: "",
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  } catch (e) {
    conn.reply(m.chat, userInfo, m, { mentions: mention });
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
