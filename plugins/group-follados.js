//desarrollado por bajo bots


var handler = async (m, { conn, isGroup }) => {
  if (!isGroup) {
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

// ✅ Con prefijo (por defecto .follados o !follados, etc.)
handler.command = ['follados'];

handler.group = true;
handler.botAdmin = false;
handler.admin = false;
handler.register = false;

handler.help = ['follados'];
handler.tags = ['fun'];

export default handler;
