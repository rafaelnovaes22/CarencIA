'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/Header'
import { CampoBuscaGlobal } from '@/components/CampoBuscaGlobal'
import { Footer } from '@/components/Footer'
import { VeiculoCard } from '@/components/VeiculoCard'
import { FiltrosVeiculos } from '@/components/FiltrosVeiculos'
import { Veiculo } from '@/types/database'

interface FiltrosVeiculosType {
    busca?: string
    marca?: string
    modelo?: string
    anoMin?: string
    anoMax?: string
    precoMin?: string
    precoMax?: string
    combustivel?: string
    cambio?: string
}

interface ApiResponse {
    success: boolean
    data: {
        veiculos: Veiculo[]
        pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
        }
        filtros: {
            marcas: { marca: string; count: number }[]
            modelos: { modelo: string; count: number }[]
        }
    }
}

export default function CatalogoPage() {
    const [dados, setDados] = useState<ApiResponse['data'] | null>(null)
    const [loading, setLoading] = useState(true)
    const [filtros, setFiltros] = useState<FiltrosVeiculosType>({})

    const buscarVeiculos = useCallback(async (filtrosAtivos: FiltrosVeiculosType, pagina: number = 1) => {
        setLoading(true)

        try {
            // Construir query string
            const params = new URLSearchParams()

            if (filtrosAtivos.busca) {
                params.append('busca', filtrosAtivos.busca)
            }
            if (filtrosAtivos.marca) {
                params.append('marca', filtrosAtivos.marca)
            }
            if (filtrosAtivos.modelo) {
                params.append('modelo', filtrosAtivos.modelo)
            }
            if (filtrosAtivos.anoMin) {
                params.append('anoMin', filtrosAtivos.anoMin)
            }
            if (filtrosAtivos.anoMax) {
                params.append('anoMax', filtrosAtivos.anoMax)
            }
            if (filtrosAtivos.precoMin) {
                params.append('precoMin', filtrosAtivos.precoMin)
            }
            if (filtrosAtivos.precoMax) {
                params.append('precoMax', filtrosAtivos.precoMax)
            }
            if (filtrosAtivos.combustivel) {
                params.append('combustivel', filtrosAtivos.combustivel)
            }
            if (filtrosAtivos.cambio) {
                params.append('cambio', filtrosAtivos.cambio)
            }

            params.append('page', pagina.toString())
            params.append('limit', '12')

            const response = await fetch(`/api/veiculos?${params.toString()}`)
            const data: ApiResponse = await response.json()

            if (data.success) {
                setDados(data.data)
            } else {
                console.error('Erro ao buscar veículos:', data)
            }
        } catch (error) {
            console.error('Erro na requisição:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Carregamento inicial
    useEffect(() => {
        buscarVeiculos({})
    }, [buscarVeiculos])

    // Handler para mudanças nos filtros
    const handleFiltrosChange = useCallback((novosFiltros: FiltrosVeiculosType) => {
        setFiltros(novosFiltros)
        buscarVeiculos(novosFiltros, 1) // Sempre volta para página 1 ao filtrar
    }, [buscarVeiculos])

    // Handler para mudança de página
    const handlePaginaChange = (novaPagina: number) => {
        buscarVeiculos(filtros, novaPagina)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Componente de paginação
    const Paginacao = () => {
        if (!dados?.pagination) return null

        const { page, totalPages } = dados.pagination
        const paginas = []

        // Calcular páginas a mostrar
        const inicio = Math.max(1, page - 2)
        const fim = Math.min(totalPages, page + 2)

        for (let i = inicio; i <= fim; i++) {
            paginas.push(i)
        }

        return (
            <div className="flex justify-center items-center gap-2 mt-8">
                {/* Primeira página */}
                {inicio > 1 && (
                    <>
                        <button
                            onClick={() => handlePaginaChange(1)}
                            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            1
                        </button>
                        {inicio > 2 && <span className="px-2">...</span>}
                    </>
                )}

                {/* Páginas do meio */}
                {paginas.map(p => (
                    <button
                        key={p}
                        onClick={() => handlePaginaChange(p)}
                        className={`px-3 py-2 border rounded-md ${p === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {p}
                    </button>
                ))}

                {/* Última página */}
                {fim < totalPages && (
                    <>
                        {fim < totalPages - 1 && <span className="px-2">...</span>}
                        <button
                            onClick={() => handlePaginaChange(totalPages)}
                            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <CampoBuscaGlobal showSuggestions={false} useBuscaInteligente={false} />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Título */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Catálogo de Veículos
                    </h1>
                    <p className="text-gray-600">
                        {dados?.pagination.total
                            ? `${dados.pagination.total} veículos encontrados`
                            : 'Carregando veículos...'
                        }
                    </p>
                </div>

                {/* Filtros */}
                {dados && (
                    <FiltrosVeiculos
                        marcas={dados.filtros.marcas}
                        modelos={dados.filtros.modelos}
                        onFiltrosChange={handleFiltrosChange}
                        loading={loading}
                    />
                )}

                {/* Grid de veículos */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : dados?.veiculos.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-4">
                            Nenhum veículo encontrado com os filtros selecionados
                        </div>
                        <button
                            onClick={() => handleFiltrosChange({})}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {dados?.veiculos.map((veiculo) => (
                                <VeiculoCard key={veiculo.id} veiculo={veiculo} />
                            ))}
                        </div>

                        {/* Paginação */}
                        <Paginacao />

                        {/* Informações da paginação */}
                        {dados && (
                            <div className="text-center text-gray-600 mt-4">
                                Página {dados.pagination.page} de {dados.pagination.totalPages}
                                ({dados.pagination.total} veículos no total)
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    )
} 