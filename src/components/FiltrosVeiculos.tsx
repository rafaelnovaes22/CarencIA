'use client'

import { useState } from 'react'

interface FiltrosType {
    busca: string
    marca: string
    modelo: string
    anoMin: string
    anoMax: string
    precoMin: string
    precoMax: string
    combustivel: string
    cambio: string
}

interface FiltrosVeiculosProps {
    marcas: { marca: string; count: number }[]
    modelos: { modelo: string; count: number }[]
    onFiltrosChange: (filtros: FiltrosType) => void
    loading?: boolean
}

export function FiltrosVeiculos({ marcas, modelos, onFiltrosChange, loading }: FiltrosVeiculosProps) {
    const [filtros, setFiltros] = useState({
        busca: '',
        marca: '',
        modelo: '',
        anoMin: '',
        anoMax: '',
        precoMin: '',
        precoMax: '',
        combustivel: '',
        cambio: ''
    })

    const handleChange = (field: string, value: string) => {
        const novosFiltros = { ...filtros, [field]: value }
        setFiltros(novosFiltros)

        // Se limpar marca, limpar modelo também
        if (field === 'marca' && value === '') {
            novosFiltros.modelo = ''
            setFiltros(novosFiltros)
        }

        onFiltrosChange(novosFiltros)
    }

    const limparFiltros = () => {
        const filtrosLimpos = {
            busca: '',
            marca: '',
            modelo: '',
            anoMin: '',
            anoMax: '',
            precoMin: '',
            precoMax: '',
            combustivel: '',
            cambio: ''
        }
        setFiltros(filtrosLimpos)
        onFiltrosChange(filtrosLimpos)
    }

    // Filtrar modelos baseado na marca selecionada
    const modelosFiltrados = filtros.marca
        ? modelos.filter(m => m.modelo.includes(filtros.marca))
        : modelos

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
                <button
                    onClick={limparFiltros}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    Limpar filtros
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Busca geral */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar veículo
                    </label>
                    <input
                        type="text"
                        placeholder="Ex: Civic, Corolla, HB20..."
                        value={filtros.busca}
                        onChange={(e) => handleChange('busca', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Marca */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marca
                    </label>
                    <select
                        value={filtros.marca}
                        onChange={(e) => handleChange('marca', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todas as marcas</option>
                        {marcas.map((marca) => (
                            <option key={marca.marca} value={marca.marca}>
                                {marca.marca} ({marca.count})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Modelo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modelo
                    </label>
                    <select
                        value={filtros.modelo}
                        onChange={(e) => handleChange('modelo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!filtros.marca}
                    >
                        <option value="">Todos os modelos</option>
                        {modelosFiltrados.map((modelo) => (
                            <option key={modelo.modelo} value={modelo.modelo}>
                                {modelo.modelo} ({modelo.count})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ano mínimo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano mínimo
                    </label>
                    <input
                        type="number"
                        placeholder="2010"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        value={filtros.anoMin}
                        onChange={(e) => handleChange('anoMin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Ano máximo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano máximo
                    </label>
                    <input
                        type="number"
                        placeholder={new Date().getFullYear().toString()}
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        value={filtros.anoMax}
                        onChange={(e) => handleChange('anoMax', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Preço mínimo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço mínimo
                    </label>
                    <input
                        type="number"
                        placeholder="20000"
                        min="0"
                        step="1000"
                        value={filtros.precoMin}
                        onChange={(e) => handleChange('precoMin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Preço máximo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço máximo
                    </label>
                    <input
                        type="number"
                        placeholder="200000"
                        min="0"
                        step="1000"
                        value={filtros.precoMax}
                        onChange={(e) => handleChange('precoMax', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Combustível */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Combustível
                    </label>
                    <select
                        value={filtros.combustivel}
                        onChange={(e) => handleChange('combustivel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos</option>
                        <option value="FLEX">Flex</option>
                        <option value="GASOLINA">Gasolina</option>
                        <option value="DIESEL">Diesel</option>
                        <option value="HIBRIDO">Híbrido</option>
                        <option value="ELETRICO">Elétrico</option>
                    </select>
                </div>

                {/* Câmbio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Câmbio
                    </label>
                    <select
                        value={filtros.cambio}
                        onChange={(e) => handleChange('cambio', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos</option>
                        <option value="MANUAL">Manual</option>
                        <option value="AUTOMATICO">Automático</option>
                    </select>
                </div>
            </div>

            {loading && (
                <div className="mt-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Carregando...</span>
                </div>
            )}
        </div>
    )
} 