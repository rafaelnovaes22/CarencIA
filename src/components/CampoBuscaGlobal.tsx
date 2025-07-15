'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { ResultadosBuscaInteligente } from './ResultadosBuscaInteligente'
import { Veiculo } from '@/types/database'

interface FiltrosInteligentes {
    marcas?: string[]
    modelos?: string[]
    anoMin?: number
    anoMax?: number
    precoMin?: number
    precoMax?: number
    combustivel?: string[]
    cambio?: string[]
    cores?: string[]
    categorias?: string[]
    caracteristicas?: string[]
    confianca: number
}

interface ResultadoBuscaInteligente {
    veiculos: Veiculo[]
    filtros_aplicados: FiltrosInteligentes
    busca_original: string
    total_encontrados: number
    interpretacao: {
        confianca: number
        filtros_ativos: string[]
    }
}

interface CampoBuscaGlobalProps {
    placeholder?: string
    showSuggestions?: boolean
    className?: string
    useBuscaInteligente?: boolean
}

export function CampoBuscaGlobal({
    placeholder = "Descreva o que você procura... Ex: SUV branco 2020, Civic automático, carro econômico para família",
    showSuggestions = true,
    className = "",
    useBuscaInteligente = true
}: CampoBuscaGlobalProps) {
    const [busca, setBusca] = useState('')
    const [loading, setLoading] = useState(false)
    const [resultado, setResultado] = useState<ResultadoBuscaInteligente | null>(null)
    const [mostrarResultados, setMostrarResultados] = useState(false)
    const router = useRouter()

    const sugestoesBusca = [
        "SUV familiar",
        "Carro econômico",
        "Sedan automático",
        "Hatch 2020 em diante",
        "Volkswagen Golf",
        "Toyota Corolla",
        "Honda Civic",
        "Carro até R$ 50.000"
    ]

    const handleBuscaInteligente = async (termo: string) => {
        if (!termo.trim()) return

        setLoading(true)
        setMostrarResultados(true)

        try {
            const response = await fetch('/api/busca-inteligente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ busca: termo.trim() })
            })

            const data = await response.json()

            if (data.success) {
                setResultado(data.data)
            } else {
                console.error('Erro na busca inteligente:', data.error)
                // Fallback para busca normal
                router.push(`/catalogo?busca=${encodeURIComponent(termo.trim())}`)
            }
        } catch (error) {
            console.error('Erro ao conectar com busca inteligente:', error)
            // Fallback para busca normal
            router.push(`/catalogo?busca=${encodeURIComponent(termo.trim())}`)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (busca.trim()) {
            if (useBuscaInteligente) {
                handleBuscaInteligente(busca)
            } else {
                router.push(`/catalogo?busca=${encodeURIComponent(busca.trim())}`)
            }
        }
    }

    const handleSugestaoClick = (sugestao: string) => {
        setBusca(sugestao)
        if (useBuscaInteligente) {
            handleBuscaInteligente(sugestao)
        } else {
            router.push(`/catalogo?busca=${encodeURIComponent(sugestao)}`)
        }
    }

    const handleNovaBusca = () => {
        setMostrarResultados(false)
        setResultado(null)
        setBusca('')
    }

    return (
        <>
            <div className={`bg-white shadow-lg border-t border-gray-100 ${className}`}>
                <div className="container mx-auto px-4 py-6">
                    {!mostrarResultados && (
                        <>
                            {/* Título */}
                            <div className="text-center mb-4">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    {useBuscaInteligente && (
                                        <SparklesIcon className="w-5 h-5 text-blue-500" />
                                    )}
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        O que você está procurando?
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    {useBuscaInteligente
                                        ? "Descreva o veículo ideal em linguagem natural - nossa IA encontrará as melhores opções"
                                        : "Descreva o veículo ideal para você e encontraremos as melhores opções"
                                    }
                                </p>
                            </div>

                            {/* Campo de busca */}
                            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        {useBuscaInteligente ? (
                                            <SparklesIcon className="h-5 w-5 text-blue-500" />
                                        ) : (
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value)}
                                        placeholder={placeholder}
                                        className="w-full pl-12 pr-32 py-4 border border-gray-300 rounded-lg text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        disabled={loading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="absolute inset-y-0 right-0 px-6 py-2 m-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                                    >
                                        {loading ? (
                                            <>
                                                <SparklesIcon className="w-4 h-4 animate-spin" />
                                                <span>IA...</span>
                                            </>
                                        ) : (
                                            <>
                                                {useBuscaInteligente && <SparklesIcon className="w-4 h-4" />}
                                                <span>Buscar</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Sugestões de busca */}
                            {showSuggestions && (
                                <div className="max-w-4xl mx-auto mt-4">
                                    <p className="text-sm text-gray-500 mb-2">
                                        {useBuscaInteligente ? "Exemplos para IA:" : "Buscas populares:"}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {sugestoesBusca.map((sugestao, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSugestaoClick(sugestao)}
                                                disabled={loading}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {sugestao}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Resultados da busca inteligente */}
            {mostrarResultados && useBuscaInteligente && (
                <ResultadosBuscaInteligente
                    resultado={resultado}
                    loading={loading}
                    onNovaBusca={handleNovaBusca}
                />
            )}
        </>
    )
} 