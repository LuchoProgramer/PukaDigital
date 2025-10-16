/* eslint-disable no-unused-vars */

import React, { useState } from "react";

interface VideoEmbedderProps {
    onEmbed: (url: string) => void; // Función que se llama al insertar un video
}

const VideoEmbedder: React.FC<VideoEmbedderProps> = ({ onEmbed }) => {
    const [videoUrl, setVideoUrl] = useState<string>("");

    const handleEmbed = () => {
        if (videoUrl.trim()) {
            onEmbed(videoUrl.trim()); // Notificar al padre con la URL
            setVideoUrl(""); // Limpiar el campo después de enviar
        } else {
            alert("Por favor, introduce una URL válida.");
        }
    };

    return (
        <div className="flex-1 min-w-[120px] flex flex-col">
            <label className="block mb-2 font-bold text-gray-700 dark:text-gray-200">
                Insertar Video
            </label>
            <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="URL del video (YouTube, TikTok, etc.)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary mb-2"
            />
            <button
                type="button"
                onClick={handleEmbed}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            >
                Agregar Video
            </button>
        </div>
    );
};

export default VideoEmbedder;