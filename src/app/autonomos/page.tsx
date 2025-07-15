'use client'

import { LandingPageLayout } from '@/components/LandingPageLayout'
import { FormularioAutonomos } from '@/components/FormularioAutonomos'

export default function AutonomosPage() {
    // Hero Section
    const heroSection = (
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div className="text-center lg:text-left">
                <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    🔧 Especial para profissionais autônomos
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    Seu parceiro ideal para{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                        trabalhar
                    </span>
                    {' '}e vencer
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    <strong>Economia e resistência para quem depende do carro todos os dias.</strong><br />
                    Invista na sua ferramenta de trabalho e aumente sua renda.
                </p>

                {/* Benefícios em destaque */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold">📈</span>
                        </div>
                        <span className="text-gray-700 font-medium">Ótimo valor de revenda</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">⛽</span>
                        </div>
                        <span className="text-gray-700 font-medium">Econômico</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-bold">🔧</span>
                        </div>
                        <span className="text-gray-700 font-medium">Resistente</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 font-bold">✅</span>
                        </div>
                        <span className="text-gray-700 font-medium">Aprovação facilitada</span>
                    </div>
                </div>

                {/* CTA Button */}
                <a
                    href="#formulario"
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    🔧 Quero meu carro para trabalhar
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </a>
            </div>

            {/* Imagem */}
            <div className="relative">
                <div className="relative bg-gradient-to-br from-orange-100 to-blue-100 rounded-2xl p-8 lg:p-12">
                    {/* Placeholder para imagem - substituir por imagem real */}
                    <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-400 text-6xl">
                        🚗
                    </div>

                    {/* Elementos decorativos */}
                    <div className="absolute -top-4 -right-4 bg-green-400 text-green-900 px-4 py-2 rounded-full font-bold transform rotate-12">
                        Ferramenta de trabalho!
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-blue-400 text-blue-900 px-4 py-2 rounded-full font-bold transform -rotate-12">
                        Econômico e resistente
                    </div>
                </div>
            </div>
        </div>
    )

    // Form Section
    const formSection = (
        <div id="formulario">
            <FormularioAutonomos />
        </div>
    )

    // Benefits Section
    const benefitsSection = (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Por que profissionais autônomos escolhem a CarencIA?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
                Entendemos que o carro é sua ferramenta de trabalho. Por isso oferecemos:
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">📈</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Excelente valor de revenda</h3>
                    <p className="text-gray-600">
                        Carros que mantêm valor no mercado, garantindo seu investimento e facilitando trocas futuras.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">⛽</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Economia que aumenta sua renda</h3>
                    <p className="text-gray-600">
                        Veículos econômicos que reduzem custos operacionais, deixando mais dinheiro no seu bolso.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-4xl mb-4">🔧</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Resistência e confiabilidade</h3>
                    <p className="text-gray-600">
                        Carros robustos que aguentam o uso intenso do dia a dia, sem te deixar na mão.
                    </p>
                </div>
            </div>

            {/* ROI Calculator */}
            <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Calcule quanto você pode ganhar a mais:</h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🚗</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Carro mais confiável</h4>
                        <p className="text-sm text-gray-600">Menos quebras = mais dias trabalhando</p>
                        <p className="text-lg font-bold text-green-600 mt-2">+R$ 800/mês</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⛽</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Economia de combustível</h4>
                        <p className="text-sm text-gray-600">Menos gastos com combustível</p>
                        <p className="text-lg font-bold text-blue-600 mt-2">+R$ 400/mês</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔧</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Menos manutenção</h4>
                        <p className="text-sm text-gray-600">Carro novo = menos gastos com mecânico</p>
                        <p className="text-lg font-bold text-purple-600 mt-2">+R$ 300/mês</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⭐</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Melhor avaliação</h4>
                        <p className="text-sm text-gray-600">Clientes preferem carros novos</p>
                        <p className="text-lg font-bold text-yellow-600 mt-2">+R$ 200/mês</p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="bg-white rounded-lg p-6 shadow-lg inline-block">
                        <p className="text-sm text-gray-600 mb-2">Ganho potencial mensal:</p>
                        <p className="text-3xl font-bold text-green-600">+R$ 1.700</p>
                        <p className="text-sm text-gray-500 mt-2">Suficiente para pagar a parcela e ainda sobrar!</p>
                    </div>
                </div>
            </div>

            {/* Depoimentos de profissionais */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Profissionais que mudaram de vida:</h3>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-green-50 p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                                M
                            </div>
                            <div>
                                <div className="font-semibold">Marcelo - Motorista Uber</div>
                                <div className="text-sm text-gray-500">Trocou Corsa 2008 por HB20 2020</div>
                            </div>
                        </div>
                        <p className="text-gray-700 italic">
                            &ldquo;Minha renda aumentou 60%! O carro não quebra mais, gasto menos combustível e os passageiros avaliam melhor. A parcela se paga sozinha!&rdquo;
                        </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                                A
                            </div>
                            <div>
                                <div className="font-semibold">Ana - Vendedora Externa</div>
                                <div className="text-sm text-gray-500">Trocou Palio 2012 por Onix 2021</div>
                            </div>
                        </div>
                        <p className="text-gray-700 italic">
                            &ldquo;Agora consigo visitar mais clientes sem medo de quebrar no meio do caminho. Minhas vendas aumentaram 40% no primeiro mês!&rdquo;
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
                Pronto para turbinar sua renda?
            </h2>
            <p className="text-xl mb-8 opacity-90">
                Mais de 950 profissionais já aumentaram sua renda com um carro melhor
            </p>
            <a
                href="#formulario"
                className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
                💼 Investir na minha ferramenta de trabalho
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
                <title>Carro para Trabalhar - Sua ferramenta de trabalho resistente e econômica | CarencIA</title>
                <meta
                    name="description"
                    content="Carro para profissionais autônomos! Econômico, resistente e com ótimo valor de revenda. Aumente sua renda com a ferramenta certa!"
                />
                <meta name="keywords" content="carro trabalho, autônomo, uber, ifood, vendedor, ferramenta trabalho, econômico" />

                {/* Open Graph para redes sociais */}
                <meta property="og:title" content="Carro para Trabalhar - Sua ferramenta de trabalho" />
                <meta property="og:description" content="Invista na sua ferramenta de trabalho! Carros econômicos e resistentes para profissionais." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/images/autonomos-social.jpg" />

                {/* Schema.org para SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AutomotiveBusiness",
                        "name": "CarencIA - Carros para Trabalhar",
                        "description": "Especialista em carros para profissionais autônomos",
                        "url": "https://carencia.com.br/autonomos",
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