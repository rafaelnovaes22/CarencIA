'use client'

export default function LandingPagesIndex() {
    const landingPages = [
        {
            id: 'jovens',
            title: 'Minha Primeira Conquista',
            description: 'Especial para jovens de 20-28 anos',
            url: '/primeira-compra',
            emoji: '🎯',
            color: 'from-blue-500 to-green-500',
            features: ['Parcelas reduzidas', 'Aprovação facilitada', 'Carros econômicos'],
            targetProfile: 'Jovens conectados que querem independência',
            utmParams: '?utm_source=facebook&utm_medium=paid&utm_campaign=jovens_primeira_compra&utm_content=landing_page'
        },
        {
            id: 'familias',
            title: 'Mais Espaço, Mais Conforto',
            description: 'Para famílias de 30-45 anos',
            url: '/familia',
            emoji: '👨‍👩‍👧‍👦',
            color: 'from-green-500 to-blue-500',
            features: ['Porta-malas grande', 'Segurança total', 'Baixo consumo'],
            targetProfile: 'Famílias em crescimento que precisam de mais espaço',
            utmParams: '?utm_source=facebook&utm_medium=paid&utm_campaign=familias_espaco_conforto&utm_content=landing_page'
        },
        {
            id: 'autonomos',
            title: 'Ferramenta de Trabalho',
            description: 'Para profissionais autônomos de 25-50 anos',
            url: '/autonomos',
            emoji: '🔧',
            color: 'from-orange-500 to-yellow-500',
            features: ['Ótimo valor de revenda', 'Econômico e resistente', 'ROI garantido'],
            targetProfile: 'Profissionais que dependem do carro para trabalhar',
            utmParams: '?utm_source=google&utm_medium=paid&utm_campaign=autonomos_ferramenta_trabalho&utm_content=landing_page'
        },
        {
            id: 'troca',
            title: 'Não dá mais para esperar',
            description: 'Troca urgente para quem precisa resolver rápido',
            url: '/troca-urgente',
            emoji: '🚨',
            color: 'from-red-500 to-orange-500',
            features: ['Avaliação em 2h', 'Carros disponíveis', 'Troca em 48h'],
            targetProfile: 'Clientes com necessidade urgente de trocar',
            utmParams: '?utm_source=google&utm_medium=paid&utm_campaign=troca_urgente&utm_content=landing_page'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Landing Pages Segmentadas</h1>
                            <p className="text-gray-600 mt-2">Sistema de captação de leads qualificados por perfil</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">CarencIA</div>
                            <div className="text-xs text-gray-400">Sistema Multi-Fonte</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <div className="text-2xl font-bold text-blue-600">4</div>
                        <div className="text-sm text-gray-600">Landing Pages</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <div className="text-2xl font-bold text-green-600">100%</div>
                        <div className="text-sm text-gray-600">Mobile Responsivo</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <div className="text-2xl font-bold text-purple-600">UTM</div>
                        <div className="text-sm text-gray-600">Tracking Completo</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <div className="text-2xl font-bold text-orange-600">Auto</div>
                        <div className="text-sm text-gray-600">Lead Scoring</div>
                    </div>
                </div>

                {/* Landing Pages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {landingPages.map((page) => (
                        <div key={page.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            {/* Header do Card */}
                            <div className={`bg-gradient-to-r ${page.color} p-6 text-white`}>
                                <div className="flex items-center space-x-3 mb-3">
                                    <span className="text-3xl">{page.emoji}</span>
                                    <div>
                                        <h2 className="text-xl font-bold">{page.title}</h2>
                                        <p className="text-white/90 text-sm">{page.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Conteúdo do Card */}
                            <div className="p-6">
                                {/* Perfil Alvo */}
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">🎯 Perfil Alvo:</h3>
                                    <p className="text-gray-600 text-sm">{page.targetProfile}</p>
                                </div>

                                {/* Features */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">✨ Principais Features:</h3>
                                    <ul className="space-y-1">
                                        {page.features.map((feature, index) => (
                                            <li key={index} className="text-sm text-gray-600 flex items-center">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* UTM Info */}
                                <div className="mb-6 bg-gray-50 rounded-lg p-3">
                                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">📊 UTM Tracking:</h3>
                                    <code className="text-xs text-gray-600 break-all">{page.utmParams}</code>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <a
                                        href={page.url + page.utmParams}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-full bg-gradient-to-r ${page.color} text-white py-3 px-4 rounded-lg font-semibold text-center block hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                                    >
                                        🚀 Acessar Landing Page
                                    </a>

                                    <a
                                        href={page.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium text-center block hover:bg-gray-200 transition-colors duration-300"
                                    >
                                        👁️ Visualizar sem UTM
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Informações Técnicas */}
                <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Informações Técnicas</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">🔧 Funcionalidades Implementadas:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    Formulários de qualificação específicos por perfil
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    Lead scoring automático baseado nas respostas
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    UTM tracking com cálculo de custo por lead
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    Integração automática com WhatsApp
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    Mensagens personalizadas por perfil
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    Design responsivo mobile-first
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">📊 Métricas Disponíveis:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    Taxa de conversão por perfil
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    Qualidade dos leads (lead scoring)
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    Custo por lead por campanha
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    Origem e fonte do tráfego
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    Performance por segmento
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    ROI por campanha
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Botões de Acesso */}
                    <div className="mt-8 flex flex-wrap gap-4">
                        <a
                            href="/admin/leads"
                            target="_blank"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                        >
                            📊 Dashboard de Leads
                        </a>
                        <a
                            href="/api/test-system"
                            target="_blank"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                        >
                            🧪 Testar Sistema
                        </a>
                        <a
                            href="/catalogo"
                            target="_blank"
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300"
                        >
                            🚗 Catálogo de Veículos
                        </a>
                    </div>
                </div>

                {/* Estratégia de Campanhas */}
                <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Estratégia de Campanhas Recomendada</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">📱 Facebook/Instagram:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• <strong>Jovens:</strong> Interesses em independência, primeiro emprego</li>
                                <li>• <strong>Famílias:</strong> Pais com filhos, interesse em segurança</li>
                                <li>• <strong>Autônomos:</strong> Empreendedorismo, trabalho autônomo</li>
                                <li>• <strong>Troca:</strong> Lookalike de quem comprou recentemente</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">🔍 Google Ads:</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• <strong>Jovens:</strong> &ldquo;primeiro carro financiado&rdquo;</li>
                                <li>• <strong>Famílias:</strong> &ldquo;carro família 7 lugares&rdquo;</li>
                                <li>• <strong>Autônomos:</strong> &ldquo;carro para uber&rdquo;, &ldquo;carro trabalho&rdquo;</li>
                                <li>• <strong>Troca:</strong> &ldquo;vender carro usado&rdquo;, &ldquo;troca rápida&rdquo;</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
} 