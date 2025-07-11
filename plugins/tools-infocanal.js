let handler = async (m, { conn, text }) => {
  if (!text) throw '📌 *Ejemplo de uso:*\n.rcanal https://whatsapp.com/channel/123456789012345678';

  // Extraer ID del canal desde el link
  let channelId;
  const match = text.match(/channel\/([0-9A-Za-z]{20,})/i);
  if (match) {
    channelId = `${match[1]}@broadcast`;
  } else {
    throw '❌ Enlace de canal inválido.\n🔗 Usa un enlace como:\nhttps://whatsapp.com/channel/xxxxxxxxxxxxxxxxxxxx';
  }

  let metadata;
  try {
    metadata = await conn.groupMetadata(channelId);
  } catch (e) {
    console.log('[ERROR METADATA]', e);
    throw '❌ No se pudo acceder al canal. Asegúrate de que el bot esté suscrito a él.';
  }

  // Extraer info
  const { id, subject, desc, creation, owner } = metadata;
  const fechaCreacion = new Date(creation * 1000).toLocaleString("es", {
    timeZone: "America/Bogota"
  });
  const creador = owner ? "@" + owner.split("@")[0] : "Desconocido";

  const info = `
╭━━〔 *📣 INFORMACIÓN DEL CANAL* 〕━━⬣
┃ 📛 *Nombre:* ${subject}
┃ 🆔 *ID:* ${id}
┃ 👤 *Creador:* ${creador}
┃ 🕒 *Creado:* ${fechaCreacion}
┃ 📝 *Descripción:* ${desc || "Sin descripción"}
╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim();

  await conn.sendMessage(m.chat, {
    text: info,
    mentions: [owner].filter(Boolean)
  }, { quoted: m });
};

handler.help = ["rcanal <link del canal>"];
handler.tags = ["tools"];
handler.command = /^rcanal$/i;

export default handler;
