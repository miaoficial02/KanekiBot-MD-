import { DOMImplementation, XMLSerializer } from 'xmldom';
import JsBarcode from 'jsbarcode';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

const src = join(__dirname, '..', 'src');
const _svg = readFileSync(join(src, 'welcome.svg'), 'utf-8');

const barcode = data => {
  const xmlSerializer = new XMLSerializer();
  const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
  const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  JsBarcode(svgNode, data, {
    xmlDocument: document,
    height: 40,
    margin: 0,
    fontSize: 12
  });

  return xmlSerializer.serializeToString(svgNode);
};

const imageSetter = (img, value) => img?.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value);
const textSetter = (el, value) => { if (el) el.textContent = value };

let { document: svg } = new JSDOM(_svg).window;

const genSVG = async ({
  wid = '',
  pp = '',
  title = '',
  name = '',
  text = '',
  background = ''
} = {}) => {
  const codeBase64 = toBase64(await toImg(barcode(wid.replace(/[^0-9]/g, '')), 'png'), 'image/png');

  const el = {
    code: ['#_1661899539392 > g:nth-child(6) > image', imageSetter, codeBase64],
    pp: ['#_1661899539392 > g:nth-child(3) > image', imageSetter, pp],
    text: ['#_1661899539392 > text.fil1.fnt0', textSetter, text],
    title: ['#_1661899539392 > text.fil2.fnt1', textSetter, title.toUpperCase()],
    name: ['#_1661899539392 > text.fil2.fnt2', textSetter, name],
    bg: ['#_1661899539392 > g:nth-child(2) > image', imageSetter, background]
  };

  for (let [selector, set, value] of Object.values(el)) {
    const node = svg.querySelector(selector);
    set(node, value);
  }

  return svg.body.innerHTML;
};

const toImg = (svg, format = 'png') => new Promise((resolve, reject) => {
  if (!svg) return resolve(Buffer.alloc(0));
  const bufs = [];
  const im = spawn('magick', ['convert', 'svg:-', `${format}:-`]);
  im.on('error', e => reject(e));
  im.stdout.on('data', chunk => bufs.push(chunk));
  im.stdin.write(Buffer.from(svg));
  im.stdin.end();
  im.on('close', code => {
    if (code !== 0) reject(code);
    resolve(Buffer.concat(bufs));
  });
});

const toBase64 = (buffer, mime) => `data:${mime};base64,${buffer.toString('base64')}`;

// Función exportada para bienvenida y despedida
const render = async ({
  wid = '',
  pp = '',
  name = '',
  title = '',
  text = '',
  background = '',
  type = 'welcome' // <--- clave: para saber si es bienvenida o despedida
} = {}, format = 'png') => {
  // Valores por defecto para bienvenida
  if (type === 'welcome') {
    pp = pp || 'https://qu.ax/VGCPX.jpg'
    background = background || 'https://qu.ax/bg-welcome-kaneki.jpg'
    title = title || '🎉 BIENVENID@ 🎉'
    text = text || '✨ Gracias por unirte a *KanekiBot-MD*\nParticipa y lee las reglas'
  }

  // Valores por defecto para despedida
  if (type === 'bye') {
    pp = pp || 'https://qu.ax/VGCPX.jpg'
    background = background || 'https://qu.ax/bg-bye-kaneki.jpg'
    title = title || '👋 HASTA PRONTO 👋'
    text = text || '🕊️ Gracias por estar con nosotros\nEsperamos verte pronto de nuevo'
  }

  const svg = await genSVG({ wid, pp, name, title, text, background });
  return await toImg(svg, format);
};

export default render;
