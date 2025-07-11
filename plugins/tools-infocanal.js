import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `📌 *Ejemplo de uso:*\n.rcanal https://whatsapp.com/channel/0029Vb63Kf9KwqSQLOQOtk3N`, m);
    }

    if (!text.includes('https://whatsapp.com/channel/')) {
      return conn.reply(m.chat, `❌ Enlace inválido. Usa uno como:\nhttps://whatsapp.com/channel/XXXXXXXXXXXX`, m);
    }

    let info = await getChannelInfo(conn, text);

    // Respuesta rica (texto con miniatura y link visual)
    await conn.relayMessage(m.chat, {
      extendedTextMessage: {
        text: info.text,
        contextInfo: {
          mentionedJid: conn.parseMention(info.text),
          externalAdReply: {
            title: info.name,
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnail: await (await fetch(info.picture || logo)).buffer(),
            sourceUrl: `https://whatsapp.com/channel/${info.invite}`
          }
        }
      }
    }, { quoted: m });

    // También responde el ID real del canal
    await m.reply(`🆔 *ID del canal:* ${info.id}`);
    m.react("☑️");

  } catch (error) {
    console.error('[ERROR R-CANAL]', error);
    await conn.reply(m.chat, `❌ Error al obtener la información del canal:\n${error.message}`, m);
  }
};

handler.command = ["rcanal", "inspect", "id"];
handler.help = ["rcanal <link del canal>"];
handler.tags = ["tools"];
export default handler;

// Función para obtener la metadata real del canal por el código
async function getChannelInfo(conn, url) {
  const match = url.match(/https:\/\/whatsapp\.com\/channel\/([0-9A-Za-z]+)/i);
  if (!match) throw new Error("❌ El enlace proporcionado no es válido o no pertenece a un canal de WhatsApp.");

  const channelCode = match[1];

  const data = await conn.newsletterMetadata("invite", channelCode);

  const fecha = new Date(data.creation_time * 1000);
  const fechaTexto = fecha.toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });

  const description = data.description || "Sin descripción";

  const text = `
╭━━〔 *📣 INFORMACIÓN DEL CANAL* 〕━━⬣
┃ 📛 *Nombre:* ${data.name}
┃ 🆔 *ID:* ${data.id}
┃ 📅 *Creado:* ${fechaTexto}
┃ 👥 *Seguidores:* ${data.subscribers}
┃ ✅ *Verificado:* ${data.verified ? "Sí" : "No"}
┃ 🌐 *Enlace:* https://whatsapp.com/channel/${data.invite}
┃ 📝 *Descripción:* 
${description}
╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim();

  return {
    id: data.id,
    name: data.name,
    text,
    invite: data.invite,
    picture: data.picture_url
  };
}
