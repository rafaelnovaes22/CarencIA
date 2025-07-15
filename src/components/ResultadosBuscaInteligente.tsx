'use client'

import { useState } from 'react'
import { VeiculoCard } from './VeiculoCard'
import { Veiculo } from '@/types/database'
import {
    SparklesIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

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

interface ResultadosBuscaInteligenteProps {
    resultado: ResultadoBuscaInteligente | null
    loading: boolean
    onNovaBusca: () => void
}

export function ResultadosBuscaInteligente({
    resultado,
    loading,
    onNovaBusca
}: ResultadosBuscaInteligenteProps) {
    const [mostrarDetalhes, setMostrarDetalhes] = useState(false)

    if (loading) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-6 mx-auto max-w-4xl mt-6">
                <div className="flex items-center justify-center space-x-3">
                    <SparklesIcon className="w-6 h-6 text-blue-500 animate-spin" />
                    <span className="text-lg font-medium text-gray-700">
                        Analisando sua busca com IA...
                    </span>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="text-sm text-gray-600 text-center">
                        • Interpretando linguagem natural
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                        • Extraindo filtros inteligentes
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                        • Buscando veículos correspondentes
                    </div>
                </div>
            </div>
        )
    }

    if (!resultado) {
        return null
    }

    const { veiculos, filtros_aplicados, busca_original, interpretacao } = resultado
    const confiancaTexto = interpretacao.confianca >= 80 ? 'Alta' :
        interpretacao.confianca >= 60 ? 'Boa' :
            interpretacao.confianca >= 40 ? 'Média' : 'Baixa'

    const confiancaCor = interpretacao.confianca >= 80 ? 'text-green-600' :
        interpretacao.confianca >= 60 ? 'text-blue-600' :
            interpretacao.confianca >= 40 ? 'text-yellow-600' : 'text-red-600'

    const formatarFiltros = () => {
        const filtros = []

        if (filtros_aplicados.marcas?.length) {
            filtros.push(`Marcas: ${filtros_aplicados.marcas.join(', ')}`)
        }
        if (filtros_aplicados.modelos?.length) {
            filtros.push(`Modelos: ${filtros_aplicados.modelos.join(', ')}`)
        }
        if (filtros_aplicados.anoMin || filtros_aplicados.anoMax) {
            const ano = filtros_aplicados.anoMin && filtros_aplicados.anoMax
                ? `${filtros_aplicados.anoMin}-${filtros_aplicados.anoMax}`
                : filtros_aplicados.anoMin
                    ? `${filtros_aplicados.anoMin} em diante`
                    : `até ${filtros_aplicados.anoMax}`
            filtros.push(`Ano: ${ano}`)
        }
                if (filtros_aplicados.precoMin || filtros_aplicados.precoMax) {
            const preco = filtros_aplicados.precoMin && filtros_aplicados.precoMax 
                ? `R$ ${filtros_aplicados.precoMin.toLocaleString()} - R$ ${filtros_aplicados.precoMax.toLocaleString()}`
                : filtros_aplicados.precoMin 
                ? `acima de R$ ${filtros_aplicados.precoMin.toLocaleString()}`
                : filtros_aplicados.precoMax
                ? `até R$ ${filtros_aplicados.precoMax.toLocaleString()}`
                : 'Preço não especificado'
            filtros.push(`Preço: ${preco}`)
        }
        if (filtros_aplicados.combustivel?.length) {
            filtros.push(`Combustível: ${filtros_aplicados.combustivel.join(', ')}`)
        }
        if (filtros_aplicados.cambio?.length) {
            filtros.push(`Câmbio: ${filtros_aplicados.cambio.join(', ')}`)
        }
        if (filtros_aplicados.categorias?.length) {
            filtros.push(`Tipo: ${filtros_aplicados.categorias.join(', ')}`)
        }
        if (filtros_aplicados.caracteristicas?.length) {
            filtros.push(`Perfil: ${filtros_aplicados.caracteristicas.join(', ')}`)
        }

        return filtros
    }

    return (
        <div className="max-w-7xl mx-auto px-4 mt-6">
            {/* Cabeçalho com interpretação da IA */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                            <SparklesIcon className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-semibold text-gray-900">
                                Busca Inteligente
                            </h2>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${confiancaCor} bg-gray-100`}>
                                Confiança: {confiancaTexto} ({interpretacao.confianca}%)
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="text-gray-700">
                                <span className="font-medium">Você buscou:</span> &ldquo;{busca_original}&rdquo;
                            </p>
                        </div>

                        {veiculos.length > 0 ? (
                            <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircleIcon className="w-5 h-5" />
                                <span className="font-medium">
                                    {veiculos.length} veículo{veiculos.length !== 1 ? 's' : ''} encontrado{veiculos.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-yellow-600">
                                <ExclamationTriangleIcon className="w-5 h-5" />
                                <span className="font-medium">
                                    Nenhum veículo encontrado com esses critérios
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onNovaBusca}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <MagnifyingGlassIcon className="w-4 h-4" />
                        <span>Nova Busca</span>
                    </button>
                </div>

                {/* Detalhes da interpretação */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {mostrarDetalhes ? 'Ocultar' : 'Ver'} detalhes da interpretação IA
                    </button>

                    {mostrarDetalhes && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Filtros identificados pela IA:</h4>
                            {formatarFiltros().length > 0 ? (
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    {formatarFiltros().map((filtro, index) => (
                                        <li key={index}>{filtro}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-600 italic">
                                    Busca muito geral - mostrando todos os veículos disponíveis
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Resultados */}
            {veiculos.length > 0 ? (
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Veículos Encontrados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {veiculos.map((veiculo) => (
                            <VeiculoCard key={veiculo.id} veiculo={veiculo} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Nenhum veículo encontrado
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Tente refinar sua busca ou use termos mais gerais
                    </p>
                    <button
                        onClick={onNovaBusca}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Fazer Nova Busca
                    </button>
                </div>
            )}
        </div>
    )
} 