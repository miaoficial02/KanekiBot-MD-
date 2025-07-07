const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('🍷 *Ingresa el título o enlace del video.*');

  conn.xnxx = conn.xnxx || {};
  const isUrl = text.includes('xnxx.com');
  if (isUrl) {
    await m.react("🎥");
    try {
      const res = await xnxxdl(text);
      const { dur, qual, views } = res.result.info;
      const txt = `
╭─────〔 𝑿𝑵𝑿𝑿 - 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫 〕─────⬣
┃🎬 *Título:* ${res.result.title}
┃⏱️ *Duración:* ${dur || 'Desconocida'}
┃📺 *Calidad:* ${qual || 'Desconocida'}
┃👁️ *Vistas:* ${views || 'Desconocidas'}
╰────────────────────────────⬣`.trim();

      const dll = res.result.files.high || res.result.files.low;
      await conn.sendFile(m.chat, dll, `${res.result.title}.mp4`, txt, m);
      await m.react("✅");
    } catch (e) {
      return conn.reply(m.chat, `❌ *Error al descargar el video:*\n${e}`, m);
    }
    return;
  }

  await m.react("🧠");
  const res = await search(encodeURIComponent(text));
  if (!res.result?.length) return m.reply('❌ *No se encontraron resultados.*');

  const list = res.result.slice(0, 10).map((v, i) =>
    `╭─── ⌜ *Resultado #${i + 1}* ⌟ ───⬣
┃🎬 *Título:* ${v.title}
┃🌐 *Link:* ${v.link}
╰──────────────⬣`).join("\n\n");

  const caption = `
╭─────〔 𝑿𝑵𝑿𝑿 - 𝑺𝑬𝑨𝑹𝑪𝑯 〕─────⬣
┃🔍 *Consulta:* ${text}
┃📄 *Resultados:* ${res.result.length}
╰────────────────────────────⬣

${list}

📝 *Responde con el número del video que deseas descargar.*
📎 *O envía directamente el enlace del video.*`;

  const { key } = await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
  conn.xnxx[m.sender] = {
    result: res.result,
    key,
    downloads: 0,
    timeout: setTimeout(() => delete conn.xnxx[m.sender], 120_000),
  };
};

handler.before = async (m, { conn }) => {
  conn.xnxx = conn.xnxx || {};
  const session = conn.xnxx[m.sender];
  if (!session || !m.quoted || m.quoted.id !== session.key.id) return;

  const n = parseInt(m.text.trim());
  if (isNaN(n) || n < 1 || n > session.result.length) return;

  try {
    await m.react("🎥");
    const link = session.result[n - 1].link;
    const res = await xnxxdl(link);
    const { dur, qual, views } = res.result.info;
    const txt = `
╭─────〔 𝑿𝑵𝑿𝑿 - 𝑫𝑶𝑾𝑵𝑳𝑶𝑨𝑫 〕─────⬣
┃🎬 *Título:* ${res.result.title}
┃⏱️ *Duración:* ${dur || 'Desconocida'}
┃📺 *Calidad:* ${qual || 'Desconocida'}
┃👁️ *Vistas:* ${views || 'Desconocidas'}
╰────────────────────────────⬣`.trim();

    const dll = res.result.files.high || res.result.files.low;
    await conn.sendFile(m.chat, dll, `${res.result.title}.mp4`, txt, m);
    await m.react("✅");
  } catch (e) {
    await conn.reply(m.chat, `❌ *Error al descargar el video:*\n${e}`, m);
  } finally {
    session.downloads++;
    if (session.downloads >= 5) {
      clearTimeout(session.timeout);
      delete conn.xnxx[m.sender];
    }
  }
};

handler.command = ['xnxx', 'xnxxsearch', 'xnxxdl'];
handler.tags = ['download'];
handler.help = ['xnxx'];
export default handler;
