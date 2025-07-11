let handler = async (m, { text }) => {
  if (!text) throw '📌 *Ejemplo de uso:*\n.rcanal https://whatsapp.com/channel/123456789012345678';

  const match = text.match(/whatsapp\.com\/channel\/([0-9A-Za-z]{20,})/i);
  if (!match) throw '❌ Enlace inválido. Usa uno como:\nhttps://whatsapp.com/channel/XXXXXXXXXXXXXXX';

  const rawId = match[1];
  const channelId = `${rawId}@broadcast`;

  const info = `
╭━━〔 *📣 ENLACE DE CANAL DETECTADO* 〕━━⬣
┃ 🔗 *Link:* ${text}
┃ 🆔 *ID del canal:* ${channelId}
┃ ⚠️ *Nota:* No se puede obtener más datos porque el bot no está suscrito al canal.
╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim();

  return m.reply(info);
};

handler.help = ["rcanal <link del canal>"];
handler.tags = ["tools"];
handler.command = /^rcanal$/i;

export default handler;
