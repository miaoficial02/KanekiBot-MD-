// comando por @BajoBots
// github.com/kleiner1-1

var handler = async (m, { conn, participants, isBotAdmin }) => {
  const emoji = '🤖';
  const emoji2 = '⚠️';
  const emojiSuccess = '✅';

  const isOwner = global.owner.map(o => typeof o === 'string' ? o : o[0]).includes(m.sender);
 // if (!isOwner) return conn.reply(m.chat, `${emoji2} *Solo el Owner del bot puede usar este comando.*`, m);
  if (!isBotAdmin) return conn.reply(m.chat, `${emoji2} *Necesito permisos de administrador para eliminar bots.*`, m);

  const groupInfo = await conn.groupMetadata(m.chat);
 // const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const globalOwners = global.owner.map(o => typeof o === 'string' ? o : o[0] + '@s.whatsapp.net');

  let toKick = participants.filter(p => {
    let id = p.id || '';
    return (
      id.endsWith('@s.whatsapp.net') &&               // Es un usuario válido
      id.includes(':') &&                             // Tiene estructura de bot (ej: 12345:1@s.whatsapp.net)
      !p.admin &&                                     // No es administrador
      id !== conn.user.jid &&                         // No es el bot mismo
      id !== ownerGroup &&                            // No es el owner del grupo
  //    !globalOwners.includes(id)                      // No es owner del bot
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
      text: `${emojiSuccess} *Bots eliminados correctamente.*\n\n⚔️ *Protección por KanekiBot-MD*`,
    }, { quoted: m });

    await new Promise(r => setTimeout(r, 4000));
    await conn.sendMessage(m.chat, { delete: final.key });

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, `${emoji2} *Error al eliminar bots del grupo.*`, m);
  }
};

handler.help = ['antibots'];
handler.tags = ['group'];
handler.command = ['antibots', 'eliminarbots', 'kickbots'];
handler.group = true;
handler.botAdmin = true;

export default handler;
