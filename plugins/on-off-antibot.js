// comando antibot.js - activa o desactiva el sistema antibot

import fs from 'fs';

const pathEstado = './bajoBots_estado.json';
let estadoAntiBot = fs.existsSync(pathEstado) ? JSON.parse(fs.readFileSync(pathEstado)) : {};

let handler = async (m, { conn, args }) => {
    if (!m.isGroup) return conn.reply(m.chat, '❗ Este comando solo funciona en grupos.', m);
    if (!args[0] || !['on', 'off'].includes(args[0])) {
        return conn.reply(m.chat, `*Usa:*\n#antibot on → activa\n#antibot off → desactiva`, m);
    }

    const groupId = m.chat;
    if (args[0] === 'on') {
        estadoAntiBot[groupId] = true;
        conn.reply(m.chat, '✅ *AntiBot activado en este grupo.*', m);
    } else {
        delete estadoAntiBot[groupId];
        conn.reply(m.chat, '❌ *AntiBot desactivado en este grupo.*', m);
    }

    fs.writeFileSync(pathEstado, JSON.stringify(estadoAntiBot, null, 2));
};

handler.help = ['antibot on', 'antibot off'];
handler.tags = ['group', 'admin'];
handler.command = /^antibot$/i;
handler.group = true;
handler.admin = true;

export default handler;
