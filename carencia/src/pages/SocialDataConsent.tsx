import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, Facebook, Chrome, Instagram, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const SocialDataConsent: React.FC = () => {
    const navigate = useNavigate();
    const { user, loginWithGoogle, loginWithFacebook } = useAuth();
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [consentGiven, setConsentGiven] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const platforms = [
        {
            id: 'facebook',
            name: 'Facebook',
            icon: Facebook,
            description: 'Posts, curtidas, páginas seguidas e interesses',
            color: 'text-blue-600'
        },
        {
            id: 'google',
            name: 'Google',
            icon: Chrome,
            description: 'Perfil básico e interesses de pesquisa',
            color: 'text-red-500'
        },
        {
            id: 'instagram',
            name: 'Instagram',
            icon: Instagram,
            description: 'Posts públicos, hashtags e interações',
            color: 'text-pink-500'
        }
    ];

    const handlePlatformToggle = (platformId: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(id => id !== platformId)
                : [...prev, platformId]
        );
    };

    const handleConnect = async () => {
        if (!consentGiven) {
            toast.error('Você precisa concordar com os termos para continuar');
            return;
        }

        if (selectedPlatforms.length === 0) {
            toast.error('Selecione pelo menos uma plataforma');
            return;
        }

        setIsConnecting(true);

        try {
            // Conectar com as plataformas selecionadas
            for (const platform of selectedPlatforms) {
                if (platform === 'facebook') {
                    await loginWithFacebook();
                } else if (platform === 'google') {
                    await loginWithGoogle();
                }
                // Instagram seria implementado aqui
            }

            toast.success('Redes sociais conectadas com sucesso!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao conectar redes sociais');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleSkip = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Car className="h-10 w-10 text-primary-500" />
                        <span className="text-3xl font-heading font-bold text-gray-900">CarencIA</span>
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                        Melhore seus resultados com mais inteligência
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Ao conectar sua rede, nossa IA entende melhor seus interesses e seu momento.
                        Sua privacidade é respeitada. Tudo 100% seguro, com base na LGPD.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Platform Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Selecione as plataformas</CardTitle>
                            <CardDescription>
                                Escolha quais redes sociais você gostaria de conectar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {platforms.map((platform) => {
                                const Icon = platform.icon;
                                const isSelected = selectedPlatforms.includes(platform.id);

                                return (
                                    <div
                                        key={platform.id}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => handlePlatformToggle(platform.id)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <Icon className={`h-6 w-6 ${platform.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium text-gray-900">{platform.name}</h3>
                                                    {isSelected && (
                                                        <CheckCircle className="h-5 w-5 text-primary-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {platform.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Privacy Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-green-500" />
                                Sua privacidade é nossa prioridade
                            </CardTitle>
                            <CardDescription>
                                Entenda como seus dados são utilizados
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Dados criptografados</p>
                                        <p className="text-sm text-gray-600">
                                            Todas as informações são armazenadas com criptografia de ponta
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Apenas dados públicos</p>
                                        <p className="text-sm text-gray-600">
                                            Coletamos apenas informações que você já tornou públicas
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Controle total</p>
                                        <p className="text-sm text-gray-600">
                                            Você pode desconectar ou excluir seus dados a qualquer momento
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Conformidade LGPD</p>
                                        <p className="text-sm text-gray-600">
                                            Seguimos todas as diretrizes da Lei Geral de Proteção de Dados
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-blue-900">Como usamos seus dados</p>
                                            <p className="text-sm text-blue-700 mt-1">
                                                Analisamos seus interesses e comportamento para recomendar
                                                veículos que realmente combinam com seu perfil e momento de vida.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Consent and Actions */}
                <Card className="mt-8">
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    checked={consentGiven}
                                    onChange={(e) => setConsentGiven(e.target.checked)}
                                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="consent" className="text-sm text-gray-700">
                                    Eu concordo com a coleta e processamento dos meus dados sociais públicos
                                    para fins de recomendação personalizada de veículos. Li e aceito os{' '}
                                    <a href="#" className="text-primary-600 hover:text-primary-500 underline">
                                        Termos de Uso
                                    </a>{' '}
                                    e a{' '}
                                    <a href="#" className="text-primary-600 hover:text-primary-500 underline">
                                        Política de Privacidade
                                    </a>.
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleSkip}
                                    disabled={isConnecting}
                                >
                                    Prefiro continuar assim mesmo
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleConnect}
                                    loading={isConnecting}
                                    disabled={!consentGiven || selectedPlatforms.length === 0 || isConnecting}
                                >
                                    Conectar Redes Selecionadas
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        Você pode gerenciar suas conexões e dados a qualquer momento nas configurações da sua conta
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SocialDataConsent; 