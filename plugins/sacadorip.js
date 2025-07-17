let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`📌 *Uso correcto:* .ipgrabber https://google.com`);

  let fakeLink = encodeURIComponent(text);
  let uniqueId = Math.random().toString(36).substring(7);
  let grabify = `https://iplogger.org/${uniqueId}?target=${fakeLink}`;

  let message = `
╭━━━〔 🌐 IP Logger Link 〕━━⬣
┃📍 *Tu enlace trampa está listo:*
┃🔗 ${grabify}
┃
┃👀 *Envía este link a la víctima.*
┃🧠 Al abrirlo, podrás ver:
┃   IP, país, navegador, ubicación y más.
┃📤 Ingresa a: https://iplogger.org/logger/${uniqueId}
┃   para ver los resultados.
╰━━━━━━━━━━━━━━━━━━━━⬣`;

  conn.reply(m.chat, message, m);
};

handler.command = /^igrabber$/i;
export default handler;
