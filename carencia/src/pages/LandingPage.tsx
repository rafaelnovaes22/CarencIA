import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import {
    Car,
    Users,
    TrendingUp,
    Shield,
    Star,
    CheckCircle,
    ArrowRight,
    Facebook,
    Chrome,
    Zap,
    Target,
    BarChart3,
    HeadphonesIcon
} from 'lucide-react';
import { QuizAnswer, LifestyleCategory, UrgencyLevel } from '../lib/types';

interface LandingPageProps {
    onGetStarted: (userType: 'buyer' | 'dealership') => void;
    onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
    const [currentQuizStep, setCurrentQuizStep] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
    const [showQuizResult, setShowQuizResult] = useState(false);

    const quizQuestions = [
        {
            question: "Qual seu estilo de vida?",
            options: [
                { value: "urbano", label: "Urbano" },
                { value: "familia", label: "Família" },
                { value: "aventureiro", label: "Aventureiro" },
                { value: "executivo", label: "Executivo" }
            ]
        },
        {
            question: "Em quanto tempo quer trocar de carro?",
            options: [
                { value: "imediatamente", label: "Imediatamente" },
                { value: "3_meses", label: "3 meses" },
                { value: "6_meses", label: "6 meses" },
                { value: "pesquisando", label: "Pesquisando" }
            ]
        },
        {
            question: "Já tem carro atualmente?",
            options: [
                { value: "sim_trocar", label: "Sim, quero trocar" },
                { value: "sim_segundo", label: "Sim, quero um segundo" },
                { value: "nao_primeiro", label: "Não, será meu primeiro" },
                { value: "tive_vendi", label: "Tive, mas vendi" }
            ]
        }
    ];

    const handleQuizAnswer = (answer: string) => {
        const newAnswer: QuizAnswer = {
            question: quizQuestions[currentQuizStep].question,
            answer
        };

        const updatedAnswers = [...quizAnswers, newAnswer];
        setQuizAnswers(updatedAnswers);

        if (currentQuizStep < quizQuestions.length - 1) {
            setCurrentQuizStep(currentQuizStep + 1);
        } else {
            setShowQuizResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuizStep(0);
        setQuizAnswers([]);
        setShowQuizResult(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Car className="h-8 w-8 text-primary-500" />
                            <span className="text-2xl font-heading font-bold text-gray-900">CarencIA</span>
                        </div>

                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#como-funciona" className="text-gray-600 hover:text-primary-500 transition-colors">
                                Como Funciona
                            </a>
                            <a href="#concessionarias" className="text-gray-600 hover:text-primary-500 transition-colors">
                                Para Concessionárias
                            </a>
                            <a href="#contato" className="text-gray-600 hover:text-primary-500 transition-colors">
                                Contato
                            </a>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" onClick={onLogin}>
                                Entrar
                            </Button>
                            <Button onClick={() => onGetStarted('buyer')}>
                                Cadastrar
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="gradient-bg py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
                        Transformamos desejo em direção com{' '}
                        <span className="text-primary-500">inteligência</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Com nossa IA, você encontra o carro certo, no momento certo — baseado no que você realmente quer.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Button size="lg" onClick={() => onGetStarted('buyer')} className="text-lg px-8 py-4">
                            Quero Encontrar Meu Carro Ideal
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => onGetStarted('dealership')}
                            className="text-lg px-8 py-4"
                        >
                            Sou Concessionária e Quero Vender Mais
                        </Button>
                    </div>
                </div>
            </section>

            {/* Mini Quiz */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        {!showQuizResult ? (
                            <Card className="p-8">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl mb-2">
                                        {quizQuestions[currentQuizStep].question}
                                    </CardTitle>
                                    <CardDescription>
                                        Pergunta {currentQuizStep + 1} de {quizQuestions.length}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {quizQuestions[currentQuizStep].options.map((option) => (
                                            <Button
                                                key={option.value}
                                                variant="outline"
                                                className="p-6 h-auto text-left justify-start"
                                                onClick={() => handleQuizAnswer(option.value)}
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="p-8 text-center">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-secondary-500 mb-4">
                                        Temos boas ideias para você!
                                    </CardTitle>
                                    <CardDescription className="text-lg">
                                        Mas podemos ser ainda mais certeiros.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <Button
                                        size="lg"
                                        onClick={() => onGetStarted('buyer')}
                                        className="mb-4"
                                    >
                                        Conecte sua Rede para um Match mais Preciso
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        onClick={resetQuiz}
                                        className="ml-4"
                                    >
                                        Refazer Quiz
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </section>

            {/* Integração Social */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6">
                        Melhore seus resultados com mais inteligência
                    </h2>

                    <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
                        Ao conectar sua rede, nossa IA entende melhor seus interesses e seu momento.
                        Sua privacidade é respeitada. Tudo 100% seguro, com base na LGPD.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Button size="lg" className="flex items-center gap-2">
                            <Facebook className="h-5 w-5" />
                            Conectar com Facebook
                        </Button>
                        <Button size="lg" variant="outline" className="flex items-center gap-2">
                            <Chrome className="h-5 w-5" />
                            Conectar com Google
                        </Button>
                    </div>

                    <Button variant="ghost" size="lg">
                        Prefiro continuar assim mesmo
                    </Button>
                </div>
            </section>

            {/* Recomendações Personalizadas */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-heading font-bold text-center text-gray-900 mb-12">
                        Recomendações Personalizadas
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                brand: "Honda HR-V",
                                price: "R$ 125.000",
                                match: "95%",
                                reason: "Você pesquisa modelos econômicos e curte SUVs urbanos — este carro combina com seu estilo.",
                                image: "/api/placeholder/300/200"
                            },
                            {
                                brand: "Toyota Corolla",
                                price: "R$ 98.000",
                                match: "92%",
                                reason: "Baseado no seu perfil executivo e necessidade de confiabilidade para trabalho.",
                                image: "/api/placeholder/300/200"
                            },
                            {
                                brand: "Jeep Compass",
                                price: "R$ 145.000",
                                match: "88%",
                                reason: "Seu interesse por aventura e viagens em família indica este SUV robusto.",
                                image: "/api/placeholder/300/200"
                            }
                        ].map((car, index) => (
                            <Card key={index} className="overflow-hidden">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <Car className="h-16 w-16 text-gray-400" />
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-heading font-semibold text-lg">{car.brand}</h3>
                                        <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-sm font-medium">
                                            {car.match} match
                                        </span>
                                    </div>

                                    <p className="text-2xl font-bold text-primary-500 mb-3">{car.price}</p>

                                    <p className="text-gray-600 text-sm mb-4">{car.reason}</p>

                                    <Button className="w-full">
                                        Ver Detalhes
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-heading font-bold text-primary-500 mb-2">10.000+</div>
                            <div className="text-gray-600">Compradores conectados</div>
                        </div>
                        <div>
                            <div className="text-4xl font-heading font-bold text-primary-500 mb-2">500+</div>
                            <div className="text-gray-600">Concessionárias parceiras</div>
                        </div>
                        <div>
                            <div className="text-4xl font-heading font-bold text-primary-500 mb-2">95%</div>
                            <div className="text-gray-600">Taxa de conversão</div>
                        </div>
                        <div>
                            <div className="text-4xl font-heading font-bold text-primary-500 mb-2">R$ 50M+</div>
                            <div className="text-gray-600">Em vendas geradas</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção Concessionárias */}
            <section id="concessionarias" className="py-16 bg-gray-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-heading font-bold mb-6">
                        Potencialize suas vendas com inteligência real
                    </h2>

                    <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                        Gere leads qualificados automaticamente. Conecte-se com quem realmente quer comprar.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" onClick={() => onGetStarted('dealership')}>
                            Quero Gerar Leads
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                            Agendar Demonstração
                        </Button>
                    </div>
                </div>
            </section>

            {/* Oferta Teste Grátis */}
            <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-heading font-bold mb-6">
                        Teste Grátis por 30 Dias — Sem compromisso
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div className="flex flex-col items-center">
                            <Zap className="h-12 w-12 mb-4" />
                            <h3 className="font-semibold mb-2">Setup gratuito</h3>
                            <p className="text-sm opacity-90">Configuração completa sem custo</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Target className="h-12 w-12 mb-4" />
                            <h3 className="font-semibold mb-2">Primeiros 1.000 leads grátis</h3>
                            <p className="text-sm opacity-90">Leads qualificados sem pagar</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <BarChart3 className="h-12 w-12 mb-4" />
                            <h3 className="font-semibold mb-2">Dashboard métricas</h3>
                            <p className="text-sm opacity-90">Analytics completo incluído</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <HeadphonesIcon className="h-12 w-12 mb-4" />
                            <h3 className="font-semibold mb-2">Suporte 24/7</h3>
                            <p className="text-sm opacity-90">Ajuda sempre disponível</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-500">
                            Começar Agora
                        </Button>
                        <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                            Falar com Especialista
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-6">
                                <Car className="h-8 w-8 text-primary-500" />
                                <span className="text-2xl font-heading font-bold">CarencIA</span>
                            </div>

                            <p className="text-gray-300 mb-6 max-w-md">
                                Na CarencIA, tecnologia entende sentimento. Unimos inteligência artificial e empatia
                                para transformar desejo em direção.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold mb-4">Soluções</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white transition-colors">Para Compradores</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Para Concessionárias</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold mb-4">Institucional</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Imprensa</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm">
                                © 2024 CarencIA. Todos os direitos reservados.
                            </p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Política de Privacidade
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Termos de Uso
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    LGPD
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 