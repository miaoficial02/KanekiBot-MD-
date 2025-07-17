import fetch from 'node-fetch';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  const apiKey = 'TU_API_KEY_AQUI'; // 🔑 Reemplaza con tu API Key real
  const ip = text?.trim();

  if (!ip || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    return m.reply(`❌ *IP inválida*\n\n📌 Uso correcto:\n${usedPrefix + command} 8.8.8.8`);
  }

  try {
    const res = await fetch(`https://api.ip2location.io/?key=${apiKey}&ip=${ip}`);
    const data = await res.json();

    // Validación estricta de la respuesta
    if (data && data.country_name && !data.error) {
      const respuesta = `
🌍 *INFORMACIÓN DE LA IP*

🧠 *IP:* ${data.ip}
🌎 *País:* ${data.country_name} (${data.country_code})
📍 *Región:* ${data.region_name}
🏙️ *Ciudad:* ${data.city_name}
🧭 *Latitud:* ${data.latitude}
🧭 *Longitud:* ${data.longitude}
🏣 *Código Postal:* ${data.zip_code}
🕐 *Zona Horaria:* ${data.time_zone}

📌 *Ubicación en Mapa:* 
https://www.google.com/maps?q=${data.latitude},${data.longitude}
      `.trim();

      await conn.reply(m.chat, respuesta, m);
    } else {
      throw new Error(data?.error?.error_message || 'Respuesta no válida');
    }
  } catch (e) {
    console.error(e);
    return m.reply(`❌ No se pudo obtener la ubicación.\n🔧 Verifica:\n• Que tu IP sea válida\n• Que tu API Key funcione\n• Que no haya límites de uso`);
  }
};

handler.help = ['ipinfo <ip>'];
handler.tags = ['tools'];
handler.command = /^ipinfo|localizar|iplocation$/i;

export default handler;
