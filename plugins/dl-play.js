// play.js
const ytdl = require('ytdl-core');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const axios = require('axios');

const API_KEY = 'https://api.sylphy.xyz/search/youtube'; // ← Reemplaza con tu clave

console.clear();
console.log(chalk.red.bold('\n🎧 KanekiBot-MD — Descargador por Nombre 🎶\n'));
console.log(chalk.gray('=============================================='));

inquirer.prompt([
  {
    type: 'input',
    name: 'query',
    message: chalk.cyan('🔍 Escribe el nombre de la canción:')
  },
  {
    type: 'input',
    name: 'filename',
    message: chalk.magenta('💾 Nombre del archivo MP3:')
  }
]).then(async ({ query, filename }) => {
  try {
    const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=1&type=video`;
    const res = await axios.get(searchURL);
    const videoId = res.data.items[0].id.videoId;
    const videoTitle = res.data.items[0].snippet.title;

    console.log(chalk.green(`\n🎬 Encontrado: ${videoTitle}`));
    console.log(chalk.green('🚀 Descargando...'));

    ytdl(`https://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(`${filename}.mp3`))
      .on('finish', () => {
        console.log(chalk.greenBright(`\n✅ ¡Descarga completa! Guardado como ${filename}.mp3\n`));
      });
  } catch (error) {
    console.log(chalk.red('❌ Error al buscar o descargar la canción.'));
  }
});
