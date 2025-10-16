import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    limit,
    Timestamp,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { Blog } from '../types';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Función utilitaria para obtener referencias de blogs
const getBlogRef = (id: string) => doc(db, "blogs", id);

// Función para crear un blog
export const createBlog = async (blogData: Blog): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, "blogs"), {
            ...blogData,
            createdAt: Timestamp.fromDate(new Date()),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error al crear el blog: ", error);
        throw new Error("No se pudo crear el blog.");
    }
};

// Función para leer todos los blogs
export const getBlogs = async (limitNumber = 10): Promise<Blog[]> => {
    try {
        const blogs: Blog[] = [];
        const blogsQuery = query(
            collection(db, "blogs"),
            orderBy("createdAt", "desc"),
            limit(limitNumber)
        );
        const querySnapshot = await getDocs(blogsQuery);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            blogs.push({
                id: doc.id, // Firebase siempre proporciona `doc.id`
                title: data.title || "Sin título",
                content: data.content || "Contenido no disponible",
                createdAt: data.createdAt ? data.createdAt.toDate() : null, // Convierte `Timestamp` a `Date`
                slug: data.slug || data.title.toLowerCase().replace(/ /g, "-") || doc.id, // Genera un slug si no está presente
                image: data.image || null, // Opcional
                alt: data.alt || "Imagen del blog", // Opcional
                excerpt: data.excerpt || data.content?.substring(0, 150) || "No hay descripción disponible.", // Opcional
                blocks: data.blocks || [], // Agregado: si no hay bloques, asigna un array vacío
            });
        });

        return blogs;
    } catch (error) {
        console.error("Error al obtener los blogs: ", error);
        throw new Error("No se pudieron cargar los blogs.");
    }
};

// Función para actualizar un blog
export const updateBlog = async (
    id: string,
    updatedData: Partial<Blog>
): Promise<void> => {
    try {
        const blogRef = getBlogRef(id);
        await updateDoc(blogRef, updatedData);
    } catch (error) {
        console.error("Error al actualizar el blog: ", error);
        throw new Error("No se pudo actualizar el blog.");
    }
};

// Función para eliminar un blog
export const deleteBlog = async (id: string): Promise<void> => {
    try {
        const blogRef = getBlogRef(id);
        await deleteDoc(blogRef);
    } catch (error) {
        console.error("Error al eliminar el blog: ", error);
        throw new Error("No se pudo eliminar el blog.");
    }
};

// Exportar servicios de Firebase
export { auth, googleProvider, db };