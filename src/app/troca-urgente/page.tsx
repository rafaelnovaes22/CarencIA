'use client'

import { LandingPageLayout } from '@/components/LandingPageLayout'
import { FormularioTroca } from '@/components/FormularioTroca'

export default function TrocaUrgentePage() {
    // Hero Section
    const heroSection = (
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div className="text-center lg:text-left">
                <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    🚨 Atendimento prioritário
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    Seu carro novo{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                        hoje mesmo
                    </span>
                    , sem dor de cabeça
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    <strong>Aceitamos seu usado na troca e facilitamos a aprovação.</strong><br />
                    Não dá mais para esperar? Nós resolvemos em até 48 horas!
                </p>

                {/* Benefícios em destaque */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-bold">⚡</span>
                        </div>
                        <span className="text-gray-700 font-medium">Processo ultra-rápido</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold">✅</span>
                        </div>
                        <span className="text-gray-700 font-medium">Aceitamos seu usado</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">🚗</span>
                        </div>
                        <span className="text-gray-700 font-medium">Carros disponíveis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 font-bold">💰</span>
                        </div>
                        <span className="text-gray-700 font-medium">Aprovação facilitada</span>
                    </div>
                </div>

                {/* CTA Button */}
                <a
                    href="#formulario"
                    className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    🚨 Simular agora minha troca urgente
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </a>
            </div>

            {/* Imagem */}
            <div className="relative">
                <div className="relative bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-8 lg:p-12">
                    {/* Placeholder para imagem - substituir por imagem real */}
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-400 text-6xl">
                        🔄
                    </div>

                    {/* Elementos decorativos */}
                    <div className="absolute -top-4 -right-4 bg-red-400 text-red-900 px-4 py-2 rounded-full font-bold transform rotate-12">
                        URGENTE!
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-orange-400 text-orange-900 px-4 py-2 rounded-full font-bold transform -rotate-12">
                        Troca em 48h
                    </div>
                </div>
            </div>
        </div>
    )

    // Form Section
    const formSection = (
        <div id="formulario">
            <FormularioTroca />
        </div>
    )

    // Benefits Section
    const benefitsSection = (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Por que escolher nossa troca urgente?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
                Quando não dá mais para esperar, nós temos a solução mais rápida:
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Avaliação em 2 horas</h3>
                    <p className="text-gray-600">
                        Enviamos nosso avaliador até você para dar o melhor preço pelo seu usado na hora.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">🚗</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Estoque disponível</h3>
                    <p className="text-gray-600">
                        Carros prontos para sair. Não precisa esperar chegada ou preparação.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Aprovação em 24h</h3>
                    <p className="text-gray-600">
                        Processo de crédito acelerado para casos urgentes. Sem burocracia.
                    </p>
                </div>
            </div>

            {/* Timeline urgente */}
            <div className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Como funciona nossa troca urgente:</h3>

                <div className="grid md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-red-600">1</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Envie seus dados</h4>
                        <p className="text-sm text-gray-600">Preencha o formulário com informações do seu carro atual</p>
                        <p className="text-xs text-red-600 mt-2 font-bold">2 minutos</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-orange-600">2</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Avaliação express</h4>
                        <p className="text-sm text-gray-600">Nosso avaliador vai até você ou você vem aqui</p>
                        <p className="text-xs text-orange-600 mt-2 font-bold">Até 2 horas</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-blue-600">3</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Escolha seu novo carro</h4>
                        <p className="text-sm text-gray-600">Seleção de carros disponíveis para entrega imediata</p>
                        <p className="text-xs text-blue-600 mt-2 font-bold">1 hora</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-green-600">4</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Documentação e entrega</h4>
                        <p className="text-sm text-gray-600">Finalização rápida e você sai dirigindo</p>
                        <p className="text-xs text-green-600 mt-2 font-bold">Máximo 48h</p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="bg-white rounded-lg p-6 shadow-lg inline-block">
                        <p className="text-sm text-gray-600 mb-2">Tempo total do processo:</p>
                        <p className="text-3xl font-bold text-red-600">24-48 horas</p>
                        <p className="text-sm text-gray-500 mt-2">Do primeiro contato até você sair dirigindo</p>
                    </div>
                </div>
            </div>

            {/* Situações de urgência */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Quando nossa troca urgente é ideal:</h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-red-50 p-6 rounded-xl text-center">
                        <div className="text-3xl mb-3">🔧</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Carro quebrou</h4>
                        <p className="text-sm text-gray-600">Motor fundiu, câmbio quebrou ou não liga mais</p>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-xl text-center">
                        <div className="text-3xl mb-3">💼</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Precisa para trabalhar</h4>
                        <p className="text-sm text-gray-600">Uber, delivery, vendas - sem carro = sem renda</p>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-xl text-center">
                        <div className="text-3xl mb-3">🚨</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Acidente</h4>
                        <p className="text-sm text-gray-600">Bateu, seguro não cobre ou perda total</p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-xl text-center">
                        <div className="text-3xl mb-3">👶</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Mudança familiar</h4>
                        <p className="text-sm text-gray-600">Bebê chegando, mudança de cidade urgente</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl text-center">
                        <div className="text-3xl mb-3">💰</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Gastos excessivos</h4>
                        <p className="text-sm text-gray-600">Manutenção cara demais, não compensa mais</p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl text-center">
                        <div className="text-3xl mb-3">⏰</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Oportunidade única</h4>
                        <p className="text-sm text-gray-600">Oferta especial que não pode esperar</p>
                    </div>
                </div>
            </div>

            {/* Depoimentos de troca urgente */}
            <div className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Quem já resolveu na urgência:</h3>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">
                                C
                            </div>
                            <div>
                                <div className="font-semibold">Carlos - Motorista Uber</div>
                                <div className="text-sm text-gray-500">Carro quebrou na segunda, saiu dirigindo na quarta</div>
                            </div>
                        </div>
                        <p className="text-gray-700 italic">
                            &ldquo;Meu Corsa fundiu o motor. Em 36 horas já estava com meu HB20 novo. Não perdi nem 2 dias de trabalho. Salvaram minha vida!&rdquo;
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold mr-4">
                                M
                            </div>
                            <div>
                                <div className="font-semibold">Maria - Mãe de família</div>
                                <div className="text-sm text-gray-500">Precisava buscar filhos na escola</div>
                            </div>
                        </div>
                        <p className="text-gray-700 italic">
                            &ldquo;Bateram no meu carro. Com bebê pequeno, não podia ficar sem. Em 1 dia avaliaram e no outro já estava com o novo. Processo incrível!&rdquo;
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

    // Footer CTA
    const footerCTA = (
        <div>
            <h2 className="text-3xl font-bold mb-4">
                Não dá mais para esperar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
                Mais de 400 trocas urgentes realizadas em 2024
            </p>
            <a
                href="#formulario"
                className="inline-flex items-center bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
                🚨 Resolver minha urgência agora
            </a>
        </div>
    )

    return (
        <LandingPageLayout
            heroSection={heroSection}
            formSection={formSection}
            benefitsSection={benefitsSection}
            footerCTA={footerCTA}
        >
            {/* Head metadata */}
            <head>
                <title>Troca Urgente - Seu carro novo hoje mesmo sem dor de cabeça | CarencIA</title>
                <meta
                    name="description"
                    content="Troca urgente em até 48h! Aceitamos seu usado, aprovação rápida e carros disponíveis. Quebrou? Bateu? Nós resolvemos!"
                />
                <meta name="keywords" content="troca urgente, carro quebrou, aprovação rápida, aceita usado, emergência" />

                {/* Open Graph para redes sociais */}
                <meta property="og:title" content="Troca Urgente - Carro novo em 48h" />
                <meta property="og:description" content="Não dá mais para esperar? Troca urgente com avaliação em 2h e entrega em 48h!" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/images/troca-urgente-social.jpg" />

                {/* Schema.org para SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AutomotiveBusiness",
                        "name": "CarencIA - Troca Urgente",
                        "description": "Especialista em troca urgente de veículos em 48h",
                        "url": "https://carencia.com.br/troca-urgente",
                        "telephone": "+55-11-94076-3330",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "São Paulo",
                            "addressRegion": "SP",
                            "addressCountry": "BR"
                        }
                    })}
                </script>
            </head>
        </LandingPageLayout>
    )
} 