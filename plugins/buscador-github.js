import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

// 🤖 Lógica principal del plugin
let handler = async (m, { conn, args, usedPrefix, command }) => {
    // La consulta es todo lo que viene después del comando.
    const query = args.join(' ');
    if (!query) {
        return m.reply(`🧠 Por favor, ingresa una consulta para buscar en GitHub.\n\n📌 Ejemplo:\n${usedPrefix}${command} WhatsApp Bot`);
    }

    m.react("🔍");

    try {
        const apiUrl = `https://api.dorratz.com/v3/github-code?q=${encodeURIComponent(query)}`;
        const res = await axios.get(apiUrl);
        const results = res.data?.results?.payload?.results;

        // Validar si la API devolvió resultados
        if (!results || results.length === 0) {
            m.react("❌");
            return m.reply(`⚠️ No se encontraron repositorios en GitHub para la consulta: "${query}".`);
        }

        // Construir el mensaje con los resultados
        let message = `◜ Resultados de búsqueda en GitHub ◞\n\n`;
        const limit = Math.min(results.length, 5); // Limitar a 5 resultados para no sobrecargar el chat

        for (let i = 0; i < limit; i++) {
            const repo = results[i];
            const repoName = repo.hl_name || repo.repo.repository.name;
            const ownerLogin = repo.repo.repository.owner_login;
            const language = repo.language || 'Desconocido';
            const description = repo.hl_trunc_description ? repo.hl_trunc_description.replace(/<[^>]*>/g, '') : 'Sin descripción.';
            
            const repoUrl = `https://github.com/${ownerLogin}/${repo.repo.repository.name}`;

            message += `≡ 📁 *${repoName}*\n`;
            message += `├─ 👤 *Autor:* ${ownerLogin}\n`;
            message += `├─ 🌐 *Lenguaje:* ${language}\n`;
            message += `├─ 📄 *Descripción:* ${description}\n`;
            message += `└─ 🔗 *URL:* ${repoUrl}\n\n`;
        }

        message += `» Solo se muestran los primeros ${limit} resultados.`;

        // Enviar el mensaje con los resultados al chat.
        await conn.sendMessage(m.chat, {
            caption: message,
        }, { quoted: m });

        m.react("✅");

    } catch (e) {
        m.react("❌");
        
        let mensaje = "Ocurrió un error inesperado al procesar tu solicitud.";
        let tipo = "Error desconocido";

        if (e.response) {
            tipo = `Error HTTP ${e.response.status}`;
            mensaje = `La API respondió con un error: ${e.response.statusText}.`;
        } else if (e.request) {
            tipo = "Error de conexión";
            mensaje = "No se pudo conectar con el servidor de la API. Revisa tu conexión a internet.";
        } else {
            tipo = e.name || "Error inesperado";
            mensaje = e.message || "Ocurrió un problema. Intenta de nuevo.";
        }
        
        await conn.reply(m.chat, `💥 Error: ${mensaje}\nTipo: ${tipo}`, m);
        console.error(`[GITHUB-SEARCH] Error capturado: ${tipo} → ${e.message}`);
    }
};

handler.help = ['github <consulta>'];
handler.command = ['github', 'gh'];
handler.tags = ['search'];

export default handler;
