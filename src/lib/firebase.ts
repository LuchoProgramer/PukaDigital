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
    where,
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

// Función para crear un blog (multitenant)
export const createBlog = async (
  tenantId: string, 
  blogData: Blog
): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, "tenants", tenantId, "blogs"), {
            ...blogData,
            tenantId,
            createdAt: Timestamp.fromDate(new Date()),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error al crear el blog: ", error);
        throw new Error("No se pudo crear el blog.");
    }
};

// Función para leer todos los blogs de un tenant
export const getBlogs = async (
  tenantId: string, 
  limitNumber = 10
): Promise<Blog[]> => {
    try {
        const blogs: Blog[] = [];
        const blogsQuery = query(
            collection(db, "tenants", tenantId, "blogs"),
            orderBy("createdAt", "desc"),
            limit(limitNumber)
        );
        const querySnapshot = await getDocs(blogsQuery);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            blogs.push({
                id: doc.id,
                title: data.title || "Sin título",
                content: data.content || "Contenido no disponible",
                createdAt: data.createdAt ? data.createdAt.toDate() : null,
                slug: data.slug || data.title?.toLowerCase().replace(/ /g, "-") || doc.id,
                image: data.image || null,
                alt: data.alt || "Imagen del blog",
                excerpt: data.excerpt || data.content?.substring(0, 150) || "No hay descripción disponible.",
                blocks: data.blocks || [],
                tenantId: data.tenantId || tenantId,
                author: data.author || null,
            });
        });

        return blogs;
    } catch (error) {
        console.error("Error al obtener los blogs: ", error);
        throw new Error("No se pudieron cargar los blogs.");
    }
};

// Función para actualizar un blog (multitenant)
export const updateBlog = async (
    tenantId: string,
    id: string,
    updatedData: Partial<Blog>
): Promise<void> => {
    try {
        const blogRef = doc(db, "tenants", tenantId, "blogs", id);
        await updateDoc(blogRef, updatedData);
    } catch (error) {
        console.error("Error al actualizar el blog: ", error);
        throw new Error("No se pudo actualizar el blog.");
    }
};

// Función para eliminar un blog (multitenant)
export const deleteBlog = async (tenantId: string, id: string): Promise<void> => {
    try {
        const blogRef = doc(db, "tenants", tenantId, "blogs", id);
        await deleteDoc(blogRef);
    } catch (error) {
        console.error("Error al eliminar el blog: ", error);
        throw new Error("No se pudo eliminar el blog.");
    }
};

// Función para obtener un blog por slug (multitenant)
export const getBlogBySlug = async (
    tenantId: string, 
    slug: string
): Promise<Blog | null> => {
    try {
        const blogsRef = collection(db, "tenants", tenantId, "blogs");
        const q = query(blogsRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const blogDoc = querySnapshot.docs[0];
            const data = blogDoc.data();
            return { 
                id: blogDoc.id, 
                ...data,
                createdAt: data.createdAt ? data.createdAt.toDate() : null,
                tenantId: data.tenantId || tenantId,
            } as Blog;
        }

        return null;
    } catch (error) {
        console.error("Error al obtener el blog:", error);
        return null;
    }
};

// Exportar servicios de Firebase
export { auth, googleProvider, db };