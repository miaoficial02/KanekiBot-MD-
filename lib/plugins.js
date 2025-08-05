import { readdirSync, existsSync, readFileSync, watch} from 'fs';
import { join, resolve} from 'path';
import { format} from 'util';
import syntaxerror from 'syntax-error';
import importFile from './import.js';
import Helper from './helper.js';

const __dirname = Helper.__dirname(import.meta.url);
const pluginFolder = join(__dirname, '../plugins/index');
const pluginFilter = filename => /\.(mc)?js$/.test(filename);

let watcher = {};
let plugins = {};
let pluginFolders = [];

async function filesInit(folderPath = pluginFolder, filter = pluginFilter, conn) {
  const folder = resolve(folderPath);
  if (watcher[folder]) return plugins;
  pluginFolders.push(folder);

  const filenames = readdirSync(folder).filter(filter);

  await Promise.all(filenames.map(async filename => {
    try {
      const fileUrl = join(folder, filename);
      const module = await importFile(fileUrl);
      if (module) plugins[filename] = 'default' in module? module.default: module;
} catch (e) {
      conn?.logger?.error(e);
      delete plugins[filename];
}
}));

  const watchInstance = watch(folder, reload.bind(null, conn, folder, filter));
  watchInstance.on('close', () => deletePluginFolder(folder, true));
  watcher[folder] = watchInstance;

  return plugins;
}

function deletePluginFolder(folder, alreadyClosed = false) {
  const resolved = resolve(folder);
  if (!watcher[resolved]) return;
  if (!alreadyClosed) watcher[resolved].close();
  delete watcher[resolved];
  pluginFolders = pluginFolders.filter(f => f!== resolved);
}

async function reload(conn, folderPath = pluginFolder, filter = pluginFilter, _event, filename) {
  if (!filter(filename)) return;
  const filePath = join(folderPath, filename);
  const exists = existsSync(filePath);

  if (plugins[filename]) {
    if (exists) conn.logger?.info(`🔄 Plugin actualizado: '${filename}'`);
    else {
      conn.logger?.warn(`🗑️ Plugin eliminado: '${filename}'`);
      delete plugins[filename];
      return;
}
} else {
    conn.logger?.info(`🆕 Plugin nuevo: '${filename}'`);
}

  const code = readFileSync(filePath, 'utf-8');
  const err = syntaxerror(code, filename, {
    sourceType: 'module',
    allowAwaitOutsideFunction: true
});

  if (err) {
    conn.logger?.error(`❌ Error de sintaxis en '${filename}':\n${format(err)}`);
    return;
}

  try {
    const module = await importFile(filePath);
    if (module) plugins[filename] = module;
} catch (e) {
    conn.logger?.error(`⚠️ Error cargando plugin '${filename}':\n${format(e)}`);
} finally {
    plugins = Object.fromEntries(
      Object.entries(plugins).sort(([a], [b]) => a.localeCompare(b))
);
}
}

export {
  pluginFolder,
  pluginFilter,
  plugins,
  watcher,
  pluginFolders,
  filesInit,
  deletePluginFolder,
  reload
};