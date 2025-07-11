let handler = async (m, { conn, text, args }) => {
  // Validación: solo en grupos o canales
  if (!m.isGroup && !text) throw "❌ Este comando solo puede usarse en grupos o se debe proporcionar el ID/enlace de un grupo o canal.";

  // Obtener ID del grupo/canal
  let groupId;
  if (text) {
    const regex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
    const match = text.match(regex);
    if (match) {
      // Si es link, obtener el ID
      const code = match[1];
      try {
        groupId = await conn.groupAcceptInvite(code); // Devuelve el ID sin unirse
        await conn.groupLeave(groupId); // Salirse de inmediato si se unió por error
      } catch {
        throw "⚠️ No se pudo acceder al grupo con ese enlace. Asegúrate de que sea válido y público.";
      }
    } else if (text.endsWith("@g.us")) {
      groupId = text;
    } else {
      throw "⚠️ Proporciona un link válido o el ID del grupo (terminado en @g.us)";
    }
  } else {
    groupId = m.chat;
  }

  // Obtener metadata del grupo
  let metadata;
  try {
    metadata = await conn.groupMetadata(groupId);
  } catch (e) {
    throw "❌ No se pudo acceder al grupo. Verifica que el bot esté en él o que sea un grupo válido.";
  }

  const { id, subject, owner, participants, creation, desc, restrict, announce, ephemeral } = metadata;

  const admins = participants.filter(p => p.admin).map(p => "• @" + p.id.split("@")[0]).join("\n") || "Ninguno";
  const creator = owner ? "@" + owner.split("@")[0] : "Desconocido";
  const adminCount = participants.filter(p => p.admin).length;
  const fechaCreacion = new Date(creation * 1000).toLocaleString("es", { timeZone: "America/Bogota" });

  const info = `
╭━━〔 *📡 INFORMACIÓN DEL GRUPO/CANAL* 〕━━⬣
┃ 🆔 *ID:* ${id}
┃ 📛 *Nombre:* ${subject}
┃ 👤 *Creador:* ${creator}
┃ 👥 *Participantes:* ${participants.length}
┃ 🛡️ *Admins:* ${adminCount}
┃ 🔐 *Solo admins escriben:* ${announce ? '✅ Sí' : '❌ No'}
┃ 🚫 *Restricciones:* ${restrict ? '✅ Sí' : '❌ No'}
┃ ⏳ *Mensajes temporales:* ${ephemeral ? `${ephemeral / 60} min` : 'Desactivado'}
┃ 🕒 *Creado:* ${fechaCreacion}
┃ 📝 *Descripción:* ${desc ? desc : 'Sin descripción'}
┃
┃ 🔧 *Lista de Admins:*
${admins}
╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim();

  const mentions = [
    ...(owner ? [owner] : []),
    ...participants.filter(p => p.admin).map(p => p.id)
  ];

  await m.reply(info, null, { mentions });
};

handler.help = ["rcanal [link|ID]"];
handler.tags = ["tools"];
handler.command = /^rcanal$/i;

export default handler;
