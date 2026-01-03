'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoTestimonialProps {
    videoId: string;
    title?: string;
}

const VideoTestimonial: React.FC<VideoTestimonialProps> = ({ videoId, title = "YouTube video player" }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    if (!isPlaying) {
        return (
            <button
                onClick={() => setIsPlaying(true)}
                className="relative w-full overflow-hidden rounded-sm shadow-lg border border-gray-700 bg-black aspect-video group cursor-pointer"
                aria-label={`Reproducir video: ${title}`}
            >
                <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-puka-red rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={32} fill="currentColor" />
                    </div>
                </div>
            </button>
        );
    }

    return (
        <div className="relative w-full overflow-hidden rounded-sm shadow-lg border border-gray-700 bg-black aspect-video">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>
    );
};

export default VideoTestimonial;
