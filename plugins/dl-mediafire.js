let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        if (!args || !args[0]) {
            return conn.reply(m.chat, `📦 *Uso correcto:*\n${usedPrefix}${command} https://www.mediafire.com/file/archivo.zip`, m);
        }

        if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) {
            return conn.reply(m.chat, `🚫 *Enlace inválido.*\nAsegúrate de usar un enlace válido de MediaFire.`, m);
        }

        m.react('📥');
        const res = await fetch(`https://api.sylphy.xyz/download/mediafire?url=${args[0]}&apikey=sylph-96ccb836bc`);
        const json = await res.json();

        if (!json.data || !json.data.download) {
            return conn.reply(m.chat, "❎ *No se pudo obtener la información del archivo.*", m);
        }

        const { filename, size, mimetype, download } = json.data;

        const info = `
╭━━━〔 🌐 *MediaFire Downloader* 〕━━⬣
┃📄 *Nombre:* ${filename}
┃📦 *Peso:* ${size}
┃🧾 *Tipo:* ${mimetype}
┃🔗 *Enlace:* 
┃${args[0]}
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim();

        await conn.reply(m.chat, info, m);
        await conn.sendFile(m.chat, download, filename, `✅ *Archivo descargado correctamente.*`, m);

    } catch (e) {
        return conn.reply(m.chat, `❌ *Error inesperado:*\n${e.message}`, m);
    }
};

handler.command = handler.help = ['mediafire'];
handler.tags = ['download'];
export default handler;
