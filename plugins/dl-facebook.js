import { fetch } from "undici";

let handler = async (m, { conn, usedPrefix, command, args }) => {
  try {
    if (!args[0]) {
      return m.reply(`🔰 *Uso correcto:*\n${usedPrefix + command} https://www.facebook.com/share/v/1FwfwCUQEv/`);
    }

    if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) {
      return m.reply("❌ *Enlace inválido.*\nAsegúrate de que sea un enlace válido de Facebook.");
    }

    m.react("🕒");

    let fb = await aio(args[0]);
    if (!fb.medias[0]) {
      return m.reply("⚠️ *No se pudo obtener el video.*\nPuede que el enlace no sea público o esté restringido.");
    }

    let media = fb.medias[1] || fb.medias[0];

    await conn.sendFile(
      m.chat,
      media.url,
      `video.mp4`,
      `🎬 *Video Descargado*\n\n🌐 *Calidad:* ${media.quality}\n📦 *Tamaño:* ${media.formattedSize}\n\n📥 *Descargado desde:* Facebook`,
      m
    );
  } catch (e) {
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
