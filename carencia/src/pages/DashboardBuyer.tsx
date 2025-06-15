import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, Heart, Search, User, LogOut } from 'lucide-react';

const DashboardBuyer: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Car className="h-8 w-8 text-primary-500" />
                            <span className="text-2xl font-heading font-bold text-gray-900">CarencIA</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Olá, {user?.fullName}</span>
                            <Button variant="ghost" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Sair
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                        Dashboard do Comprador
                    </h1>
                    <p className="text-gray-600">
                        Encontre o carro perfeito com nossa inteligência artificial
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Matches Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-500" />
                                Seus Matches
                            </CardTitle>
                            <CardDescription>
                                Veículos recomendados para você
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">
                                    Conecte suas redes sociais para receber recomendações personalizadas
                                </p>
                                <Button>
                                    Conectar Redes Sociais
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Search Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5 text-blue-500" />
                                Buscar Veículos
                            </CardTitle>
                            <CardDescription>
                                Explore nosso catálogo completo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Button className="w-full">
                                    Buscar por Marca
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Buscar por Preço
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Busca Avançada
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-green-500" />
                                Meu Perfil
                            </CardTitle>
                            <CardDescription>
                                Gerencie suas informações
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tipo de usuário</p>
                                    <p className="font-medium">Comprador</p>
                                </div>
                                <Button variant="outline" className="w-full">
                                    Editar Perfil
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="mt-12">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                        Atividade Recente
                    </h2>

                    <Card>
                        <CardContent className="p-8 text-center">
                            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Nenhuma atividade ainda
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Comece explorando nossos veículos ou conecte suas redes sociais para recomendações personalizadas
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button>
                                    Explorar Veículos
                                </Button>
                                <Button variant="outline">
                                    Conectar Redes Sociais
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default DashboardBuyer; 