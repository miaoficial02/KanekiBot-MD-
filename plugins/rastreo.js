let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text || !/^(\+?\d{7,15})$/.test(text)) {
    return m.reply(`❗ *Uso correcto:* ${usedPrefix + command} +573123456789`);
  }

  const apiKey = 'TU_API_KEY_AQUI'; // <- reemplaza con tu API Key válida
  const number = text.replace(/\+/g, '');
  const url = `http://apilayer.net/api/validate?access_key=${apiKey}&number=${number}`;

  try {
    let res = await fetch(url);
    let data = await res.json();

    if (!data.valid) {
      return m.reply(`❌ Número inválido o no localizado.\n\nVerifica si está bien escrito.`);
    }

    let resultado = `
╭━━━〔 ✅ RASTREO REAL 〕━━⬣
┃📱 *Número:* ${data.international_format || text}
┃🌍 *País:* ${data.country_name} (${data.country_code})
┃🌐 *Localización:* ${data.location || 'Desconocida'}
┃📡 *Operador:* ${data.carrier || 'No disponible'}
┃📶 *Tipo de línea:* ${data.line_type || 'Desconocido'}
┃🕓 *Consulta:* ${new Date().toLocaleString()}
╰━━━━━━━━━━━━━━━━━━━━⬣
`;

    conn.reply(m.chat, resultado, m);
  } catch (e) {
    console.error(e);
    m.reply(`❌ No se pudo obtener la información.\n\n🔧 Verifica tu API Key o conexión.`);
  }
};

handler.command = /^rastreoapi$/i;
export default handler;
