const ytdl = require('ytdl-core');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ytSearch = require('yt-search');

console.clear();
console.log(chalk.red.bold('\n🎧 KanekiBot-MD — Buscador YouTube\n'));
console.log(chalk.gray('=========================================\n'));

inquirer.prompt([
  {
    type: 'input',
    name: 'query',
    message: chalk.cyan('🔍 Escribe el nombre de la canción:')
  },
  {
    type: 'input',
    name: 'filename',
    message: chalk.magenta('💾 Nombre para el archivo MP3:')
  }
]).then(async ({ query, filename }) => {
  try {
    console.log(chalk.gray(`⏳ Buscando: ${query}...`));
    const results = await ytSearch(query);
    console.log(chalk.gray('✅ Resultado recibido de yt-search'));

    if (!results.videos || results.videos.length === 0) {
      console.log(chalk.yellow('⚠️ No se encontraron resultados.'));
      return;
    }

    const video = results.videos[0];
    console.log(chalk.green(`🎬 Título: ${video.title}`));
    console.log(chalk.green(`📺 URL: ${video.url}`));

    const output = `${filename}.mp3`;

    ytdl(video.url, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(output))
      .on('finish', () => {
        console.log(chalk.greenBright(`✅ Descarga completada: ${output}\n`));
      })
      .on('error', (err) => {
        console.error(chalk.red('❌ Error al guardar archivo:'), err);
      });

  } catch (err) {
    console.error(chalk.red('❌ Error en búsqueda o conexión:\n'), err);
  }
});
