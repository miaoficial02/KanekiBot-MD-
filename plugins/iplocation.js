import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const apiKey = 'TU_API_KEY_AQUI'; // ⛔ Reemplaza con tu API KEY válida
  const ip = text?.trim();

  if (!ip || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    return m.reply(`❌ IP inválida.

📌 Uso correcto:
${usedPrefix + command} 8.8.8.8`);
  }

  try {
    const res = await fetch(`https://api.ip2location.io/?key=${apiKey}&ip=${ip}`);
    if (!res.ok) throw new Error(`❌ Error HTTP ${res.status}`);
    
    const data = await res.json();
    if (data.error || !data.country_name) {
      throw new Error(data.error?.error_message || 'No se pudo obtener información');
    }

    const msg = `
╭━━〔 🌐 *IP INFO* 〕━━⬣
┃🔍 *IP:* ${data.ip}
┃🌎 *País:* ${data.country_name} (${data.country_code})
┃🏙️ *Ciudad:* ${data.city_name}
┃📍 *Región:* ${data.region_name}
┃🏣 *Código Postal:* ${data.zip_code}
┃🕐 *Zona Horaria:* ${data.time_zone}
┃🧭 *Latitud:* ${data.latitude}
┃🧭 *Longitud:* ${data.longitude}
┃🛰️ *ISP:* ${data.isp || 'No disponible'}
┃🌐 *Dominio:* ${data.domain || 'No disponible'}
┃🗺️ *Mapa:* https://maps.google.com/?q=${data.latitude},${data.longitude}
╰━━━━━━━━━━━━━━━━━━⬣`.trim();

    await conn.reply(m.chat, msg, m);
  } catch (err) {
    console.error('[IP Lookup Error]', err);
    return m.reply(`❌ No se pudo obtener la ubicación.\n\n🔧 Verifica tu IP o API Key.`);
  }
};

handler.help = ['ipinfo <ip>'];
handler.tags = ['tools'];
handler.command = /^ipinfo|iplocation|localizar$/i;

export default handler;
