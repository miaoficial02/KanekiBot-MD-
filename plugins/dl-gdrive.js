import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, setting }) => {
    try {
        if (!text) {
            return conn.reply(m.chat, `🌿 *Uso correcto:*\n\n✨ .gdrive <enlace>\n📌 *Ejemplo:* .gdrive https://drive.google.com/file/d/1234567890/view`, m);
        }

        m.react("🔄");

        const result = await gdriveScraper(text);
        if (!result.status) return conn.reply(m.chat, `❌ *Error al procesar el enlace de Google Drive.*`, m);

        let caption = `
┏━━━━━━━━━━━━━━━━━━⬣
┃   🌟 *G D R I V E - D O W N L O A D* 🌟
┗━━━━━━━━━━━━━━━━━━⬣

📁 *Nombre:* ${result.data.fileName}
📐 *Tamaño:* ${result.data.fileSize}
📄 *Tipo:* ${result.data.mimetype}
🔗 *Enlace:* ${text}

✅ *Tu archivo está listo para descargar.*
`.trim();

        await conn.reply(m.chat, caption, m);
        await conn.sendFile(m.chat, result.data.downloadUrl, result.data.fileName, '', m, { document: true });

        m.react("✅");
    } catch (e) {
        return conn.reply(m.chat, `🚫 *Error:* ${e.message}`, m);
    }
};

handler.help = ["gdrive"];
handler.command = ["gdrive", "drive"];
handler.tags = ["download"];
export default handler;

async function gdriveScraper(url) {
    try {
        let id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1];
        if (!id) throw new Error('❗ No se pudo extraer el ID del enlace.');

        let res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
            method: 'post',
            headers: {
                'accept-encoding': 'gzip, deflate, br',
                'content-length': 0,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                origin: 'https://drive.google.com',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=',
                'x-drive-first-party': 'DriveWebUi',
                'x-json-requested': 'true',
            },
        });

        let { fileName, sizeBytes, downloadUrl } = JSON.parse((await res.text()).slice(4));
        if (!downloadUrl) throw new Error('⛔ El enlace ha alcanzado su límite de descargas.');

        let data = await fetch(downloadUrl);
        if (data.status !== 200) throw new Error(data.statusText);

        return {
            status: true,
            data: {
                downloadUrl,
                fileName,
                fileSize: `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`,
                mimetype: data.headers.get('content-type')
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}
