export const parseVideoUrl = async (url: string): Promise<string | null> => {
    if (!url) {
        console.error("La URL proporcionada está vacía.");
        return null;
    }

    try {
        let resolvedUrl = url;

        // Verificar si es una URL corta de TikTok
        if (url.includes("vm.tiktok.com")) {
            // Resolver la URL corta
            const response = await fetch(url, {
                method: 'HEAD',
                redirect: 'follow',
            });
            resolvedUrl = response.url;
            console.log("URL resuelta de TikTok:", resolvedUrl);
        }

        const parsedUrl = new URL(resolvedUrl);
        console.log("URL analizada:", parsedUrl);

        // Manejo de TikTok
        if (parsedUrl.hostname.includes("tiktok.com")) {
            const paths = parsedUrl.pathname.split("/").filter(Boolean);
            console.log("Paths de TikTok:", paths);
            const videoIndex = paths.findIndex((segment) => segment === "video");
            const videoId = videoIndex !== -1 ? paths[videoIndex + 1] : null;

            if (videoId) {
                const embedUrl = `https://www.tiktok.com/embed/${videoId}`;
                console.log("Embed URL de TikTok:", embedUrl);
                return embedUrl;
            } else {
                console.error("No se encontró el ID del video de TikTok.");
                return null;
            }
        }

        // Manejo de YouTube
        if (parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be")) {
            let videoId: string | null = null;

            if (parsedUrl.hostname.includes("youtu.be")) {
                // URL corta de YouTube
                videoId = parsedUrl.pathname.substring(1);
            } else if (parsedUrl.hostname.includes("youtube.com")) {
                // URL estándar de YouTube
                videoId = parsedUrl.searchParams.get("v");
            }

            if (videoId) {
                const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                console.log("Embed URL de YouTube:", embedUrl);
                return embedUrl;
            } else {
                console.error("No se encontró el ID del video de YouTube.");
                return null;
            }
        }

        // Manejo de Vimeo
        if (parsedUrl.hostname.includes("vimeo.com")) {
            const paths = parsedUrl.pathname.split("/").filter(Boolean);
            const videoId = paths.length > 0 ? paths[0] : null;

            if (videoId) {
                const embedUrl = `https://player.vimeo.com/video/${videoId}`;
                console.log("Embed URL de Vimeo:", embedUrl);
                return embedUrl;
            } else {
                console.error("No se encontró el ID del video de Vimeo.");
                return null;
            }
        }

        console.error("La plataforma de video no es compatible.");
        return null;
    } catch (error) {
        console.error("Error procesando la URL:", error);
        return null;
    }
};