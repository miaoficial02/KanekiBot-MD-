//codigo creado y desarrollado por @Bajo Bots 
// Al eliminar creditos puede que el comando tenga error
//https://github.com/kleiner1-1
//©BajoBots

var handler = async (m, { conn, participants, isAdmin, isBotAdmin }) => {
    const emoji = '😈';
    const emoji2 = '⚠️';
    const emojiSuccess = '✅';
    const isOwner = global.owner.map(o => typeof o === 'string' ? o : o[0]).includes(m.sender);

    if (!isAdmin && !isOwner) {
        return conn.reply(m.chat, `${emoji2} *Solo los administradores pueden usar este comando.*`, m);
    }

    if (!isBotAdmin) {
        return conn.reply(m.chat, `${emoji2} *Necesito permisos de administrador para eliminar miembros.*`, m);
    }

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const globalOwners = global.owner.map(o => typeof o === 'string' ? o : o[0] + '@s.whatsapp.net');

    let toKick = participants
        .map(p => p.id)
        .filter(id =>
            id !== m.sender &&
            id !== conn.user.jid &&
            id !== ownerGroup &&
            !globalOwners.includes(id)
        );

    if (toKick.length === 0) {
        return conn.reply(m.chat, `${emoji2} *No hay miembros válidos para eliminar.*`, m);
    }

    try {
        // Enviar mensaje previo que se auto eliminará después de 10s
        const warningMsg = await conn.sendMessage(m.chat, {
            text: `*Gracias por estar en el grupo, serán domados por los 666.* 🔥\n\n*Creaciones by Bajo Bots*`,
        }, { quoted: m });

        // Esperar 10 segundos y luego eliminar el mensaje
        await new Promise(res => setTimeout(res, 10000));
        await conn.sendMessage(m.chat, {
            delete: warningMsg.key
        });

        // Eliminar a los miembros
        await conn.groupParticipantsUpdate(m.chat, toKick, 'remove');

        await conn.reply(m.chat, `${emojiSuccess} *Todos fueron eliminados del grupo.*\n\n🔥 *Fuiste domado por Bajo Perfil y los 666* 😈🔥\n\n> *By BajoPerfil*`, m);
        
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `${emoji2} *Error al intentar eliminar a los miembros.*`, m);
    }
};

handler.help = ['kickall'];
handler.tags = ['group'];
handler.command = ['kickall', 'eliminaratodos', 'sacaratodos'];
handler.group = true;
handler.botAdmin = true;
handler.register = false;

export default handler;
