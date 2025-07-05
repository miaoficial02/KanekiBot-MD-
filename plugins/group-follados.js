// desarrollado por Bajo Bots

var handler = async (m, { conn }) => {
  if (!m.isGroup) {
    return conn.reply(m.chat, '⚠️ *Este comando solo se puede usar en grupos.*', m);
  }

  const mensaje = `
╭━━━[ 🔞 𝗗𝗢𝗠𝗜𝗡𝗔𝗖𝗜𝗢𝗡 𝗧𝗢𝗧𝗔𝗟 🔥 ]━━━⬣
┃ 🔥 *_Follados x 666_* 🔥
┃ 👅 ¿Y ahora qué van a hacer perritas? 🐶💦
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`;

  await conn.reply(m.chat, mensaje.trim(), m);
};

handler.command = ['follados']; // ✅ funciona con prefijo (.follados, !follados, etc.)
handler.group = true;           // Solo en grupos
handler.botAdmin = false;
handler.admin = false;
handler.register = false;
handler.help = ['follados'];
handler.tags = ['fun'];

export default handler;
