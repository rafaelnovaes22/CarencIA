'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

interface Lead {
    id: string
    nome: string
    email: string
    telefone: string
    status: string
    temperatura: string
    score: number
    origem: string
    created_at: string
    updated_at: string
    veiculo_interesse?: {
        id: string
        marca: string
        modelo: string
        ano: number
        preco: number
    }
    _count: {
        interacoes: number
        agendamentos: number
    }
}

interface LeadStats {
    por_status?: Record<string, number>
    por_temperatura?: Record<string, number>
    leads_hoje?: number
    crescimento_hoje?: string
    taxa_conversao?: string
    custo_medio_lead?: string
    por_fonte?: Array<{
        fonte: string
        count: number
        custo_medio: string
    }>
    por_campanha?: Array<{
        campanha: string
        fonte: string
        medio: string
        count: number
        taxa_conversao: string
    }>
}

interface LeadsResponse {
    success: boolean
    data: {
        leads: Lead[]
        pagination: {
            page: number
            limit: number
            total: number
            pages: number
        }
        stats: LeadStats
    }
}

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<LeadStats>({})
    const [filtros, setFiltros] = useState({
        page: 1,
        status: '',
        temperatura: '',
        search: ''
    })

    const statusColors = {
        novo: 'bg-blue-100 text-blue-800',
        contactado: 'bg-yellow-100 text-yellow-800',
        qualificado: 'bg-purple-100 text-purple-800',
        negociando: 'bg-orange-100 text-orange-800',
        vendido: 'bg-green-100 text-green-800',
        perdido: 'bg-red-100 text-red-800'
    }

    const temperaturaColors = {
        frio: 'bg-blue-100 text-blue-600',
        morno: 'bg-yellow-100 text-yellow-600',
        quente: 'bg-red-100 text-red-600'
    }

    const buscarLeads = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: filtros.page.toString(),
                limit: '20'
            })

            if (filtros.status) params.append('status', filtros.status)
            if (filtros.temperatura) params.append('temperatura', filtros.temperatura)
            if (filtros.search) params.append('search', filtros.search)

            const response = await fetch(`/api/leads?${params}`)
            const data: LeadsResponse = await response.json()

            if (data.success) {
                setLeads(data.data.leads)
                setStats(data.data.stats)
            }
        } catch (error) {
            console.error('Erro ao buscar leads:', error)
        } finally {
            setLoading(false)
        }
    }, [filtros])

    useEffect(() => {
        buscarLeads()
    }, [buscarLeads])

    const formatarData = (data: string) => {
        return new Date(data).toLocaleString('pt-BR')
    }

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco)
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Cabeçalho */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Gestão de Leads
                    </h1>
                    <p className="text-gray-600">
                        Acompanhe e gerencie todos os leads capturados pela plataforma
                    </p>
                </div>

                {/* Estatísticas Gerais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total de Leads</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {Object.values(stats.por_status || {}).reduce((a, b) => a + b, 0)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Últimos 30 dias
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Leads Hoje</h3>
                        <p className="text-3xl font-bold text-blue-600">
                            {stats.leads_hoje || 0}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                            +{stats.crescimento_hoje || 0}% vs ontem
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Taxa Conversão</h3>
                        <p className="text-3xl font-bold text-purple-600">
                            {stats.taxa_conversao || '0.0'}%
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Leads → Vendas
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Custo/Lead</h3>
                        <p className="text-3xl font-bold text-green-600">
                            R$ {stats.custo_medio_lead || '0,00'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Média ponderada
                        </p>
                    </div>
                </div>

                {/* Métricas por Fonte UTM */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Leads por Fonte */}
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            📊 Leads por Fonte
                        </h3>
                        <div className="space-y-3">
                            {stats.por_fonte?.map((item, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full mr-3" style={{
                                            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
                                        }}></div>
                                        <span className="text-sm font-medium capitalize">
                                            {item.fonte || 'Direto'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold">{item.count}</div>
                                        <div className="text-xs text-gray-500">
                                            R$ {item.custo_medio || '0,00'}/lead
                                        </div>
                                    </div>
                                </div>
                            )) || (
                                    <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                                )}
                        </div>
                    </div>

                    {/* Performance por Campanha */}
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            🎯 Top Campanhas
                        </h3>
                        <div className="space-y-3">
                            {stats.por_campanha?.map((item, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium">
                                            {item.campanha || 'Sem campanha'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {item.fonte} • {item.medio}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold">{item.count} leads</div>
                                        <div className="text-xs text-green-600">
                                            {item.taxa_conversao || '0'}% conversão
                                        </div>
                                    </div>
                                </div>
                            )) || (
                                    <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                                )}
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-lg p-6 shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Buscar
                            </label>
                            <input
                                type="text"
                                value={filtros.search}
                                onChange={(e) => setFiltros({ ...filtros, search: e.target.value, page: 1 })}
                                placeholder="Nome, email ou telefone"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={filtros.status}
                                onChange={(e) => setFiltros({ ...filtros, status: e.target.value, page: 1 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todos</option>
                                <option value="novo">Novo</option>
                                <option value="contactado">Contactado</option>
                                <option value="qualificado">Qualificado</option>
                                <option value="negociando">Negociando</option>
                                <option value="vendido">Vendido</option>
                                <option value="perdido">Perdido</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Temperatura
                            </label>
                            <select
                                value={filtros.temperatura}
                                onChange={(e) => setFiltros({ ...filtros, temperatura: e.target.value, page: 1 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todas</option>
                                <option value="frio">Frio</option>
                                <option value="morno">Morno</option>
                                <option value="quente">Quente</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => setFiltros({ page: 1, status: '', temperatura: '', search: '' })}
                                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Leads */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Carregando leads...</p>
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-600">Nenhum lead encontrado</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lead
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Veículo de Interesse
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Temp.
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Criado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {lead.nome}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {lead.email}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {lead.telefone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {lead.veiculo_interesse ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {lead.veiculo_interesse.ano} {lead.veiculo_interesse.marca} {lead.veiculo_interesse.modelo}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {formatarPreco(Number(lead.veiculo_interesse.preco))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[lead.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${temperaturaColors[lead.temperatura as keyof typeof temperaturaColors] || 'bg-gray-100 text-gray-800'}`}>
                                                    {lead.temperatura}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {lead.score}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatarData(lead.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        const whatsappUrl = `https://wa.me/55${lead.telefone.replace(/\D/g, '')}`
                                                        window.open(whatsappUrl, '_blank')
                                                    }}
                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                >
                                                    WhatsApp
                                                </button>
                                                {lead.veiculo_interesse && (
                                                    <a
                                                        href={`/veiculo/${lead.veiculo_interesse.id}`}
                                                        target="_blank"
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Ver Veículo
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Instruções de Acesso */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        💡 Como acessar esta página
                    </h3>
                    <p className="text-blue-800 mb-4">
                        Esta é uma página administrativa para gestão de leads. Acesse através da URL:
                    </p>
                    <code className="bg-blue-100 text-blue-900 px-3 py-1 rounded font-mono text-sm">
                        http://localhost:3000/admin/leads
                    </code>
                    <p className="text-blue-700 text-sm mt-4">
                        <strong>Próximos passos:</strong> Implementar autenticação para proteger esta área administrativa.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
} 