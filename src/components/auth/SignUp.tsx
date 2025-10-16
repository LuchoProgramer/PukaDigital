"use client";

import React, { useState, useRef, useEffect } from "react";
import { auth, db, googleProvider } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface SignUpProps {
    onSuccess: () => void;
    switchToSignIn: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSuccess, switchToSignIn }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const nameRef = useRef<HTMLInputElement>(null);

    // Enfocar el campo "Nombre" al abrir el modal
    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result: UserCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = result.user;

            // Crear o actualizar documento en Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    name: name || "Usuario sin nombre",
                    role: "viewer",
                    createdAt: new Date(),
                });
            } else {
                console.log("El usuario ya existe en Firestore.");
            }

            alert("Registro exitoso.");
            onSuccess(); // Notificar éxito
        } catch (error: unknown) {
            console.error("Error al registrar:", error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setError("");

        try {
            const result: UserCredential = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Crear o actualizar documento en Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    name: user.displayName || "Usuario sin nombre",
                    role: "viewer",
                    createdAt: new Date(),
                });
            } else {
                console.log("El usuario ya existe en Firestore.");
            }

            onSuccess(); // Notificar éxito
        } catch (error: unknown) {
            console.error("Error al registrarse con Google:", error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Registrarse</h2>
            {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
            <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    ref={nameRef}
                    required
                    className="px-3 py-2 border rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    required
                    className="px-3 py-2 border rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    required
                    className="px-3 py-2 border rounded"
                />
                <button
                    type="submit"
                    className="bg-primary-dark text-white py-2 rounded hover:bg-primary-light transition"
                    disabled={loading}
                >
                    {loading ? "Cargando..." : "Registrarse"}
                </button>
            </form>
            <div className="mt-4 text-center">
                <button
                    onClick={handleGoogleSignUp}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                    disabled={loading}
                >
                    {loading ? "Cargando..." : "Registrarse con Google"}
                </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">
                ¿Ya tienes una cuenta?{" "}
                <button
                    onClick={switchToSignIn}
                    className="text-primary-dark hover:underline"
                >
                    Iniciar sesión
                </button>
            </p>
        </div>
    );
};

export default SignUp;