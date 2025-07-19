let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) {
    return m.reply(`🚫 *Este comando es solo para el owner del bot.*`);
  }

  if (!args[0]) {
    return m.reply(`🌎 *Uso del comando:*\n\n.ip 8.8.8.8`);
  }

  const ip = args[0];
  const fetch = (await import('node-fetch')).default;

  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    const json = await res.json();

    if (!json.success) {
      return m.reply(`❌ No se pudo obtener la ubicación.\n\n🔧 Verifica que la IP sea válida.`);
    }

    const info = `
🌐 *Información de IP*

🧠 IP: ${json.ip}
🏙️ Ciudad: ${json.city}
🌍 Región: ${json.region}
🇺🇸 País: ${json.country} (${json.country_code})
🛰️ ISP: ${json.connection?.isp || 'Desconocido'}
📡 Latitud: ${json.latitude}
📡 Longitud: ${json.longitude}
🧭 Zona Horaria: ${json.timezone?.id || 'Desconocida'}

📌 Dirección aproximada: https://www.google.com/maps?q=${json.latitude},${json.longitude}
    `.trim();

    await m.reply(info);
  } catch (e) {
    console.error(e);
    m.reply('❌ Hubo un error al consultar la IP. Intenta más tarde.');
  }
};

handler.command = /^ip|geoip|ipinfo$/i;
handler.help = ['ip <ip>'];
handler.tags = [''];

export default handler;
