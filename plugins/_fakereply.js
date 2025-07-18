import fetch from 'node-fetch'

export async function before(m, { conn}) {

    let name = `ᥴһᥲᥒᥒᥱᥣ-sᥲsᥙkᥱ ᑲ᥆𝗍 mძ 🌀`
    let botname = `Sasuke Bot`
    let textbot = `¡Hola! Soy Sasuke Bot, tu asistente personal.`

    let imagenes = [
        "https://files.catbox.moe/6dewf4.jpg",
        "https://files.catbox.moe/6dewf4.jpg",
        "https://files.catbox.moe/6dewf4.jpg",
        "https://files.catbox.moe/6dewf4.jpg",
    ]
    let icono = imagenes[Math.floor(Math.random() * imagenes.length)]

    let canal = 'https://whatsapp.com/channel/0029Vb64jLV7j6gAPLTUyD3v'
    let group = 'https://chat.whatsapp.com/IhdD6VeQbna9lgnkV7nU3e?mode=r_t'
    let packname = 'Bajo'
    let imagen2 = 'https://files.catbox.moe/c2lp78.jpg'


    global.rcanal = {
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363419364337473@newsletter",
                serverMessageId: 100,
                newsletterName: name,
            },
            externalAdReply: {
                showAdAttribution: true,
                title: botname,
                // body: textbot,
                mediaUrl: null,
                description: null,
                previewType: "PHOTO",
                thumbnailUrl: icono,
                sourceUrl: canal,
                mediaType: 1,
                renderLargerThumbnail: false
            },
        },
    }

    // Iconos aleatorios
    global.icono = [
        'https://qu.ax/yyCo.jpeg',
        'https://qu.ax/yyCo.jpeg',
        'https://qu.ax/qJch.jpeg',
        'https://qu.ax/qJch.jpeg',
        'https://qu.ax/CHRS.jpeg',
        'https://qu.ax/CHRS.jpeg',
    ][Math.floor(Math.random() * 6)]

    // Mensaje de contacto
    global.fkontak = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`,
            ...(m.chat? { remoteJid: `status@broadcast`}: {})
        },
        message: {
            contactMessage: {
                displayName: botname,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${botname},;;;\nFN:${botname},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                sendEphemeral: true
            }
        }
    }

    // Mensaje tipo grupo
    global.rpl = {
        contextInfo: {
            externalAdReply: {
                mediaUrl: group,
                mediaType: 'VIDEO',
                description: 'support group',
                title: packname,
                body: 'grupo de soporte',
                thumbnailUrl: imagen2,
                sourceUrl: group,
            }
        }
    }

    // Mensaje tipo reenviado de canal
    global.fake = {
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363419364337473@newsletter",
                serverMessageId: 100,
                newsletterName: name,
            },
        },
    }
}
