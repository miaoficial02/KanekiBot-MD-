import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`🔍 *Añade un término para buscar en Pinterest*\nEjemplo: .pinterest Anime`, m);

  try {
    m.react('🕒');

    const res = await fetch(`https://api.akuari.my.id/pinterest?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    const list = json.result;
    if (!list || list.length === 0) {
      return conn.reply(m.chat, `❌ *No se encontraron resultados para:* "${text}"`, m);
    }

    const max = Math.min(5, list.length);
    const caption = `
╭─〔 𝐏𝐈𝐍𝐓𝐄𝐑𝐄𝐒𝐓 • 𝐊𝐀𝐍𝐄𝐊𝐈𝐁𝐎𝐓 〕
│🔎 Término: "${text}"
│🖼️ Resultados: ${max}
╰──────────────⬣`.trim();

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m });

    for (let i = 0; i < max; i++) {
      await conn.sendMessage(m.chat, {
        image: { url: list[i] },
        caption: `🎴 Resultado ${i + 1} para: ${text}`
      }, { quoted: m });
    }

    m.react('✅');

  } catch (e) {
    console.error('❌ Error en Pinterest:', e);
    conn.reply(m.chat, '❌ *Ocurrió un error al buscar en Pinterest.*', m);
  }
};

handler.help = ['pinterest <texto>'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['descargas'];
export default handler;
