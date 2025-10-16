"use client";

import React, { useState } from "react";
import { auth, db, googleProvider } from "@/lib/firebase";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    UserCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface SignInProps {
    onSuccess: () => void;
    switchToSignUp: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSuccess, switchToSignUp }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;

        try {
            const result: UserCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = result.user;

            // Manejo del documento de usuario en Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    name: user.displayName || "Usuario sin nombre",
                    role: "viewer", // Rol predeterminado
                    createdAt: new Date(),
                });
            }

            onSuccess(); // Notificar éxito
        } catch (error: unknown) {
            console.error("Error al iniciar sesión:", error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError("");
        try {
            const result: UserCredential = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Manejo del documento de usuario en Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    name: user.displayName || "Usuario sin nombre",
                    role: "viewer", // Rol predeterminado
                    createdAt: new Date(),
                });
            }

            onSuccess(); // Notificar éxito
        } catch (error: unknown) {
            console.error("Error al iniciar sesión con Google:", error);
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
            <h2 className="text-xl font-semibold mb-4 text-center">Iniciar Sesión</h2>
            {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
            <form onSubmit={handleEmailSignIn} className="flex flex-col space-y-4">
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
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                </button>
            </form>
            <div className="mt-4 text-center">
                <button
                    onClick={handleGoogleSignIn}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                    disabled={loading}
                >
                    {loading ? "Cargando..." : "Iniciar con Google"}
                </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">
                ¿No tienes una cuenta?{" "}
                <button
                    onClick={switchToSignUp}
                    className="text-primary-dark hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-200"
                >
                    Registrarse
                </button>
            </p>
        </div>
    );
};

export default SignIn;