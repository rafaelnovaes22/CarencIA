import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, CheckCircle } from 'lucide-react';

const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleComplete = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Car className="h-10 w-10 text-primary-500" />
                        <span className="text-3xl font-heading font-bold text-gray-900">CarencIA</span>
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                        Bem-vindo à CarencIA!
                    </h1>
                    <p className="text-gray-600">
                        Vamos configurar sua conta para uma experiência personalizada
                    </p>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Configuração Inicial</CardTitle>
                        <CardDescription>
                            Sua conta foi criada com sucesso como {user?.userType === 'buyer' ? 'Comprador' : 'Concessionária'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="font-medium text-green-900">Conta criada</p>
                                    <p className="text-sm text-green-700">Seu perfil básico foi configurado</p>
                                </div>
                            </div>

                            {user?.userType === 'buyer' ? (
                                <>
                                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-blue-900">Próximo: Conectar redes sociais</p>
                                            <p className="text-sm text-blue-700">Para recomendações mais precisas</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                        <div>
                                            <p className="font-medium text-gray-700">Definir preferências</p>
                                            <p className="text-sm text-gray-600">Orçamento, marcas favoritas, etc.</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-blue-900">Próximo: Completar perfil</p>
                                            <p className="text-sm text-blue-700">Informações da empresa e CNPJ</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                        <div>
                                            <p className="font-medium text-gray-700">Adicionar veículos</p>
                                            <p className="text-sm text-gray-600">Cadastre seu primeiro estoque</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="pt-6 border-t">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleComplete}
                                >
                                    Pular por agora
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => navigate('/social-data-consent')}
                                >
                                    {user?.userType === 'buyer' ? 'Conectar Redes Sociais' : 'Completar Perfil'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        Você pode configurar essas opções a qualquer momento no seu dashboard
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage; 