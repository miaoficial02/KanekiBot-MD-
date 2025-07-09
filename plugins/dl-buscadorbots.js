// 🌐 𝗕𝘂𝘀𝗰𝗮𝗱𝗼𝗿 𝗱𝗲 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗕𝗼𝘁𝘀 𝗽𝗼𝗿 Bajo Bots

import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const thumbnailCard = 'https://qu.ax/VGCPX.jpg'; // Miniatura de la tarjeta
  const mainImage = 'https://qu.ax/RkiEC.jpg';     // Imagen principal del mensaje

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: '🧃 *Escribe una palabra clave para buscar repositorios.*\nEjemplo:\n' + usedPrefix + command + ' index WhatsApp Bot',
      footer: '🔎 GitHub Finder por Dorratz API',
      contextInfo: {
        externalAdReply: {
          title: 'Buscador de Repositorios',
          body: 'WhatsApp Bots y más desde GitHub',
          thumbnailUrl: thumbnailCard,
          sourceUrl: 'https://api.dorratz.com'
        }
      }
    }, { quoted: m });
  }

  try {
    let api = `https://api.dorratz.com/v3/github-code?q=${encodeURIComponent(text)}`;
    let response = await fetch(api);
    let data = await response.json();
    let repos = data.results?.payload?.results;

    if (!repos || repos.length === 0) {
      return m.reply('❌ No se encontraron resultados para: ' + text);
    }

    let result = repos[0];
    let repoName = result.repo?.repository?.name || 'Sin nombre';
    let owner = result.repo?.repository?.owner_login || 'Desconocido';
    let updated = result.repo?.repository?.updated_at?.slice(0, 10) || 'Sin fecha';
    let link = `https://github.com/${owner}/${repoName.replace(/blob-main-index\.js/g, '')}`;
    let followers = result.followers ?? 0;

    let caption = `
🧠 *Repositorio:* ${repoName}
👤 *Owner:* ${owner}
📅 *Última actualización:* ${updated}
👥 *Followers:* ${followers}
🔗 *GitHub:* ${link}
`.trim();

    conn.sendMessage(m.chat, {
      image: { url: mainImage },
      caption,
      footer: '🚀 Repositorio encontrado vía Dorratz API',
      contextInfo: {
        externalAdReply: {
          title: repoName,
          body: `${owner} • ${followers} followers`,
          thumbnailUrl: thumbnailCard,
          sourceUrl: link
        }
      }
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al obtener datos.\nDetalles: ${error.message}`);
    m.react('⚠️');
  }
};

handler.command = ['botcode', 'dorratzbot', 'whatsappbot'];
export default handler;
