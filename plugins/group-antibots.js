// ©BajoBots - Sistema AntiBot activable por grupo, con diseño y estadísticas

const fs = require('fs');
const pathContador = './bajoBots_anticontador.json';
const pathEstado = './bajoBots_estado.json';

// Cargar bases de datos
let botEliminados = fs.existsSync(pathContador) ? JSON.parse(fs.readFileSync(pathContador)) : {};
let estadoAntiBot = fs.existsSync(pathEstado) ? JSON.parse(fs.readFileSync(pathEstado)) : {};

let handler = async (m, { conn, args, command }) => {
    // Comando para activar/desactivar
    if (!m.isGroup) return conn.reply(m.chat, '❗ Este comando solo funciona en grupos.', m);
    if (!args[0] || !['on', 'off'].includes(args[0])) {
        return conn.reply(m.chat, `Usa:\n*#antibot on* para activar\n*#antibot off* para desactivar`, m);
    }

    const groupId = m.chat;
    if (args[0] === 'on') {
        estadoAntiBot[groupId] = true;
        conn.reply(m.chat, '✅ *Sistema AntiBot activado.*\nBots no autorizados serán domados automáticamente.', m);
    } else {
        delete estadoAntiBot[groupId];
        conn.reply(m.chat, '❌ *Sistema AntiBot desactivado.*', m);
    }

    fs.writeFileSync(pathEstado, JSON.stringify(estadoAntiBot, null, 2));
};

// Configuración del comando
handler.help = ['antibot on', 'antibot off'];
handler.tags = ['group', 'admin'];
handler.command = /^antibot$/i;
handler.group = true;
handler.admin = true;

// 📡 Detección automática de bots en grupos
handler.before = async function (m, { conn }) {
    if (!m.isGroup) return;
    const groupId = m.id;

    if (estadoAntiBot[groupId] !== true) return; // Solo si está activado

    const update = m.participantsUpdate;
    if (!update || update.action !== 'add') return;

    const participants = update.participants;
    const mainBot = conn.user.jid;

    for (let user of participants) {
        const isPossiblyBot = /bot/i.test(user) || user.startsWith('52') || user.startsWith('1');
        const isNotMainBot = user !== mainBot;

        if (isPossiblyBot && isNotMainBot) {
            try {
                // 🔴 Forzar expulsión
                await conn.groupParticipantsUpdate(groupId, [user], 'remove');

                // ✨ Mensaje estilizado
                const texto = `
┏━━━━━━━━━━━━━┓
┃ *🛑 BOT DETECTADO* 
┗━━━━━━━━━━━━━┛
╭───────────────
│ 😈 Fuiste *eliminado*
│ 🔥 Por *Bajo Bots con diseño*
│ 🧠 Antibot activo
╰───────────────`.trim();

                await conn.sendMessage(groupId, {
                    text: texto,
                    mentions: [user]
                });

                // 💠 Enviar sticker o imagen
                if (fs.existsSync('./media/sticker_domado.webp')) {
                    await conn.sendMessage(groupId, {
                        sticker: fs.readFileSync('./media/sticker_domado.webp')
                    });
                } else if (fs.existsSync('./media/domado.jpg')) {
                    await conn.sendFile(groupId, './media/domado.jpg', 'domado.jpg', '🔥 Eliminado por Bajo Bots', m);
                }

                // 🧮 Guardar conteo
                if (!botEliminados[groupId]) botEliminados[groupId] = 0;
                botEliminados[groupId]++;
                fs.writeFileSync(pathContador, JSON.stringify(botEliminados, null, 2));

            } catch (e) {
                console.error(`❌ Error al eliminar bot no autorizado (${user})`, e);
            }
        }
    }
};

export default handler;
