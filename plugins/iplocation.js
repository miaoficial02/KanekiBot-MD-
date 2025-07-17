let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  const apiKey = 'TU_API_KEY_AQUI'; // 🔧 Reemplaza con tu API Key real
  const ip = text?.trim();

  if (!ip)
    return m.reply(`🌍 *Uso del comando:*\n${usedPrefix + command} 8.8.8.8`);

  try {
    let url = `https://api.ip2location.io/?key=${apiKey}&ip=${ip}`;
    let res = await fetch(url);
    let json = await res.json();

    if (json.country_name) {
      let info = `
📡 *INFORMACIÓN DE LA IP*
  
🧠 *IP:* ${json.ip}
🌎 *País:* ${json.country_name} (${json.country_code})
🏙️ *Ciudad:* ${json.city_name}
🌐 *Región:* ${json.region_name}
📍 *Latitud:* ${json.latitude}
📍 *Longitud:* ${json.longitude}
🏣 *Código postal:* ${json.zip_code}
🕒 *Zona Horaria:* ${json.time_zone}

🔗 https://www.google.com/maps?q=${json.latitude},${json.longitude}
      `.trim();

      conn.reply(m.chat, info, m);
    } else {
      m.reply('❌ No se pudo obtener la ubicación. Verifica tu IP y API Key.');
    }
  } catch (err) {
    console.error(err);
    m.reply('❌ Error al consultar la API. Asegúrate de que tu IP sea válida y la API Key funcione.');
  }
};

handler.help = ['ipinfo <ip>'];
handler.tags = ['tools'];
handler.command = /^ipinfo|localizar|iplocation$/i;

export default handler;
