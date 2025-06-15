import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, Users, TrendingUp, Plus, LogOut, BarChart3 } from 'lucide-react';

const DashboardDealership: React.FC = () => {
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
                        Dashboard da Concessionária
                    </h1>
                    <p className="text-gray-600">
                        Gerencie seus veículos e leads qualificados
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total de Veículos</p>
                                    <p className="text-2xl font-bold text-gray-900">0</p>
                                </div>
                                <Car className="h-8 w-8 text-primary-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Leads Ativos</p>
                                    <p className="text-2xl font-bold text-gray-900">0</p>
                                </div>
                                <Users className="h-8 w-8 text-secondary-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Vendas Este Mês</p>
                                    <p className="text-2xl font-bold text-gray-900">0</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-accent-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                                    <p className="text-2xl font-bold text-gray-900">0%</p>
                                </div>
                                <BarChart3 className="h-8 w-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Vehicle Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="h-5 w-5 text-primary-500" />
                                Gestão de Veículos
                            </CardTitle>
                            <CardDescription>
                                Adicione e gerencie seu estoque
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Nenhum veículo cadastrado
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Comece adicionando seus primeiros veículos ao catálogo
                                </p>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Adicionar Veículo
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leads Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-secondary-500" />
                                Leads Qualificados
                            </CardTitle>
                            <CardDescription>
                                Compradores interessados em seus veículos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Nenhum lead ainda
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Adicione veículos para começar a receber leads qualificados
                                </p>
                                <Button variant="outline">
                                    Ver Configurações
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                        Analytics e Relatórios
                    </h2>

                    <Card>
                        <CardContent className="p-8 text-center">
                            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Dados insuficientes para análise
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Adicione veículos e comece a receber leads para ver suas métricas de performance
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button>
                                    Adicionar Primeiro Veículo
                                </Button>
                                <Button variant="outline">
                                    Configurar Perfil
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default DashboardDealership; 