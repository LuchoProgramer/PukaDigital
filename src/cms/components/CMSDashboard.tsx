"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
    FiEdit, 
    FiEye, 
    FiPlusCircle, 
    FiUsers, 
    FiSettings, 
    FiBarChart,
    FiClock,
    FiTrendingUp,
    FiCalendar,
    FiGlobe,
    FiShield,
    FiActivity,
    FiArrowRight,
    FiStar,
    FiFileText
} from "react-icons/fi";
import { useTenant } from "@/context/TenantContext";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getBlogs } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

// UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { LoadingState, ErrorState } from "@/components/ui/EmptyState";

interface BlogStats {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalUsers: number;
    recentBlogs: any[];
    monthlyStats: {
        thisMonth: number;
        lastMonth: number;
        growth: number;
    };
}

const CMSDashboard: React.FC = () => {
    const { tenant } = useTenant();
    const { user, isAdmin, loading } = useAdminAuth({ tenantId: tenant?.id });
    const [stats, setStats] = useState<BlogStats>({
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        totalUsers: 0,
        recentBlogs: [],
        monthlyStats: {
            thisMonth: 0,
            lastMonth: 0,
            growth: 0
        }
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchDashboardStats = async () => {
            if (!tenant?.id) {
                setIsLoadingStats(false);
                return;
            }

            try {
                setError('');
                
                // Obtener todos los blogs
                const allBlogs = await getBlogs(tenant.id, 1000);
                
                // Obtener usuarios del tenant
                const usersSnapshot = await getDocs(collection(db, "tenants", tenant.id, "users"));
                
                // Obtener blogs recientes (últimos 5)
                const recentBlogsQuery = query(
                    collection(db, "tenants", tenant.id, "blogs"),
                    orderBy("createdAt", "desc"),
                    limit(5)
                );
                const recentBlogsSnapshot = await getDocs(recentBlogsQuery);
                const recentBlogs = recentBlogsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate()
                }));

                // Calcular estadísticas por estado
                const publishedBlogs = allBlogs.filter(blog => (blog as any).status === 'published').length;
                const draftBlogs = allBlogs.filter(blog => (blog as any).status === 'draft').length;

                // Calcular estadísticas mensuales
                const now = new Date();
                const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

                const thisMonthBlogs = allBlogs.filter(blog => {
                    const blogDate = blog.createdAt instanceof Date ? blog.createdAt : (blog.createdAt as any)?.toDate?.();
                    return blogDate && blogDate >= thisMonthStart;
                }).length;

                const lastMonthBlogs = allBlogs.filter(blog => {
                    const blogDate = blog.createdAt instanceof Date ? blog.createdAt : (blog.createdAt as any)?.toDate?.();
                    return blogDate && blogDate >= lastMonthStart && blogDate <= lastMonthEnd;
                }).length;

                const growth = lastMonthBlogs > 0 
                    ? ((thisMonthBlogs - lastMonthBlogs) / lastMonthBlogs) * 100 
                    : 0;

                setStats({
                    totalBlogs: allBlogs.length,
                    publishedBlogs,
                    draftBlogs,
                    totalUsers: usersSnapshot.size,
                    recentBlogs,
                    monthlyStats: {
                        thisMonth: thisMonthBlogs,
                        lastMonth: lastMonthBlogs,
                        growth: Math.round(growth)
                    }
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setError("Error al cargar las estadísticas del dashboard");
            } finally {
                setIsLoadingStats(false);
            }
        };

        fetchDashboardStats();
    }, [tenant]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <LoadingState 
                    title="Cargando Dashboard"
                    description="Verificando permisos y cargando estadísticas..."
                    size="lg"
                />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
                <Card className="max-w-md w-full text-center">
                    <CardContent>
                        <div className="text-red-500 text-6xl mb-4">🔐</div>
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                            Usuario no autenticado
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Necesitas iniciar sesión para acceder al dashboard
                        </p>
                        <Button 
                            as={Link}
                            href="/admin/login" 
                            variant="primary"
                            fullWidth
                        >
                            Ir al Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
                <Card className="max-w-md w-full text-center">
                    <CardContent>
                        <div className="text-red-500 text-6xl mb-4">🚫</div>
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                            Acceso Denegado
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            No tienes permisos para acceder al dashboard
                        </p>
                        <div className="space-y-3">
                            <Button 
                                as={Link}
                                href="/admin/debug" 
                                variant="secondary"
                                fullWidth
                            >
                                🔍 Ver Debug
                            </Button>
                            <Button 
                                as={Link}
                                href="/admin/login" 
                                variant="primary"
                                fullWidth
                            >
                                🔐 Ir al Login
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!tenant) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
                <Card className="max-w-md w-full text-center">
                    <CardContent>
                        <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
                            Sin Tenant
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            No hay tenant configurado
                        </p>
                        <Button 
                            as={Link}
                            href="/admin/login" 
                            variant="primary"
                            fullWidth
                        >
                            Configurar Tenant
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <ErrorState 
                    title="Error en el Dashboard"
                    description={error}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header del Dashboard */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Dashboard
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Bienvenido al panel de control de {tenant.name}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                <FiCalendar className="h-4 w-4" />
                                <span>{new Date().toLocaleDateString('es-ES', { 
                                    weekday: 'long',
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tenant Info Card */}
                    <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                            <FiGlobe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {tenant.name}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                            {tenant.domain && (
                                                <span className="flex items-center">
                                                    <FiGlobe className="h-3 w-3 mr-1" />
                                                    {tenant.domain}
                                                </span>
                                            )}
                                            <span className="flex items-center">
                                                <FiShield className="h-3 w-3 mr-1" />
                                                Plan {tenant.subscription}
                                            </span>
                                            <span className="flex items-center">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                                Activo
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <div className="text-right">
                                        <div className="font-medium">Usuario: {user?.email}</div>
                                        <div className="flex items-center justify-end mt-1">
                                            <FiShield className="h-3 w-3 mr-1" />
                                            <span className="text-green-600 dark:text-green-400 font-medium">
                                                Administrador
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total de Blogs */}
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total de Blogs
                                    </p>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {isLoadingStats ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            stats.totalBlogs
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {stats.publishedBlogs} publicados, {stats.draftBlogs} borradores
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                    <FiFileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total de Usuarios */}
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Usuarios del Tenant
                                    </p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {isLoadingStats ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            stats.totalUsers
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Usuarios activos
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                    <FiUsers className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Blogs este mes */}
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Este Mes
                                    </p>
                                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                        {isLoadingStats ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            stats.monthlyStats.thisMonth
                                        )}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        {stats.monthlyStats.growth >= 0 ? (
                                            <FiTrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                        ) : (
                                            <FiTrendingUp className="h-3 w-3 text-red-500 mr-1 transform rotate-180" />
                                        )}
                                        <span className={`text-xs font-medium ${
                                            stats.monthlyStats.growth >= 0 
                                                ? 'text-green-600 dark:text-green-400' 
                                                : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {stats.monthlyStats.growth >= 0 ? '+' : ''}{stats.monthlyStats.growth}% vs mes anterior
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                    <FiBarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estado del Sistema */}
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Estado del Sistema
                                    </p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        100%
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Operativo
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                    <FiActivity className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Acciones principales */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FiStar className="h-5 w-5 mr-2 text-yellow-500" />
                            Acciones Principales
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Crear Blog */}
                            <Button
                                as={Link}
                                href="/cms/blogs/create"
                                variant="primary"
                                size="lg"
                                className="h-auto p-6 text-left flex-col items-start space-y-2 group hover:scale-105 transition-transform duration-200"
                                fullWidth
                            >
                                <div className="flex items-center justify-between w-full">
                                    <FiPlusCircle className="h-8 w-8" />
                                    <FiArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">Crear Blog</div>
                                    <div className="text-sm opacity-90">Escribir nuevo contenido</div>
                                </div>
                            </Button>

                            {/* Ver Blogs */}
                            <Button
                                as={Link}
                                href="/cms/blogs"
                                variant="success"
                                size="lg"
                                className="h-auto p-6 text-left flex-col items-start space-y-2 group hover:scale-105 transition-transform duration-200"
                                fullWidth
                            >
                                <div className="flex items-center justify-between w-full">
                                    <FiEye className="h-8 w-8" />
                                    <FiArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">Ver Blogs</div>
                                    <div className="text-sm opacity-90">Gestionar contenido</div>
                                </div>
                            </Button>

                            {/* Gestionar Usuarios */}
                            <Button
                                as={Link}
                                href="/admin/tenants"
                                variant="secondary"
                                size="lg"
                                className="h-auto p-6 text-left flex-col items-start space-y-2 group hover:scale-105 transition-transform duration-200"
                                fullWidth
                            >
                                <div className="flex items-center justify-between w-full">
                                    <FiUsers className="h-8 w-8" />
                                    <FiArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">Usuarios</div>
                                    <div className="text-sm opacity-90">Administrar accesos</div>
                                </div>
                            </Button>

                            {/* Configuración */}
                            <Button
                                as={Link}
                                href="/admin/settings"
                                variant="outline"
                                size="lg"
                                className="h-auto p-6 text-left flex-col items-start space-y-2 group hover:scale-105 transition-transform duration-200"
                                fullWidth
                            >
                                <div className="flex items-center justify-between w-full">
                                    <FiSettings className="h-8 w-8" />
                                    <FiArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">Configuración</div>
                                    <div className="text-sm opacity-90">Ajustes del sistema</div>
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Layout de dos columnas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Blogs Recientes */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center">
                                        <FiClock className="h-5 w-5 mr-2 text-blue-500" />
                                        Blogs Recientes
                                    </span>
                                    <Button
                                        as={Link}
                                        href="/cms/blogs"
                                        variant="outline"
                                        size="sm"
                                    >
                                        Ver todos
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingStats ? (
                                    <LoadingState 
                                        title="Cargando blogs recientes..."
                                        size="sm"
                                    />
                                ) : stats.recentBlogs.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            No hay blogs aún
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Crea tu primer blog para comenzar
                                        </p>
                                        <Button
                                            as={Link}
                                            href="/cms/blogs/create"
                                            variant="primary"
                                        >
                                            Crear primer blog
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {stats.recentBlogs.map((blog) => (
                                            <div 
                                                key={blog.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {blog.title}
                                                    </h4>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        <span className="flex items-center">
                                                            <FiCalendar className="h-3 w-3 mr-1" />
                                                            {blog.createdAt?.toLocaleDateString()}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            blog.status === 'published' 
                                                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                                        }`}>
                                                            {blog.status === 'published' ? 'Publicado' : 'Borrador'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    as={Link}
                                                    href={`/cms/blogs/edit/${blog.id}`}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <FiEdit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Información del Tenant */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FiGlobe className="h-5 w-5 mr-2 text-purple-500" />
                                    Información del Tenant
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                            Detalles Generales
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {tenant.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Dominio:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {tenant.domain || "No configurado"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                                                <span className="font-medium text-purple-600 dark:text-purple-400">
                                                    {tenant.subscription}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Creado:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {tenant.createdAt?.toLocaleDateString() || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                            Configuración
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Sitio:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {tenant.settings?.siteName || "No configurado"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Autor por defecto:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {tenant.settings?.defaultAuthor || "No configurado"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    <div className="pt-2">
                                        <Button
                                            as={Link}
                                            href="/admin/tenants"
                                            variant="outline"
                                            size="sm"
                                            fullWidth
                                        >
                                            <FiSettings className="h-4 w-4 mr-2" />
                                            Administrar Tenant
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CMSDashboard;