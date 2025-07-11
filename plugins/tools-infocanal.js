let handler = async (m, { text }) => {
  if (!text) throw '📌 *Ejemplo de uso:*\n.rcanal https://whatsapp.com/channel/1234567890ABCDE';

  const match = text.match(/whatsapp\.com\/channel\/([0-9A-Za-z]{20,})/i);
  if (!match) throw '❌ Enlace inválido. Asegúrate de usar un link como:\nhttps://whatsapp.com/channel/XXXXXXXXXXXXXXX';

  const rawId = match[1];
  const channelId = `${rawId}@newsletter`;

  const info = `
╭━━〔 *📣 DETECCIÓN DE CANAL* 〕━━⬣
┃ 🔗 *Link del canal:*
┃ ${text}
┃ 
┃ 🆔 *ID del canal:*
┃ ${channelId}
┃ 
┃ ⚠️ *Nota:* No se puede obtener más datos (nombre, descripción, etc.) porque el bot no está suscrito.
╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim();

  return m.reply(info);
};

handler.help = ["rcanal <link del canal>"];
handler.tags = ["tools"];
handler.command = /^rcanal$/i;

export default handler;
