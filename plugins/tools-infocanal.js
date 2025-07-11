
let handler = async (m, { conn }) => {
  if (!m.isGroup) throw "❌ Este comando solo puede usarse en grupos o canales.";

  const metadata = await conn.groupMetadata(m.chat);
  const { id, subject, owner, participants, creation, desc, restrict, announce, ephemeral } = metadata;

  const admins = participants.filter(p => p.admin).map(p => "• @" + p.id.split("@")[0]).join("\n") || "Ninguno";
  const creator = owner ? "@" + owner.split("@")[0] : "Desconocido";

  const info = `
╭━━〔 *📡 INFORMACIÓN DEL GRUPO/CANAL* 〕━━⬣
┃ 🆔 *ID:* id
┃ 📛 *Nombre:*{subject}
┃ 👤 *Creador:* creator
┃ 👥 *Participantes:*{participants.length}
┃ 🛡️ *Admins:* participants.filter(p => p.admin).length
┃ 🔐 *Solo admins escriben:*{announce ? 'Sí' : 'No'}
┃ 🚫 *Restricciones:* restrict ? 'Sí' : 'No'
┃ ⏳ *Mensajes temporales:*{ephemeral ? `ephemeral / 60 min` : 'Desactivado'
┃ 🕒 *Creado:*{new Date(creation * 1000).toLocaleString()}
┃ 📝 *Descripción:*
┃ desc ? desc : 'Sin descripción'
┃
┃ 🔧 *Admins:*{admins}
╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim();

  m.reply(info, null, {
    mentions: [owner, ...participants.filter(p => p.admin).map(p => p.id)].filter(Boolean)
  });
};
handler.help = ["rcanal"];
handler.tags = ["tools"];
handler.command = /^rcanal$/i;
handler.group = true;

export default handler;
```
