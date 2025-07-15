'use client'

import { LandingPageLayout } from '@/components/LandingPageLayout'
import { FormularioFamilias } from '@/components/FormularioFamilias'

export default function FamiliaPage() {
    // Hero Section
    const heroSection = (
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div className="text-center lg:text-left">
                <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    👨‍👩‍👧‍👦 Especial para famílias
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    Sua família merece{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                        mais espaço
                    </span>
                    {' '}e conforto
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    <strong>Escolha o carro perfeito para sua família com parcelas acessíveis.</strong><br />
                    Segurança, espaço e economia em um só lugar.
                </p>

                {/* Benefícios em destaque */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">🚗</span>
                        </div>
                        <span className="text-gray-700 font-medium">Porta-malas grande</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold">⛽</span>
                        </div>
                        <span className="text-gray-700 font-medium">Baixo consumo</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-bold">🛡️</span>
                        </div>
                        <span className="text-gray-700 font-medium">Segurança total</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-bold">💰</span>
                        </div>
                        <span className="text-gray-700 font-medium">Financiamento fácil</span>
                    </div>
                </div>

                {/* CTA Button */}
                <a
                    href="#formulario"
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    👨‍👩‍👧‍👦 Simular agora e surpreender a família
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
                        👨‍👩‍👧‍👦
                    </div>

                    {/* Elementos decorativos */}
                    <div className="absolute -top-4 -right-4 bg-blue-400 text-blue-900 px-4 py-2 rounded-full font-bold transform rotate-12">
                        5 lugares!
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 px-4 py-2 rounded-full font-bold transform -rotate-12">
                        Seguro e econômico
                    </div>
                </div>
            </div>
        </div>
    )

    // Form Section
    const formSection = (
        <div id="formulario">
            <FormularioFamilias />
        </div>
    )

    // Benefits Section
    const benefitsSection = (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Por que famílias confiam na CarencIA?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
                Entendemos as necessidades das famílias e oferecemos soluções completas:
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">🏠</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Espaço para todos</h3>
                    <p className="text-gray-600">
                        Carros espaçosos com porta-malas grande, ideais para bagagens, compras e viagens em família.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">🛡️</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Segurança em primeiro lugar</h3>
                    <p className="text-gray-600">
                        Veículos com airbags, freios ABS, controle de estabilidade e 5 estrelas no LATIN NCAP.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Economia familiar</h3>
                    <p className="text-gray-600">
                        Carros econômicos que cabem no orçamento familiar, com parcelas a partir de R$ 549/mês.
                    </p>
                </div>
            </div>

            {/* Diferencial família */}
            <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">O que sua família precisa:</h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🚗</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Porta-malas amplo</h4>
                        <p className="text-sm text-gray-600">Espaço para carrinho, compras e bagagens da família</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">❄️</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Ar-condicionado</h4>
                        <p className="text-sm text-gray-600">Conforto térmico para toda a família</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Itens de segurança</h4>
                        <p className="text-sm text-gray-600">Airbags, freios ABS e controle de estabilidade</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⛽</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Baixo consumo</h4>
                        <p className="text-sm text-gray-600">Economia de combustível no orçamento mensal</p>
                    </div>
                </div>
            </div>

            {/* Depoimentos de famílias */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Famílias que já encontraram o carro ideal:</h3>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                                👨‍👩‍👧‍👦
                            </div>
                            <div>
                                <div className="font-semibold">Família Silva</div>
                                <div className="text-sm text-gray-500">2 filhos, idades 6 e 10 anos</div>
                            </div>
                        </div>
                        <p className="text-gray-700 italic">
                            &ldquo;Trocamos nosso Gol por um SUV maior. Agora as crianças viajam confortáveis e temos espaço para tudo. Valeu cada centavo!&rdquo;
                        </p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                                👨‍👩‍👧‍👦
                            </div>
                            <div>
                                <div className="font-semibold">Família Santos</div>
                                <div className="text-sm text-gray-500">3 filhos, idades 4, 8 e 12 anos</div>
                            </div>
                        </div>
                        <p className="text-gray-700 italic">
                            &ldquo;Precisávamos de um carro seguro e econômico. Encontramos exatamente isso! O porta-malas é gigante e o consumo é ótimo.&rdquo;
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
                Pronto para dar mais conforto à sua família?
            </h2>
            <p className="text-xl mb-8 opacity-90">
                Mais de 1.800 famílias já encontraram o carro ideal conosco
            </p>
            <a
                href="#formulario"
                className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
                👨‍👩‍👧‍👦 Encontrar o carro da família
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
                <title>Carro para Família - Mais espaço e conforto com parcelas acessíveis | CarencIA</title>
                <meta
                    name="description"
                    content="Encontre o carro perfeito para sua família! Espaço, segurança e economia. Parcelas a partir de R$ 549. Simule agora!"
                />
                <meta name="keywords" content="carro família, SUV, espaço, segurança, porta-malas grande, econômico, filhos" />

                {/* Open Graph para redes sociais */}
                <meta property="og:title" content="Carro para Família - Mais espaço e conforto" />
                <meta property="og:description" content="Sua família merece mais espaço e conforto! Carros seguros e econômicos." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/images/familia-social.jpg" />

                {/* Schema.org para SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AutomotiveBusiness",
                        "name": "CarencIA - Carros para Família",
                        "description": "Especialista em carros para famílias com espaço e segurança",
                        "url": "https://carencia.com.br/familia",
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