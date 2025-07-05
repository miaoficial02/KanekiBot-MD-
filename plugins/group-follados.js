// desarrollado por Bajo Bots

var handler = async (m, { conn }) => {
  if (!m.isGroup) {
    return conn.reply(m.chat, '⚠️ *Este comando solo se puede usar en grupos.*', m);
  }

  // Nivel de follamiento aleatorio entre 1 y 100
  const nivel = Math.floor(Math.random() * 100) + 1;

  const mensaje = `
╭━━━[ 🔞 𝗗𝗢𝗠𝗜𝗡𝗔𝗖𝗜𝗢𝗡 𝗧𝗢𝗧𝗔𝗟 🔥 ]━━━⬣
┃ 🔥 *_Follados x 666_* 🔥
┃ 😈 *Nivel de follamiento:* ${nivel}%
┃ 👅 ¿Y ahora qué van a hacer perritas? 🐶💦
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`;

  await conn.reply(m.chat, mensaje.trim(), m);
};

handler.command = ['follados'];
handler.group = true;
handler.botAdmin = false;
handler.admin = false;
handler.register = false;
handler.help = ['follados'];
handler.tags = ['group'];

export default handler;

