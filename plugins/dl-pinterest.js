import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`🔍 *Ingresa una búsqueda para Pinterest*\n\n🌸 Ejemplo: .pinterest Anime`);
  }

  try {
    m.react('🕐');

    const res = await fetch(`https://api.akuari.my.id/pinterest?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.result || json.result.length === 0) {
      return conn.reply(m.chat, `❌ *No se encontraron imágenes para:* "${text}"`, m);
    }

    let results = json.result;

    // Mensaje principal
    const caption = `
╭─〔 𝐏𝐈𝐍𝐓𝐄𝐑𝐄𝐒𝐓 - 𝐊𝐀𝐍𝐄𝐊𝐈𝐁𝐎𝐓 〕
│🔎 *Búsqueda:* "${text}"
│🖼️ *Resultados:* ${results.length}
│✨ *Mostrando 5 imágenes...*
╰──────────────⬣`.trim();

    await conn.sendMessage(m.chat, {
      text: caption,
    }, { quoted: m });

    // Enviar hasta 5 imágenes
    for (let i = 0; i < Math.min(5, results.length); i++) {
      await conn.sendMessage(m.chat, {
        image: { url: results[i] },
        caption: `🎴 *Resultado ${i + 1} para:* ${text}`
      }, { quoted: m });
    }

    m.react("✅");

  } catch (err) {
    console.error("❌ Error en Pinterest:", err);
    conn.reply(m.chat, "❌ *Ocurrió un error al buscar imágenes.*", m);
  }
};

handler.help = ['pinterest <texto>'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['descargas'];
export default handler;
