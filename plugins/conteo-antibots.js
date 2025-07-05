// Comando para mostrar cuántos bots ha eliminado el bot por grupo
const fs = require('fs');
const path = './bajoBots_anticontador.json';

let handler = async (m, { conn }) => {
    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    const count = data[m.chat] || 0;

    const msg = `
🤖 *Historial de bots eliminados en este grupo:*
═════════════════════
📌 Total: *${count}* bots eliminados
🚫 Modo AntiBot: *Activo*
By *Bajo Bots*
    `.trim();

    conn.reply(m.chat, msg, m);
};

handler.help = ['botsdomados'];
handler.tags = ['group'];
handler.command = ['botsdomados', 'botsdetectados'];
handler.group = true;

export default handler;
