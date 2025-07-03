import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        if (!args || !args[0]) {
            return conn.reply(m.chat, `📸 *Ejemplo de uso:*\n${usedPrefix}${command} https://www.instagram.com/p/CK0tLXyAzEI`, m);
        }

        if (!args[0].match(/(https:\/\/www.instagram.com)/gi)) {
            return conn.reply(m.chat, `🚫 *Enlace inválido.*\nAsegúrate de enviar un enlace correcto de Instagram.`, m);
        }

        let startTime = new Date();
        m.react('🕒');

        const res = await fetch(`https://api.neoxr.eu/api/ig?url=${args[0]}&apikey=GataDios`);
        const json = await res.json();

        if (!json.status || !json.data || !json.data[0]) {
            return conn.reply(m.chat, `❎ *No se pudo obtener el contenido.*\n${JSON.stringify(json, null, 2)}`, m);
        }

        const media = json.data[0];
        const elapsed = new Date() - startTime;

        const caption = `
╭━━〔 📷 *Instagram Downloader* 〕━━⬣
┃🌐 *Link:* ${args[0]}
┃🎞️ *Tipo:* ${media.type || 'Desconocido'}
┃📦 *Tamaño:* Automático
┃⏱️ *Tiempo:* ${elapsed} ms
╰━━━━━━━━━━━━━━━━━━━━⬣
        `.trim();

        await conn.sendFile(m.chat, media.url, `Instagram.${media.type == 'image' ? 'jpg' : 'mp4'}`, caption, m);
        await delay(1500);

    } catch (e) {
        return conn.reply(m.chat, `❌ *Error inesperado:*\n${e.message}`, m);
    }
};

handler.help = ['instagram'];
handler.command = ['ig', 'instagram'];
handler.tags = ['download'];
export default handler;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
