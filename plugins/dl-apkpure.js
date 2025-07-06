//by Bajo Bots 

let handler = async (m, { conn, text, args }) => { 
   try {
      if (!text) {
         return conn.reply(m.chat, `✨ *Uso Correcto:*

Ejemplo: *.apkpure WhatsApp*`, m);
      }
      m.react('🕒');

      if (text.includes('https://apkpure.net/')) {
         try {
            let base = args[0].split("/")[4];
            const file = `https://d.apkpure.com/b/APK/${base}?version=latest`;
            let info = await getInfo(file);
            let { name, sizeB, sizeMB } = info;

            if (sizeB > 200 * 1024 * 1024) {
               return conn.reply(m.chat, `⚠️ *Archivo muy pesado para usuarios normales.*\n\n💾 Peso de la APK: ${sizeMB}\n\n💎 Hazte premium para descargar hasta 500MB.`, m);
            }
            if (sizeB > 500 * 1024 * 1024) {
               return conn.reply(m.chat, '❌ *Este archivo supera el límite de descarga (500MB). Solo usuarios premium pueden descargarlo.*', m);
            }

            let cap = `
┏━━⬣ *APKPURE DESCARGA*
┃ 🔹 *Nombre:* ${name}
┃ 📦 *Package:* ${base}
┃ 💾 *Peso:* ${sizeMB}
┃ 🌐 *Link:* ${args[0]}
┗━━━━━━━━━━━━⬣`;

            m.reply(cap);
            await conn.sendFile(m.chat, file, `${name}`, '', m, null, {
               asDocument: true,
               mimetype: "application/vnd.android.package-archive"
            });
            m.react('✅');
         } catch (err) {
            return conn.reply(m.chat, '❌ *Error al obtener la información de la app.*\n\n' + err, m);
         }
      } else {
         m.react("⌚")
         let res = await search(text);
         let cap = `
┏━━⬣ *APKPURE RESULTADOS*
┃ 🔍 *Búsqueda:* ${text}
┗━━━━━━━━━━━━⬣\n\n`;

         cap += res.map(v => `┣ 💠 *Nombre:* ${v.name}\n┣ ⭐ *Rating:* ${v.rating}\n┣ 👤 *Dev:* ${v.developer}\n┗ 🔗 *Link:* ${v.link}`).join("\n\n");
         m.reply(cap);
         m.react("✅");
      }
   } catch (err) {
      return conn.reply(m.chat, '❌ *Ocurrió un error en la ejecución.*\n\n' + err, m);
   }
};

handler.help = ["apkpure"];
handler.command = ["apkpure", "apkpuredl"];
handler.tags = ["download"];
export default handler;

async function search(text) {
    let base = `https://apkpure.net/search?q=${encodeURIComponent(text)}`;

    try {
        let res = await fetch(base, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        let html = await res.text();
        let $ = cheerio.load(html);
        let results = [];

        $('.apk-list .apk-item').each((_, el) => {
            let app = {};
            app.name = $(el).find('.title').text().trim();
            app.link = "https://apkpure.net" + $(el).attr('href');
            app.icon = $(el).find('.icon img').attr('data-original') || $(el).find('.icon img').attr('src');
            app.developer = $(el).find('.dev').text().trim();
            app.rating = $(el).find('.stars').text().trim();
            app.download = app.link.replace('/com.', '/download/com.');

            if (app.name) results.push(app);
        });

        return results;
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function getInfo(url) {
    try {
        const res = await fetch(url);
        const cd = res.headers.get('content-disposition');
        const name = cd && cd.match(/filename="(.+)"/)[1];
        const sizeB = parseInt(res.headers.get('content-length'), 10);
        const sizeMB = (sizeB / (1024 * 1024)).toFixed(2) + ' MB';
        return { name, sizeB, sizeMB };
    } catch (err) {
        return { error: err.message };
    }
}
