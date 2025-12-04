import React from 'react';

interface VideoTestimonialProps {
    videoId: string;
    title?: string;
}

const VideoTestimonial: React.FC<VideoTestimonialProps> = ({ videoId, title = "YouTube video player" }) => {
    return (
        <div className="relative w-full overflow-hidden rounded-sm shadow-lg border border-gray-700 bg-black aspect-video">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>
    );
};

export default VideoTestimonial;
