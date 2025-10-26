"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useTenant } from '@/context/TenantContext';
import { 
  createTenant, 
  getTenantById, 
  addUserToTenant, 
  removeUserFromTenant,
  isUserTenantAdmin 
} from '@/lib/tenantService';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tenant, TenantUser, SubscriptionPlan, UserRole } from '@/types';

// Importar componentes UI mejorados
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { LoadingState, ErrorState, NoDataState } from '@/components/ui/EmptyState';
import { useNotifications, NotificationContainer } from '@/components/ui/Notification';
import { useFormValidation, commonRules } from '@/hooks/useFormValidation';
import { FiUsers, FiSettings, FiPlus, FiTrash2, FiCheck, FiX, FiEdit } from 'react-icons/fi';

const TenantAdminPanel: React.FC = () => {
  const { user, isAdmin, loading } = useAdminAuth();
  const { tenant, switchTenant } = useTenant();
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();
  
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantUsers, setTenantUsers] = useState<TenantUser[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string>('');

  // Estados para crear nuevo tenant
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Validación para formulario de tenant
  const tenantValidation = useFormValidation(
    {
      name: '',
      domain: '',
      subscription: SubscriptionPlan.FREE
    },
    {
      name: commonRules.tenantName,
      domain: { 
        pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/,
        custom: (value: string) => {
          if (value && !/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/.test(value)) {
            return 'Ingresa un dominio válido (ej: ejemplo.com)';
          }
          return null;
        }
      }
    }
  );

  // Estados para agregar usuario
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  // Validación para formulario de usuario
  const userValidation = useFormValidation(
    {
      email: '',
      name: '',
      role: UserRole.EDITOR
    },
    {
      email: commonRules.email,
      name: commonRules.authorName
    }
  );

  useEffect(() => {
    if (user && isAdmin) {
      loadTenants();
    }
  }, [user, isAdmin]);

  const loadTenants = async () => {
    try {
      setIsLoadingTenants(true);
      // Por ahora, solo cargamos el tenant "default"
      // En el futuro, aquí podrías cargar todos los tenants del usuario
      const defaultTenant = await getTenantById('default');
      if (defaultTenant) {
        setTenants([defaultTenant]);
        setSelectedTenant(defaultTenant);
        await loadTenantUsers('default');
      }
    } catch (error) {
      console.error('Error loading tenants:', error);
      setError('Error al cargar los tenants');
    } finally {
      setIsLoadingTenants(false);
    }
  };

  const loadTenantUsers = async (tenantId: string) => {
    try {
      setIsLoadingUsers(true);
      const usersSnapshot = await getDocs(collection(db, 'tenants', tenantId, 'users'));
      const users: TenantUser[] = [];
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        users.push({
          id: userDoc.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          tenantId: userData.tenantId,
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastLoginAt: userData.lastLoginAt?.toDate() || null,
        });
      }
      
      setTenantUsers(users);
    } catch (error) {
      console.error('Error loading tenant users:', error);
      setError('Error al cargar usuarios del tenant');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!tenantValidation.validateAllFields()) {
      showError('Error de validación', 'Por favor, corrige los errores en el formulario');
      return;
    }

    setIsCreating(true);

    try {
      const tenantData = {
        name: tenantValidation.fields.name.value.trim(),
        domain: tenantValidation.fields.domain.value.trim() || 
               `${tenantValidation.fields.name.value.toLowerCase().replace(/\s+/g, '-')}.local`,
        adminEmail: user.email || '',
        adminName: user.displayName || 'Admin',
      };

      const tenantId = await createTenant(user.uid, tenantData);
      await addUserToTenant(tenantId, user.uid, {
        email: user.email || '',
        name: user.displayName || 'Admin',
        role: UserRole.ADMIN,
      });
      
      showSuccess('Tenant creado', 'El tenant se ha creado exitosamente');
      setShowCreateForm(false);
      tenantValidation.resetForm();
      await loadTenants();
    } catch (error) {
      console.error('Error creating tenant:', error);
      showError('Error al crear tenant', 'No se pudo crear el tenant. Inténtalo de nuevo.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTenant) return;

    if (!userValidation.validateAllFields()) {
      showError('Error de validación', 'Por favor, corrige los errores en el formulario');
      return;
    }

    setIsAddingUser(true);

    try {
      // En un escenario real, aquí buscarías el usuario por email
      const userId = `user_${Date.now()}`;
      
      await addUserToTenant(
        selectedTenant.id, 
        userId, 
        {
          email: userValidation.fields.email.value.trim(),
          name: userValidation.fields.name.value.trim(),
          role: userValidation.fields.role.value as UserRole,
        }
      );
      
      showSuccess('Usuario agregado', 'El usuario se ha agregado exitosamente al tenant');
      setShowAddUserForm(false);
      userValidation.resetForm();
      await loadTenantUsers(selectedTenant.id);
    } catch (error) {
      console.error('Error adding user:', error);
      showError('Error al agregar usuario', 'No se pudo agregar el usuario. Inténtalo de nuevo.');
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleRemoveUser = async (userId: string, userName: string) => {
    if (!selectedTenant) return;

    if (!confirm(`¿Estás seguro de que deseas eliminar a ${userName} del tenant?`)) {
      return;
    }

    try {
      await removeUserFromTenant(selectedTenant.id, userId);
      showSuccess('Usuario eliminado', `${userName} ha sido eliminado del tenant`);
      await loadTenantUsers(selectedTenant.id);
    } catch (error) {
      console.error('Error removing user:', error);
      showError('Error al eliminar usuario', 'No se pudo eliminar el usuario. Inténtalo de nuevo.');
    }
  };

  if (loading || isLoadingTenants) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingState 
          title="Cargando panel de administración"
          description="Verificando permisos y cargando datos del tenant..."
          size="lg"
        />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent>
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No tienes permisos para acceder al panel de administración de tenants.
            </p>
            <div className="space-y-3">
              <Button 
                as={Link}
                href="/cms/blogs/dashboard" 
                variant="primary"
                fullWidth
              >
                Ir al Dashboard
              </Button>
              <Button 
                as={Link}
                href="/admin/debug" 
                variant="outline"
                fullWidth
              >
                Ver información de debug
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Panel de Administración de Tenants
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona tenants, usuarios y permisos del sistema multitenant
            </p>
          </div>

          {error && (
            <ErrorState 
              title="Error en el panel"
              description={error}
              onRetry={() => {
                setError('');
                loadTenants();
              }}
              className="mb-8"
            />
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Tenants Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FiSettings className="text-blue-500" />
                      Tenants
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Administra los tenants del sistema
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    variant={showCreateForm ? "outline" : "primary"}
                    leftIcon={showCreateForm ? <FiX /> : <FiPlus />}
                  >
                    {showCreateForm ? 'Cancelar' : 'Nuevo Tenant'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {showCreateForm && (
                  <Card className="mb-6" padding="sm">
                    <CardContent>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Crear Nuevo Tenant
                      </h3>
                      <form onSubmit={handleCreateTenant} className="space-y-4">
                        <Input
                          {...tenantValidation.getFieldProps('name')}
                          label="Nombre del Tenant"
                          placeholder="Mi empresa"
                          fullWidth
                          required
                        />
                        
                        <Input
                          {...tenantValidation.getFieldProps('domain')}
                          label="Dominio (opcional)"
                          placeholder="miempresa.com"
                          helperText="Si no especificas uno, se generará automáticamente"
                          fullWidth
                        />
                        
                        <Select
                          label="Plan de Suscripción"
                          value={tenantValidation.fields.subscription.value}
                          onChange={(e) => tenantValidation.updateField('subscription', e.target.value)}
                          fullWidth
                          options={[
                            { value: SubscriptionPlan.FREE, label: 'Free - Hasta 10 blogs' },
                            { value: SubscriptionPlan.STARTER, label: 'Starter - Hasta 100 blogs' },
                            { value: SubscriptionPlan.PRO, label: 'Pro - Hasta 1000 blogs' },
                            { value: SubscriptionPlan.ENTERPRISE, label: 'Enterprise - Ilimitado' }
                          ]}
                        />
                        
                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            onClick={() => {
                              setShowCreateForm(false);
                              tenantValidation.resetForm();
                            }}
                            variant="outline"
                            fullWidth
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            loading={isCreating}
                            disabled={!tenantValidation.isFormValid}
                            fullWidth
                          >
                            Crear Tenant
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Lista de Tenants */}
                <div className="space-y-3">
                  {tenants.length === 0 ? (
                    <NoDataState
                      resource="tenants"
                      description="Aún no tienes tenants configurados. Crea tu primer tenant para comenzar."
                      onCreateNew={() => setShowCreateForm(true)}
                      createLabel="Crear primer tenant"
                    />
                  ) : (
                    tenants.map((t) => (
                      <Card
                        key={t.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedTenant?.id === t.id
                            ? 'ring-2 ring-blue-500 border-blue-200 dark:border-blue-700'
                            : 'hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        padding="sm"
                        onClick={() => {
                          setSelectedTenant(t);
                          loadTenantUsers(t.id);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              {t.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {t.domain || 'Sin dominio configurado'}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                                {t.subscription}
                              </span>
                              {selectedTenant?.id === t.id && (
                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                  Seleccionado
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                switchTenant(t.id);
                                showSuccess('Tenant cambiado', `Ahora estás trabajando en: ${t.name}`);
                              }}
                            >
                              Seleccionar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Users Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FiUsers className="text-green-500" />
                      Usuarios {selectedTenant && `- ${selectedTenant.name}`}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedTenant 
                        ? 'Administra los usuarios de este tenant'
                        : 'Selecciona un tenant para ver sus usuarios'
                      }
                    </p>
                  </div>
                  {selectedTenant && (
                    <Button
                      onClick={() => setShowAddUserForm(!showAddUserForm)}
                      variant={showAddUserForm ? "outline" : "success"}
                      leftIcon={showAddUserForm ? <FiX /> : <FiPlus />}
                    >
                      {showAddUserForm ? 'Cancelar' : 'Agregar Usuario'}
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {selectedTenant && showAddUserForm && (
                  <Card className="mb-6" padding="sm">
                    <CardContent>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Agregar Usuario al Tenant
                      </h3>
                      <form onSubmit={handleAddUser} className="space-y-4">
                        <Input
                          {...userValidation.getFieldProps('email')}
                          type="email"
                          label="Email del Usuario"
                          placeholder="usuario@empresa.com"
                          fullWidth
                          required
                        />
                        
                        <Input
                          {...userValidation.getFieldProps('name')}
                          label="Nombre Completo"
                          placeholder="Juan Pérez"
                          fullWidth
                          required
                        />
                        
                        <Select
                          label="Rol"
                          value={userValidation.fields.role.value}
                          onChange={(e) => userValidation.updateField('role', e.target.value)}
                          fullWidth
                          options={[
                            { value: UserRole.VIEWER, label: 'Viewer - Solo lectura' },
                            { value: UserRole.EDITOR, label: 'Editor - Crear y editar contenido' },
                            { value: UserRole.ADMIN, label: 'Admin - Control total del tenant' }
                          ]}
                        />
                        
                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            onClick={() => {
                              setShowAddUserForm(false);
                              userValidation.resetForm();
                            }}
                            variant="outline"
                            fullWidth
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            loading={isAddingUser}
                            disabled={!userValidation.isFormValid}
                            variant="success"
                            fullWidth
                          >
                            Agregar Usuario
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Lista de Usuarios */}
                {selectedTenant ? (
                  <div className="space-y-3">
                    {isLoadingUsers ? (
                      <LoadingState 
                        title="Cargando usuarios"
                        description="Obteniendo la lista de usuarios del tenant..."
                        size="sm"
                      />
                    ) : tenantUsers.length === 0 ? (
                      <NoDataState
                        resource="usuarios"
                        description="Este tenant aún no tiene usuarios asignados. Agrega el primer usuario para comenzar."
                        onCreateNew={() => setShowAddUserForm(true)}
                        createLabel="Agregar primer usuario"
                      />
                    ) : (
                      tenantUsers.map((user) => {
                        const roleColors = {
                          [UserRole.ADMIN]: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
                          [UserRole.SUPER_ADMIN]: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
                          [UserRole.EDITOR]: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
                          [UserRole.VIEWER]: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
                        };

                        return (
                          <Card key={user.id} padding="sm">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                  {user.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {user.email}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <span className={`inline-block px-2 py-1 text-xs rounded ${roleColors[user.role]}`}>
                                    {user.role}
                                  </span>
                                  {user.lastLoginAt && (
                                    <span className="text-xs text-gray-500">
                                      Último acceso: {user.lastLoginAt.toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleRemoveUser(user.id, user.name)}
                                leftIcon={<FiTrash2 />}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Selecciona un tenant
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Elige un tenant de la izquierda para ver y administrar sus usuarios
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Button
              as={Link}
              href="/cms/blogs/dashboard"
              variant="secondary"
              leftIcon={<FiCheck />}
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        position="top-right"
      />
    </>
  );
};

export default TenantAdminPanel;