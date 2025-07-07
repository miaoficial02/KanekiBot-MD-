import { fetch } from "undici";

let handler = async (m, { conn, usedPrefix, command, args }) => {
  try {
    if (!args[0]) {
      return m.reply(`🔰 *Uso correcto:*\n${usedPrefix + command} https://www.facebook.com/watch/?v=123456789`);
    }

    if (!args[0].match(/(?:https?:\/\/)?(?:www\.|m\.)?(facebook|fb)\.(com|watch)\S+/)) {
      return m.reply("❌ *Enlace inválido.*\nAsegúrate de que sea un enlace de Facebook válido.");
    }

    m.react("🕒");

    let fb = await aio(args[0]);

    if (!fb?.medias?.length) {
      return m.reply("⚠️ *No se encontró ningún video disponible.*");
    }

    // Buscar una versión con audio
    let mediaConAudio = fb.medias.find(m => m.hasAudio && m.url.includes('.mp4'));

    if (!mediaConAudio) {
      return m.reply("❌ *No se encontró un archivo de video con audio disponible.*\nPuede que esté en un formato separado.");
    }

    await conn.sendFile(
      m.chat,
      mediaConAudio.url,
      `facebook.mp4`,
      `🎬 *Facebook Video*\n\n📽️ *Calidad:* ${mediaConAudio.quality}\n📦 *Tamaño:* ${mediaConAudio.formattedSize || "Desconocido"}\n\n📥 *Extraído con KanekiBot-MD*`,
      m
    );

    m.react("✅");

  } catch (e) {
    console.error("❌ Error:", e);
    return conn.reply(m.chat, `❎ *Error al descargar el video:*\n${e.message}`, m);
  }
};

handler.help = ["facebook"];
handler.command = ["fb", "facebook"];
handler.tags = ["download"];
export default handler;

async function aio(url) {
  try {
    const response = await fetch("https://anydownloader.com/wp-json/aio-dl/video-data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://anydownloader.com/",
        "Token": "5b64d1dc13a4b859f02bcf9e572b66ea8e419f4b296488b7f32407f386571a0d",
      },
      body: new URLSearchParams({ url }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error al conectar con AIO:", error);
    throw error;
  }
}
