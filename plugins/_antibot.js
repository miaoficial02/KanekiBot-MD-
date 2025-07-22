// comando por @BajoBots
// github.com/kleiner1-1

let handler = async (m, { conn, participants, isBotAdmin, args, command }) => {
  const emoji = '🤖';
  const emoji2 = '⚠️';
  const emojiSuccess = '✅';
  const isOwner = global.owner.map(o => typeof o === 'string' ? o : o[0]).includes(m.sender);

  if (!isOwner) return conn.reply(m.chat, `${emoji2} *Solo el Owner del bot puede usar este comando.*`, m);
  if (!isBotAdmin) return conn.reply(m.chat, `${emoji2} *Necesito permisos de administrador para eliminar bots.*`, m);

  // Manejo de encendido/apagado
  let chat = db.data.chats[m.chat];
  if (!chat) db.data.chats[m.chat] = {};
  if (args[0] === 'on') {
    chat.antibots = true;
    return conn.reply(m.chat, `${emojiSuccess} *Sistema Anti-Bots activado correctamente.*`, m);
  } else if (args[0] === 'off') {
    chat.antibots = false;
    return conn.reply(m.chat, `${emoji2} *Sistema Anti-Bots desactivado.*`, m);
  }

  if (!chat.antibots) {
    return conn.reply(m.chat, `${emoji} *El sistema Anti-Bots está desactivado.*\n\n📌 Usa: *${command} on* para activarlo.`, m);
  }

  // Buscar y eliminar bots
  const globalOwners = global.owner.map(o => typeof o === 'string' ? o : o[0] + '@s.whatsapp.net');
  let toKick = participants.filter(p => {
    const id = p.id || '';
    return (
      id.endsWith('@s.whatsapp.net') &&
      id.includes(':') &&
      !p.admin &&
      id !== conn.user.jid &&
      !globalOwners.includes(id)
    );
  }).map(p => p.id);

  if (toKick.length === 0) {
    return conn.reply(m.chat, `${emoji} *No se encontraron bots que no sean admin para eliminar.*`, m);
  }

  try {
    const aviso = await conn.sendMessage(m.chat, {
      text: `🚫 *Sistema Anti-Bots activado*\n\n${emoji2} *Eliminando bots no autorizados...*`,
    }, { quoted: m });

    await new Promise(r => setTimeout(r, 5000));
    await conn.sendMessage(m.chat, { delete: aviso.key });

    await conn.groupParticipantsUpdate(m.chat, toKick, 'remove');

    const final = await conn.sendMessage(m.chat, {
      text: `${emojiSuccess} *Bots eliminados correctamente.*\n\n⚔️ *Protección activa por KanekiBot-MD*`,
    }, { quoted: m });

    await new Promise(r => setTimeout(r, 4000));
    await conn.sendMessage(m.chat, { delete: final.key });

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, `${emoji2} *Error al eliminar bots del grupo.*`, m);
  }
};

handler.help = ['antibots [on|off]'];
handler.tags = ['group', 'proteccion'];
handler.command = ['antibots', 'kickbots', 'eliminarbots'];
handler.group = true;
handler.botAdmin = true;

export default handler;
