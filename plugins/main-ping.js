import speed from 'performance-now';
import { exec } from 'child_process';

let handler = async (m, { conn }) => {
  let timestamp = speed();
  
  // Mensaje inicial con miniatura
  await conn.sendMessage(m.chat, {
    text: '🏓 *Calculando velocidad del sistema...*',
    contextInfo: {
      externalAdReply: {
        title: 'Sistema KanekiBot-MD',
        body: '📡 Verificando conexión y estado del sistema...',
        thumbnailUrl: 'https://qu.ax/VGCPX.jpg', // <-- AQUÍ CAMBIAS TU MINIATURA
       // sourceUrl: 'https://github.com/ElChema-Nc/KanekiBot-MD', // Opcional
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });

  let latency = speed() - timestamp;

  exec('neofetch --stdout', (error, stdout, stderr) => {
    let info = stdout.toString('utf-8').replace(/Memory:/, 'Ram:');
    let result = `╭─⏱️ 𝑷𝒊𝒏𝒈 - 𝑺𝒊𝒔𝒕𝒆𝒎𝒂\n│\n│  🔋 *Velocidad:* ${latency.toFixed(1)} ms\n│\n╰─💻 *Info:* \n${info}`;
    conn.sendMessage(m.chat, { text: result }, { quoted: m });
  });
};

handler.help = ['ping'];
handler.tags = ['main'];
handler.command = ['ping', 'p', 'speed'];

export default handler;
