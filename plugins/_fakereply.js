
import fetch from 'node-fetch'

export async function before(m, { conn}) {
    
    let name = `ᥴһᥲᥒᥒᥱᥣ-sᥲsᥙkᥱ ᑲ᥆𝗍 mძ 🌀`
    let botname = `Sasuke Bot`
  //  let textbot = `¡Hola! Soy Sasuke Bot, tu asistente personal.`

    let imagenes = [
        "https://files.catbox.moe/6dewf4.jpg",
        "https://files.catbox.moe/6dewf4.jpg",
        "https://files.catbox.moe/6dewf4.jpg",
        "https://files.catbox.moe/6dewf4.jpg",
    ]
    let icono = imagenes[Math.floor(Math.random() * imagenes.length)]

    let canal = 'https://example.com/canal' // ✅ asegúrate de cambiar esto
    let group = 'https://example.com/group' // ✅ asegúrate de cambiar esto
    let packname = 'Nombre del Paquete' // ✅ personalízalo
    let imagen2 = 'https://example.com/imagen2.jpg' // ✅ imagen de miniatura


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
              //  body: textbot,
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