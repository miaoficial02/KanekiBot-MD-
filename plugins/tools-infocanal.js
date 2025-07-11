import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    let link = args[0];
    if (!link || !link.includes('whatsapp.com/')) {
      return m.reply(`🚨 *Debes proporcionar un enlace de canal válido:*\n\n📌 Ejemplo:\n${usedPrefix + command} https://whatsapp.com/channel/123456789`);
    }

    let code = link.split('/').pop().trim();
    let info = await conn.newsletterMetadata("invite", code);
    if (!info) return m.reply('❌ No se pudo obtener información del canal.');

    let texto = `
╭━━━〔 *📣 INFORMACIÓN DEL CANAL* 〕━━⬣
┃✨ *Nombre:* ${info.name || 'Sin nombre'}
┃🆔 *ID:* ${info.id || 'Desconocido'}
┃📝 *Descripción:* ${info.description || 'Sin descripción'}
┃📷 *Foto:* ${info.pictureUrl ? 'Disponible' : 'No disponible'}
┃👥 *Seguidores:* ${info.subscriberCount || 0}
┃✅ *Verificado:* ${info.verified ? 'Sí' : 'No'}
┃🔗 *Link:* https://whatsapp.com/channel/${info.inviteCode || code}
╰━━━━━━━━━━━━━━━━━━━━━━━━⬣`.trim();

    if (info.pictureUrl) {
      await conn.sendMessage(m.chat, {
        image: { url: info.pictureUrl },
        caption: texto,
      }, { quoted: m });
    } else {
      await m.reply(texto);
    }
  } catch (e) {
    console.error('[ERROR EN RCANAL]:', e);
    m.reply('⚠️ Ocurrió un error al procesar la información del canal.');
  }
};

// ✅ Comando limpio sin expresión regular mal formada
handler.command = new RegExp('^rcanal$', 'i');
handler.tags = ['tools'];
handler.help = ['rcanal <link>'];

export default handler;
