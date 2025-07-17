let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`📌 *Uso correcto:* .ipgrabber https://google.com`);

  let fakeLink = encodeURIComponent(text);
  let grabify = `https://iplogger.org/logger/${Math.random().toString(36).substring(7)}?target=${fakeLink}`;

  let message = `
╭━━━〔 🌐 IP Logger Link 〕━━⬣
┃📍 *Tu enlace trampa está listo:*
┃🔗 ${grabify}
┃
┃👀 *Envía este link a la víctima.*
┃🧠 Si lo abre, podrás ver su IP, país, navegador, etc.
┃📤 Visita: https://iplogger.org para ver los resultados.
╰━━━━━━━━━━━━━━━━━━━━⬣`;

  conn.reply(m.chat, message, m);
};

handler.command = /^ipgrabber$/i;
export default handler;
