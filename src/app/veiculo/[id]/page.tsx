'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { GaleriaFotos } from '@/components/GaleriaFotos'
import { FormularioInteresse } from '@/components/FormularioInteresse'
import { VeiculoCard } from '@/components/VeiculoCard'
import { Veiculo } from '@/types/database'
import { ArrowLeftIcon, CalendarIcon, CogIcon, MapPinIcon, FireIcon } from '@heroicons/react/24/outline'

interface ApiResponse {
    success: boolean
    data: {
        veiculo: Veiculo
        similares: Veiculo[]
    }
    error?: string
}

export default function VeiculoDetalhePage() {
    const params = useParams()
    const [dados, setDados] = useState<ApiResponse['data'] | null>(null)
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        const buscarVeiculo = async () => {
            try {
                const response = await fetch(`/api/veiculos/${params.id}`)
                const data: ApiResponse = await response.json()

                if (data.success) {
                    setDados(data.data)
                } else {
                    setErro(data.error || 'Veículo não encontrado')
                }
            } catch (error) {
                console.error('Erro ao buscar veículo:', error)
                setErro('Erro ao carregar veículo')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            buscarVeiculo()
        }
    }, [params.id])

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco)
    }

    const formatarKM = (km: number) => {
        return new Intl.NumberFormat('pt-BR').format(km)
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="aspect-video bg-gray-200 rounded-lg"></div>
                                <div className="grid grid-cols-6 gap-2">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="aspect-square bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-12 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (erro) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Veículo não encontrado</h1>
                        <p className="text-gray-600 mb-6">{erro}</p>
                        <Link
                            href="/catalogo"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Voltar ao Catálogo
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const { veiculo, similares } = dados!

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link href="/catalogo" className="hover:text-blue-600 flex items-center gap-1">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Voltar ao Catálogo
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900">{veiculo.marca} {veiculo.modelo}</span>
                </nav>

                {/* Conteúdo Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Galeria - 2/3 */}
                    <div className="lg:col-span-2">
                        <GaleriaFotos
                            fotos={veiculo.fotos || []}
                            titulo={`${veiculo.ano} ${veiculo.marca} ${veiculo.modelo}`}
                        />
                    </div>

                    {/* Informações e Formulário - 1/3 */}
                    <div className="space-y-6">
                        {/* Informações Principais */}
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {veiculo.ano} {veiculo.marca} {veiculo.modelo}
                            </h1>

                            {veiculo.versao && veiculo.versao !== 'PADRÃO' && (
                                <p className="text-gray-600 mb-4">{veiculo.versao}</p>
                            )}

                            {/* Preço */}
                            <div className="mb-6">
                                {Number(veiculo.preco) > 0 ? (
                                    <div className="text-3xl font-bold text-green-600">
                                        {formatarPreco(Number(veiculo.preco))}
                                    </div>
                                ) : (
                                    <div className="text-xl font-semibold text-gray-500">
                                        Consulte o preço
                                    </div>
                                )}
                            </div>

                            {/* Detalhes Técnicos */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-600">Ano</div>
                                        <div className="font-medium">{veiculo.ano}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-600">KM</div>
                                        <div className="font-medium">{formatarKM(veiculo.km)}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FireIcon className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-600">Combustível</div>
                                        <div className="font-medium">{veiculo.combustivel}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CogIcon className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-600">Câmbio</div>
                                        <div className="font-medium">{veiculo.cambio}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Cor */}
                            {veiculo.cor && (
                                <div className="mb-6">
                                    <div className="text-sm text-gray-600 mb-1">Cor</div>
                                    <div className="font-medium">{veiculo.cor}</div>
                                </div>
                            )}

                            {/* Localização */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-900 mb-2">📍 Localização</h3>
                                <p className="text-gray-600 text-sm">
                                    <strong>Robust Car</strong><br />
                                    Av. Marechal Tito, 3240<br />
                                    Jardim Silva Teles - São Paulo/SP<br />
                                    📞 (11) 2667-6852 | (11) 94076-3330
                                </p>
                            </div>
                        </div>

                        {/* Formulário de Interesse */}
                        <FormularioInteresse veiculo={veiculo} />
                    </div>
                </div>

                {/* Descrição Detalhada */}
                {veiculo.descricao && (
                    <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Descrição</h2>
                        <p className="text-gray-700 whitespace-pre-line">{veiculo.descricao}</p>
                    </div>
                )}

                {/* Veículos Similares */}
                {similares.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Veículos Similares</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similares.map((veiculoSimilar) => (
                                <VeiculoCard key={veiculoSimilar.id} veiculo={veiculoSimilar} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Call to Action Final */}
                <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Interessado neste veículo?</h2>
                    <p className="text-blue-100 mb-6">
                        Entre em contato conosco para agendar uma visita, test-drive ou saber mais detalhes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => {
                                const telefone = '5511940763330'
                                const mensagem = `Olá! Tenho interesse no ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}. Gostaria de agendar um test-drive.`
                                const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`
                                window.open(whatsappUrl, '_blank')
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-medium transition-colors"
                        >
                            📱 WhatsApp para Test-Drive
                        </button>
                        <Link
                            href="/catalogo"
                            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-md font-medium transition-colors"
                        >
                            Ver Mais Veículos
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
} 