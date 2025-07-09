import { DOMImplementation, XMLSerializer } from 'xmldom';
import JsBarcode from 'jsbarcode';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

const src = join(__dirname, '..', 'src');
const _svg = readFileSync(join(src, 'welcome.svg'), 'utf-8');

// Generador de código de barras estilizado
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

// Setters para atributos SVG
const imageSetter = (img, value) => img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value);
const textSetter = (el, value) => el.textContent = value;

let { document: svg } = new JSDOM(_svg).window;

// Generador SVG visual con diseño bonito y links de imagen
const genSVG = async ({
  wid = '',
  pp = 'https://qu.ax/ARhkT.jpg',
  title = '',
  name = '',
  text = '',
  background = 'https://qu.ax/Aesthetic_000.jpeg'
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
    set(svg.querySelector(selector), value);
  }

  return svg.body.innerHTML;
};

// Convertidor SVG a imagen
const toImg = (svg, format = 'png') => new Promise((resolve, reject) => {
  if (!svg) return resolve(Buffer.alloc(0));
  const bufs = [];
  const im = spawn('magick', ['convert', 'svg:-', format + ':-']);
  im.on('error', e => reject(e));
  im.stdout.on('data', chunk => bufs.push(chunk));
  im.stdin.write(Buffer.from(svg));
  im.stdin.end();
  im.on('close', code => {
    if (code !== 0) reject(code);
    resolve(Buffer.concat(bufs));
  });
});

// Convertidor a base64
const toBase64 = (buffer, mime) => `data:${mime};base64,${buffer.toString('base64')}`;

// Renderizador principal
const render = async ({
  wid = '',
  pp = 'https://qu.ax/PPImage.jpg',
  name = '',
  title = '',
  text = '',
  background = 'https://qu.ax/Aesthetic_000.jpeg'
} = {}, format = 'png') => {
  const svg = await genSVG({ wid, pp, name, text, background, title });
  return await toImg(svg, format);
};

if (require.main === module) {
  render({
    wid: '1234567890',
    name: 'John Doe',
    text: '🌟 Bienvenido al grupo\n¡Disfruta tu estadía!',
    title: '⚔ GRUPO KANEKI ⚔'
  }, 'jpg').then(result => {
    process.stdout.write(result);
  });
} else module.exports = render;
