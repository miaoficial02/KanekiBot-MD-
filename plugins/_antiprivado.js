let handler = async (m, { conn, isOwner, isPrems }) => {
  const ownerNumber = '573162402768@s.whatsapp.net'; // ← TU NÚMERO AQUÍ

  // Si el mensaje es en privado y el remitente no es el owner
  if (!m.isGroup && m.sender !== ownerNumber) {
    // Evitar procesar comandos en privado
    if (m.text.startsWith('.')) {
      await m.react('🛑');

      await conn.sendMessage(m.chat, {
        text: `
╭━━〔 𝗔𝗖𝗖𝗘𝗦𝗢 𝗗𝗘𝗡𝗘𝗚𝗔𝗗𝗢 〕━━⬣
┃ 🚫 *No puedes usar comandos en privado.*
┃ 🧩 Este bot solo responde en grupos.
┃ 🔐 *Tu número será bloqueado automáticamente.*
╰━━━━━━━━━━━━━━━━━━⬣`.trim(),
      }, { quoted: m });

      // Bloquea al usuario
      await conn.updateBlockStatus(m.sender, 'block');

      return true; // Detiene el procesamiento del comando
    }
  }

  return false; // Permitir en grupos o si es el owner
};

export default handler;
handler.before = true;
