const ytdl = require('ytdl-core');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const axios = require('axios');

console.clear();
console.log(chalk.red.bold('\n🎧 KanekiBot-MD — Descargador de YouTube 🎶\n'));
console.log(chalk.gray('================================================'));

inquirer.prompt([
  {
    type: 'input',
    name: 'query',
    message: chalk.cyan('🔍 Escribe el nombre o título del video:')
  },
  {
    type: 'input',
    name: 'filename',
    message: chalk.magenta('💾 Nombre del archivo MP3:')
  }
]).then(async ({ query, filename }) => {
  try {
    const res = await axios.get(`https://api.sylphy.xyz/search/youtube?q=${encodeURIComponent(query)}&hl=es`);

    if (!res.data || !res.data.result || res.data.result.length === 0) {
      console.log(chalk.yellow('⚠️ No se encontraron resultados.'));
      return;
    }

    const video = res.data.result[0];
    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
    const title = video.title;

    console.log(chalk.green(`\n🎬 Encontrado: ${title}`));
    console.log(chalk.green(`🌐 URL: ${videoUrl}`));
    console.log(chalk.blue('🚀 Descargando...'));

    const output = `${filename}.mp3`;

    ytdl(videoUrl, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(output))
      .on('finish', () => {
        console.log(chalk.greenBright(`\n✅ ¡Descarga completada! Archivo guardado como: ${output}\n`));
      })
      .on('error', (err) => {
        console.error(chalk.red('❌ Error al guardar el archivo:'), err);
      });

  } catch (err) {
    console.error(chalk.red('❌ Error al buscar o descargar la canción:'), err.message || err);
  }
});
