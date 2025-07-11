import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  try {
    if (!text) throw '📌 *Ejemplo de uso:*\n.rcanal https://whatsapp.com/channel/XXXXXXXXXXXX';

    if (!text.includes('whatsapp.com/channel/')) {
      return conn.reply(m.chat, `❌ *Enlace inválido.* Asegúrate de usar un link como:\nhttps://whatsapp.com/channel/XXXXXXXXXXXX`, m);
    }

    const info = await getChannelInfo(conn, text);

    const respuesta = `
╭━━━━〔 *📣 CANAL DETECTADO* 〕━━━━⬣
┃ 🏷️ *Nombre:* ${info.name}
┃ 🆔 *ID:* ${info.id}
┃ 👥 *Seguidores:* ${info.subscribers}
┃ 📅 *Creado:* ${info.fecha}
┃ ✅ *Verificado:* ${info.verified}
┃ 🔗 *Link:* 
┃ ${info.link}
┃
┃ 📝 *Descripción:* 
┃ ${info.description}
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`.trim();

    await conn.sendMessage(m.chat, {
      text: respuesta,
      mentions: conn.parseMention(respuesta),
      contextInfo: {
        externalAdReply: {
          title: info.name,
          body: `${info.verified == "Sí" ? "Canal Verificado" : "Canal No Verificado"} | ${info.subscribers} seguidores`,
          mediaType: 1,
          renderLargerThumbnail: true,
          previewType: 0,
          thumbnail: await (await fetch(info.picture)).buffer(),
          sourceUrl: info.link
        }
      }
    }, { quoted: m });

    // Mostrar ID aparte
    await m.reply(`📎 *ID del canal:* ${info.id}`);
    m.react("✅");

  } catch (err) {
    console.error('[ERROR R-CANAL]', err);
    await conn.reply(m.chat, `❌ Error al procesar el canal:\n${err.message}`, m);
  }
};

handler.command = ["rcanal", "inspect", "id"];
handler.help = ["rcanal <link del canal>"];
handler.tags = ["tools"];
export default handler;

// Función para obtener info del canal sin estar suscrito
async function getChannelInfo(conn, url) {
  const match = url.match(/channel\/([0-9A-Za-z]+)/);
  if (!match) throw new Error("❌ El enlace no contiene un código válido de canal.");

  const code = match[1];
  const data = await conn.newsletterMetadata("invite", code);

  return {
    name: data.name || "Sin nombre",
    id: data.id || "Desconocido",
    subscribers: data.subscribers || 0,
    verified: data.verified ? "Sí" : "No",
    picture: data.picture_url || "https://i.imgur.com/1Nq0v8c.png",
    description: data.description || "Sin descripción",
    fecha: new Date(data.creation_time * 1000).toLocaleDateString("es", { year: 'numeric', month: 'long', day: 'numeric' }),
    link: `https://whatsapp.com/channel/${data.invite}`
  };
}
