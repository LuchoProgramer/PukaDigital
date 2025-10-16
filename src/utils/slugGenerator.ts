export const generateSlug = (title: string): string => {
    return title
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar marcas de acentuación
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres no deseados
        .trim()
        .replace(/\s+/g, '-'); // Reemplazar espacios por guiones
};
