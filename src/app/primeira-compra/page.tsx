'use client'

import { LandingPageLayout } from '@/components/LandingPageLayout'
import { FormularioJovens } from '@/components/FormularioJovens'

export default function PrimeiraCompraPage() {
    // Hero Section
    const heroSection = (
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div className="text-center lg:text-left">
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    🎯 Especial para jovens de 20-28 anos
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    Chegou a hora do seu{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                        primeiro carro!
                    </span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    <strong>Parcelas que cabem no seu bolso.</strong><br />
                    Simule agora mesmo e conquiste sua liberdade sobre rodas.
                </p>

                {/* Benefícios em destaque */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold">💰</span>
                        </div>
                        <span className="text-gray-700 font-medium">Parcelas reduzidas</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">✅</span>
                        </div>
                        <span className="text-gray-700 font-medium">Aprovação facilitada</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-bold">⛽</span>
                        </div>
                        <span className="text-gray-700 font-medium">Carros econômicos</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 font-bold">🎓</span>
                        </div>
                        <span className="text-gray-700 font-medium">Condições especiais</span>
                    </div>
                </div>

                {/* CTA Button */}
                <a
                    href="#formulario"
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    🎉 Quero simular agora
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </a>
            </div>

            {/* Imagem */}
            <div className="relative">
                <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8 lg:p-12">
                    {/* Placeholder para imagem - substituir por imagem real */}
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-400 text-6xl">
                        🚗
                    </div>

                    {/* Elementos decorativos */}
                    <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold transform rotate-12">
                        1º Carro!
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 px-4 py-2 rounded-full font-bold transform -rotate-12">
                        Parcelas de R$ 399
                    </div>
                </div>
            </div>
        </div>
    )

    // Form Section
    const formSection = (
        <div id="formulario">
            <FormularioJovens />
        </div>
    )

    // Benefits Section
    const benefitsSection = (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Por que escolher a CarencIA para sua primeira compra?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
                Entendemos que comprar o primeiro carro é um momento especial. Por isso, oferecemos:
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">💸</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Parcelas que cabem no bolso</h3>
                    <p className="text-gray-600">
                        Simulações personalizadas com parcelas a partir de R$ 399/mês para jovens trabalhadores.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Aprovação facilitada</h3>
                    <p className="text-gray-600">
                        Processo simplificado para jovens, mesmo sem histórico de crédito extenso.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">⛽</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Carros econômicos</h3>
                    <p className="text-gray-600">
                        Seleção especial de veículos econômicos, ideais para quem está começando.
                    </p>
                </div>
            </div>

            {/* Depoimentos sociais */}
            <div className="mt-16 bg-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">O que outros jovens estão dizendo:</h3>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                                M
                            </div>
                            <div>
                                <div className="font-semibold">Mariana, 23 anos</div>
                                <div className="text-sm text-gray-500">Assistente Administrativa</div>
                            </div>
                        </div>
                        <p className="text-gray-700 italic">
                            &ldquo;Consegui meu primeiro carro com parcelas de R$ 420! Agora não dependo mais de ninguém para ir trabalhar. Liberdade total!&rdquo;
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                                R
                            </div>
                            <div>
                                <div className="font-semibold">Rafael, 26 anos</div>
                                <div className="text-sm text-gray-500">Vendedor</div>
                            </div>
                        </div>
                        <p className="text-gray-700 italic">
                            &ldquo;Processo super rápido! Em 2 dias já estava com meu HB20. A equipe entendeu perfeitamente o que eu precisava.&rdquo;
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
                Pronto para conquistar sua liberdade?
            </h2>
            <p className="text-xl mb-8 opacity-90">
                Mais de 2.500 jovens já realizaram o sonho do primeiro carro conosco
            </p>
            <a
                href="#formulario"
                className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
                🎯 Simular meu primeiro carro
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
                <title>Primeira Compra - Seu primeiro carro com parcelas que cabem no bolso | CarencIA</title>
                <meta
                    name="description"
                    content="Conquistar seu primeiro carro nunca foi tão fácil! Parcelas a partir de R$ 399, aprovação facilitada para jovens de 20-28 anos. Simule agora!"
                />
                <meta name="keywords" content="primeiro carro, jovem, financiamento facilitado, parcelas baixas, aprovação rápida" />

                {/* Open Graph para redes sociais */}
                <meta property="og:title" content="Seu Primeiro Carro - Parcelas que cabem no bolso" />
                <meta property="og:description" content="Conquiste sua liberdade sobre rodas! Parcelas a partir de R$ 399 para jovens." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/images/primeira-compra-social.jpg" />

                {/* Schema.org para SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AutomotiveBusiness",
                        "name": "CarencIA - Primeira Compra",
                        "description": "Especialista em primeiro carro para jovens",
                        "url": "https://carencia.com.br/primeira-compra",
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