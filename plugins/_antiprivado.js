let handler = async (m, { conn }) => {
  const ownerNumber = '573162402768@s.whatsapp.net'; // <-- TU NÚMERO AQUÍ

  if (!m.isGroup && m.sender !== ownerNumber) {
    // Ignora ciertos mensajes que no sean texto
    if (!m.text) return;

    // Enviar mensaje de advertencia decorado
    await conn.sendMessage(m.chat, {
      text: `
╭━━〔 🔒 *ACCESO DENEGADO* 〕━━⬣
┃ *⛔ Este bot no está disponible en chats privados.*
┃ 
┃ 👤 Usuario: wa.me/${m.sender.split('@')[0]}
┃ 📛 Serás bloqueado por seguridad.
╰━━━━━━━━━━━━━━━━━━⬣`,
    }, { quoted: m });

    // Bloquea al usuario
    await conn.updateBlockStatus(m.sender, 'block');

    // Detener otros handlers
    return true;
  }

  return false;
};

export default handler;
handler.before = true;
