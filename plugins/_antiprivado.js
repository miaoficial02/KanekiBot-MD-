let handler = async (m, { conn }) => {
  const dueñosPermitidos = [
    '573162402768@s.whatsapp.net', // ← TU NÚMERO AQUÍ ✅
  ];

  if (!m.isGroup && !dueñosPermitidos.includes(m.sender)) {
    // ⏳ Reacción visual
    await m.react('🔒');

    // 💬 Mensaje de advertencia
    await conn.sendMessage(m.chat, {
      text: `
┌──「 *🔴 ACCESO DENEGADO* 」
│
│ ⚠️ *KanekiBot-MD no está disponible en chats privados.*
│ 🧩 Solo el dueño puede usarlo aquí.
│
│ 🧱 *Tu número será bloqueado automáticamente.*
│
└─────⬣
`.trim(),
    }, { quoted: m });

    // 🚫 Bloquear al usuario
    await conn.updateBlockStatus(m.sender, 'block');
    return true; // Detiene ejecución
  }

  return false; // Si es grupo o autorizado, continúa normal
};

export default handler;
handler.before = true;
