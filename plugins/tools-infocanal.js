let handler = async (m, { conn, text }) => {
  if (!text) throw '📌 *Ejemplo de uso:*\n.rcanal https://whatsapp.com/channel/123456789012345678';

  // Extraer ID del canal desde link
  let channelId;
  if (text.includes('whatsapp.com/channel/')) {
    const match = text.match(/channel\/([\dA-Za-z]{20,})/);
    if (!match) throw '❌ No se pudo leer el ID del canal.';
    channelId = `${match[1]}@broadcast`;
  } else if (text.endsWith('@broadcast')) {
    channelId = text;
  } else {
    throw '⚠️ Proporciona un enlace válido de canal de WhatsApp.';
  }

  let metadata;
  try {
    metadata = await conn.groupMetadata(channelId);
  } catch (e) {
    throw '❌ No se pudo acceder al canal. Asegúrate de que el bot esté suscrito a él.';
  }

  const { id, subject, desc, creation, owner, participants } = metadata;
  const fechaCreacion = new Date(creation * 1000).toLocaleString("es", { timeZone: "America/Bogota" });

  const info = `
╭━━〔 *📣 INFORMACIÓN DEL CANAL* 〕━━⬣
┃ 🆔 *ID:* ${id}
┃ 📛 *Nombre:* ${subject}
┃ 👤 *Creador:* ${owner ? "@" + owner.split("@")[0] : "Desconocido"}
┃ 🕒 *Creado:* ${fechaCreacion}
┃ 👥 *Seguidores:* ${participants?.length || 'No disponible'}
┃ 📝 *Descripción:* ${desc || 'Sin descripción'}
╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim();

  await m.reply(info);
};

handler.help = ["rcanal <link del canal>"];
handler.tags = ["tools"];
handler.command = /^rcanal$/i;

export default handler;
