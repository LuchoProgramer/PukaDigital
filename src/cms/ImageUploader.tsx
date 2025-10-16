import React, { useState, ChangeEvent } from 'react';
import { uploadImageToCloudinary, getTransformedImageUrl } from '../../src/utils/cloudinary';

interface ImageUploaderProps {
    onUpload: (url: string, alt: string) => void;
    url: string;
    alt: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                alert('Por favor, selecciona un archivo de imagen válido.');
                return;
            }

            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        try {
            const uploadedUrl = await uploadImageToCloudinary(file);

            const transformedUrl = getTransformedImageUrl(uploadedUrl, {
                width: 600,
                height: 400,
                crop: 'fill',
                gravity: 'auto',
            });

            const alt = prompt("Describe brevemente la imagen:") || "Imagen relacionada con el blog";

            onUpload(transformedUrl, alt);

            alert('Imagen subida exitosamente');
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen, inténtalo nuevamente.');
        } finally {
            setIsUploading(false);
            setFile(null);
            setPreview('');
        }
    };

    return (
        <div className="flex-1 min-w-[120px] flex flex-col">
            <label className="block mb-2 font-bold text-gray-700 dark:text-gray-200">
                Seleccionar Imagen
            </label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2"
            />
            {preview && (
                <div className="mb-2">
                    <img
                        src={preview}
                        alt="Vista previa"
                        className="w-full h-[300px] object-cover rounded shadow"
                    />
                </div>
            )}
            <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`py-2 px-4 text-white font-bold rounded ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    } transition`}
            >
                {isUploading ? 'Subiendo...' : 'Subir Imagen'}
            </button>
        </div>
    );
};

export default ImageUploader;