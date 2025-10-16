import axios from 'axios';

/**
 * Configuración centralizada para Cloudinary.
 */
export const CLOUDINARY_CONFIG = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '', // Asegúrate de definir esta variable en .env.local
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ckeditor_upload_preset', // Cambia por tu preset
    defaultFolder: 'blogs', // Carpeta opcional
};

/**
 * Validación de configuración
 */
if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
    console.error('Cloudinary configuration is missing. Please check your environment variables.');
    throw new Error('Cloudinary configuration is missing.');
}

/**
 * Sube una imagen a Cloudinary con validación y optimización básica.
 * @param {File} file - Archivo de imagen seleccionado.
 * @returns {Promise<string>} - URL pública de la imagen subida.
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    // Verificar si estamos en un entorno de navegador antes de usar FormData
    if (typeof window === 'undefined') {
        throw new Error('FormData no está disponible en el servidor');
    }

    // Validación del archivo
    if (!file || !file.type.startsWith('image/')) {
        throw new Error('El archivo seleccionado no es una imagen válida.');
    }
    if (file.size > 5 * 1024 * 1024) {
        // Límite de 5 MB
        throw new Error('El tamaño de la imagen supera el límite de 5 MB.');
    }

    // Configurar los datos para la subida
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', CLOUDINARY_CONFIG.defaultFolder);

    try {
        // Subida a Cloudinary
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
            formData
        );

        // Devuelve la URL pública de la imagen subida
        return response.data.secure_url;
    } catch (error: unknown) {
        // Manejo de errores
        if (axios.isAxiosError(error) && error.response) { // Verificamos si es un error de Axios
            console.error('Cloudinary Error:', error.response.data);
            throw new Error(`Cloudinary Error: ${error.response.data.error?.message || 'Error desconocido.'}`);
        } else {
            console.error('Error de red o servidor:', error);
            throw new Error('Error de red o servidor. Inténtalo de nuevo.');
        }
    }
};

/**
 * Opciones de transformación de imagen.
 */
export interface TransformationOptions {
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
    quality?: string;
    format?: string;
    radius?: number;
    effect?: string;
}

/**
 * Genera una URL dinámica con transformaciones específicas para una imagen ya subida.
 * @param {string} imageUrl - URL original de la imagen en Cloudinary.
 * @param {TransformationOptions} options - Opciones de transformación.
 * @returns {string} - URL transformada con las opciones aplicadas.
 */
export const getTransformedImageUrl = (
    imageUrl: string,
    options: TransformationOptions = {}
): string => {
    const {
        width = 600, // Ancho por defecto
        height = 400, // Alto por defecto
        crop = 'fill', // Recorte por defecto
        gravity = 'auto', // Centrar automáticamente
        quality = 'auto', // Calidad automática
        format = 'auto', // Formato automático
        radius, // No definimos valor por defecto
        effect, // No definimos valor por defecto
    } = options;

    // Validación de la URL
    if (!imageUrl || !imageUrl.startsWith('https://res.cloudinary.com/')) {
        throw new Error('URL de imagen no válida o no proviene de Cloudinary.');
    }

    // Construir la cadena de transformación dinámicamente
    const transformations = [
        `w_${width}`,
        `h_${height}`,
        `c_${crop}`,
        `g_${gravity}`,
        `q_${quality}`,
        `f_${format}`,
    ];

    // Agregar transformaciones opcionales sólo si están definidas
    if (radius !== undefined && radius !== 0) {
        transformations.push(`r_${radius}`);
    }
    if (effect && effect.trim() !== '') {
        transformations.push(`e_${effect}`);
    }

    const transformationString = transformations.join(',');

    // Reemplazar '/upload/' en la URL con la cadena de transformación
    return imageUrl.replace('/upload/', `/upload/${transformationString}/`);
};