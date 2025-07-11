import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    let link = args[0];
    if (!link || !link.includes('whatsapp.com/')) {
      return m.reply(`📌 *Ejemplo de uso:*\n${usedPrefix + command} https://whatsapp.com/channel/123456789`);
    }

    let code = link.split('/').pop().trim();
    let info = await conn.newsletterMetadata("invite", code);
    if (!info) return m.reply('❌ No se pudo obtener la información del canal.');

    let texto = `
╭━━〔 𝙄𝙉𝙁𝙊 𝘾𝘼𝙉𝘼𝙇 〕━━⬣
┃📌 *ID:* ${info.id || 'Desconocido'}
┃📣 *Nombre:* ${info.name || 'Desconocido'}
┃📝 *Descripción:* ${info.description || 'Sin descripción'}
┃📷 *Foto:* ${info.pictureUrl ? 'Disponible' : 'No disponible'}
┃✅ *Verificado:* ${info.verified ? 'Sí' : 'No'}
┃👥 *Seguidores:* ${info.subscriberCount || 0}
┃🔗 *Invitación:* https://whatsapp.com/channel/${info.inviteCode || code}
╰━━━━━━━━━━━━━━━━⬣`.trim();

    // Enviamos solo UNA respuesta, con diseño y miniatura si hay
    if (info.pictureUrl) {
      await conn.sendMessage(m.chat, {
        image: { url: info.pictureUrl },
        caption: texto
      }, { quoted: m });
    } else {
      await conn.reply(m.chat, texto, m);
    }
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Hubo un error al obtener la información del canal.');
  }
};

handler.command = /^rcanal|$/i;

export default handler;
