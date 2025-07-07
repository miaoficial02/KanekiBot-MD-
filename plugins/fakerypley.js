// fakerypley.js
import fetch from 'node-fetch'
import fs from 'fs'

let handler = async function (m, { conn }) {

  let name = `sіgᥙᥱ ᥱᥣ ᥴᥲᥒᥲᥣ | 𝘮𝘦𝘭𝘪𝘰𝘥𝘢𝘴 - 𝘣𝘰𝘵`
  let imagenes = [
    "https://qu.ax/rEJmN.jpg",
    "https://qu.ax/rEJmN.jpg",
    "https://qu.ax/rEJmN.jpg",
    "https://qu.ax/rEJmN.jpg",
  ]

  let icono = imagenes[Math.floor(Math.random() * imagenes.length)]

  // Contexto tipo canal de WhatsApp (rcanal)
  global.rcanal = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363419009027760@newsletter",
        serverMessageId: 100,
        newsletterName: name,
      },
      externalAdReply: {
        showAdAttribution: true,
        title: global.botname || 'Bot',
        body: global.textbot || 'Bot en funcionamiento',
        mediaUrl: null,
        description: null,
        previewType: "PHOTO",
        thumbnailUrl: icono,
        sourceUrl: global.canal || 'https://whatsapp.com/channel/your-channel-id',
        mediaType: 1,
        renderLargerThumbnail: false
      },
    },
  }

  // Ícono aleatorio
  global.icono = [
    'https://qu.ax/bjOsy.jpg',
    'https://qu.ax/bjOsy.jpg',
    'https://qu.ax/bjOsy.jpg',
    'https://qu.ax/bjOsy.jpg',
    'https://qu.ax/bjOsy.jpg',
    'https://qu.ax/bjOsy.jpg',
  ].sort(() => Math.random() - 0.5)[0]

  // Contacto falso
  global.fkontak = {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: "status@broadcast" } : {})
    },
    message: {
      contactMessage: {
        displayName: global.wm || 'Bot WhatsApp',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${global.wm || 'Bot'};;;\nFN:${global.wm || 'Bot'}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
    //    jpegThumbnail: fs.readFileSync('./storage/img/catalogo.png'),
        //thumbnail: fs.readFileSync('./storage/img/catalogo.png'),
        sendEphemeral: true
      }
    }
  }

  // Respuesta con preview a grupo (rpl)
  global.rpl = {
    contextInfo: {
      externalAdReply: {
        mediaUrl: global.group || 'https://chat.whatsapp.com/XXXXX',
        mediaType: 'VIDEO',
        description: 'support group',
        title: global.packname || 'Bot Oficial',
        body: 'Grupo de soporte',
        thumbnailUrl: 'https://qu.ax/rEJmN.jpg', // Puedes cambiarlo
        sourceUrl: global.group || 'https://chat.whatsapp.com/XXXXX'
      }
    }
  }

  // Fake básico tipo canal (fake)
  global.fake = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363414007802886@newsletter",
        serverMessageId: 100,
        newsletterName: name,
      }
    }
  }

}
export default { before: handler }
