import fetch from 'node-fetch';

const BOT_NAME = 'Naruto Bot';
const CHANNEL_NAME = 'Canal del Sabio 🦊';
const BOT_TEXT = '¡Hola! Soy Naruto Bot, listo para ayudarte con todo.';

const IMAGE_ASSETS = [
    "https://files.catbox.moe/example1.jpg", 
    "https://files.catbox.moe/example2.jpg",
    "https://files.catbox.moe/example3.jpg",
];

const THUMBNAIL_ASSETS = [
    'https://qu.ax/thumb1.jpeg', 
    'https://qu.ax/thumb2.jpeg',
    'https://qu.ax/thumb3.jpeg',
];

const GROUP_INVITE_IMAGE = 'https://files.catbox.moe/group_invite.jpg'; 

const CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb64jLV7j6gAPLTUyD3v'; 
const GROUP_URL = 'https://chat.whatsapp.com/IhdD6VeQbna9lgnkV7nU3e'; 

export async function before(m, { conn }) {

    const getRandomImage = (images) => images[Math.floor(Math.random() * images.length)];

    const randomIcon = getRandomImage(IMAGE_ASSETS);
    const randomThumbnail = getRandomImage(THUMBNAIL_ASSETS);

    global.rcanal = {
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363419364337473@newsletter",
                serverMessageId: 100, 
                newsletterName: CHANNEL_NAME,
            },
            externalAdReply: {
                showAdAttribution: true,
                title: BOT_NAME,
                body: BOT_TEXT,
                mediaUrl: null, 
                description: null,
                previewType: "PHOTO",
                thumbnailUrl: randomIcon,
                sourceUrl: CHANNEL_URL,
                mediaType: 1, 
                renderLargerThumbnail: false
            },
        },
    };

    global.icono = randomThumbnail;

    global.fkontak = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`, 
            ...(m.chat ? { remoteJid: `status@broadcast` } : {})
        },
        message: {
            contactMessage: {
                displayName: BOT_NAME,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${BOT_NAME},;;;\nFN:${BOT_NAME},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                sendEphemeral: true
            }
        }
    };

    global.rpl = {
        contextInfo: {
            externalAdReply: {
                mediaUrl: GROUP_URL,
                mediaType: 'VIDEO', 
                description: 'Grupo de Soporte Oficial',
                title: 'Únete a nuestro Grupo de Soporte',
                body: 'Resolviendo dudas y ayudando a la comunidad.',
                thumbnailUrl: GROUP_INVITE_IMAGE,
                sourceUrl: GROUP_URL,
            }
        }
    };

    global.fake = {
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363419364337473@newsletter",
                serverMessageId: 100,
                newsletterName: CHANNEL_NAME,
            },
        },
    };
}
