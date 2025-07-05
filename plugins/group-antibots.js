// sistema antibot automático - debe estar en un archivo con handler.before

import fs from 'fs';

const pathContador = './bajoBots_anticontador.json';
const pathEstado = './bajoBots_estado.json';

let botEliminados = fs.existsSync(pathContador) ? JSON.parse(fs.readFileSync(pathContador)) : {};
let estadoAntiBot = fs.existsSync(pathEstado) ? JSON.parse(fs.readFileSync(pathEstado)) : {};

let handler = async (m, { conn }) => {};
handler.before = async function (m, { conn }) {
    if (!m.isGroup) return;

    const groupId = m.id;
    if (estadoAntiBot[groupId] !== true) return;

    const update = m.participantsUpdate;
    if (!update || update.action !== 'add') return;

    const participants = update.participants;
    const mainBot = conn.user.jid;

    for (let user of participants) {
        const isPossiblyBot = /bot/i.test(user) || user.startsWith('52') || user.startsWith('1');
        const isNotMainBot = user !== mainBot;

        if (isPossiblyBot && isNotMainBot) {
            try {
                await conn.groupParticipantsUpdate(groupId, [user], 'remove');

                const texto = `
┏━━━━━━━━━━━━━┓
┃ *🛑 BOT DETECTADO* 
┗━━━━━━━━━━━━━┛
╭───────────────
│ 😈 Fuiste *eliminado*
│ 🔥 Por *Bajo Bots con diseño*
│ 🧠 Antibot activo
╰───────────────`.trim();

                await conn.sendMessage(groupId, { text: texto, mentions: [user] });

                if (fs.existsSync('./media/sticker_domado.webp')) {
                    await conn.sendMessage(groupId, {
                        sticker: fs.readFileSync('./media/sticker_domado.webp')
                    });
                } else if (fs.existsSync('./media/domado.jpg')) {
                    await conn.sendFile(groupId, './media/domado.jpg', 'domado.jpg', '🔥 Eliminado por Bajo Bots', m);
                }

                if (!botEliminados[groupId]) botEliminados[groupId] = 0;
                botEliminados[groupId]++;
                fs.writeFileSync(pathContador, JSON.stringify(botEliminados, null, 2));

            } catch (e) {
                console.error(`❌ Error al eliminar bot no autorizado: ${user}`, e);
            }
        }
    }
};

export default handler;
