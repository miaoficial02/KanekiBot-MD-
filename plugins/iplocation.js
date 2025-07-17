let handler = async (m, { conn, args, usedPrefix, command }) => {
  const apiKey = 'TU_API_KEY_AQUI'; // 👈 Reemplaza con tu clave

  if (!args[0]) {
    return m.reply(`🌍 *Uso correcto:*\n${usedPrefix + command} 177.239.38.73`);
  }

  const ip = args[0];
  const apiUrl = `https://api.ip2location.io/?key=${apiKey}&ip=${ip}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Error de conexión con la API`);

    const data = await res.json();

    if (data.error) {
      return m.reply(`🚫 *Error:* ${data.error.message}`);
    }

    const locationURL = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
    const texto = `
╭━━〔🌐 *Localizador de IP* 〕━━⬣
┃📍 *IP:* ${ip}
┃🌎 *País:* ${data.country_name} (${data.country_code})
┃🏙️ *Región:* ${data.region_name}
┃🌆 *Ciudad:* ${data.city_name}
┃📮 *Código postal:* ${data.zip_code}
┃🌐 *Dominio:* ${data.domain}
┃📶 *ISP:* ${data.isp}
┃🛰️ *Tipo conexión:* ${data.connection_type}
┃🕐 *Zona horaria:* ${data.time_zone}
┃🛡️ *Proxy:* ${data.is_proxy ? 'Sí' : 'No'}
┃🧭 *Coordenadas:* ${data.latitude}, ${data.longitude}
╰━━━━━━━━━━━━━━━━━━━━⬣
🔗 *Mapa:* ${locationURL}
`.trim();

    // Enviar ubicación como live location
    await conn.sendMessage(m.chat, {
      location: {
        degreesLatitude: parseFloat(data.latitude),
        degreesLongitude: parseFloat(data.longitude),
        name: `${data.city_name}, ${data.region_name}`,
        address: `${data.country_name} (${data.country_code})`,
      },
      caption: texto
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ No se pudo obtener la ubicación. Verifica tu IP y API Key.');
  }
};

handler.command = /^ip(loc|location)$/i;
handler.help = ['iplocation <ip>'];
handler.tags = [''];
handler.register = false;

export default handler;
