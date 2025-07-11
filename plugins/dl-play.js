const ytdl = require('ytdl-core');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ytSearch = require('yt-search');

console.clear();
console.log(chalk.red.bold('\n🎧 KanekiBot-MD — Reproductor YouTube\n'));
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
    message: chalk.magenta('💾 Nombre del archivo MP3 (sin .mp3):')
  }
]).then(async ({ query, filename }) => {
  try {
    const res = await ytSearch(query);

    if (!res.videos.length) {
      console.log(chalk.yellow('⚠️ No se encontraron resultados.'));
      return;
    }

    const video = res.videos[0];
    const videoUrl = video.url;

    console.log(chalk.green(`\n🎬 Título: ${video.title}`));
    console.log(chalk.green(`⏱ Duración: ${video.timestamp}`));
    console.log(chalk.green(`🌐 URL: ${videoUrl}`));
    console.log(chalk.blue('\n🚀 Descargando audio...\n'));

    ytdl(videoUrl, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(`${filename}.mp3`))
      .on('finish', () => {
        console.log(chalk.greenBright(`✅ Descarga completa: ${filename}.mp3\n`));
      });

  } catch (err) {
    console.error(chalk.red('❌ Error al buscar o descargar:'), err.message);
  }
});
