import { PrismaClient } from '@prisma/client'
import type {
    Lead,
    Veiculo,
    Interacao,
    Simulacao,
    Agendamento,
    Evento,
    LeadQuery,
    VeiculoQuery,
    LeadFormData,
    PaginatedResponse
} from '@/types/database'

// Configuração do Prisma Client
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Funções utilitárias para consultas
export const db = {
    // Leads
    async createLead(data: LeadFormData & {
        origem?: string;
        ip_address?: string;
        user_agent?: string;
        campanha_id?: string
    }) {
        const lead = await prisma.lead.create({
            data: {
                nome: data.nome,
                email: data.email,
                telefone: data.telefone,
                marca_interesse: data.marca_interesse,
                modelo_interesse: data.modelo_interesse,
                faixa_preco_min: data.faixa_preco_min,
                faixa_preco_max: data.faixa_preco_max,
                forma_pagamento: data.forma_pagamento,
                tem_veiculo_troca: data.tem_veiculo_troca || false,
                veiculo_troca_marca: data.veiculo_troca_marca,
                veiculo_troca_modelo: data.veiculo_troca_modelo,
                veiculo_troca_ano: data.veiculo_troca_ano,
                prazo_compra: data.prazo_compra,
                observacoes: data.observacoes,
                origem: data.origem || 'website',
                ip_address: data.ip_address,
                user_agent: data.user_agent,
                campanha_id: data.campanha_id,
                score: calculateLeadScore(data)
            },
            include: {
                veiculo_interesse: true,
                campanha: true
            }
        })

        return lead
    },

    async getLeads(query: LeadQuery = {}): Promise<PaginatedResponse<Lead>> {
        const page = query.page || 1
        const per_page = query.per_page || 50
        const skip = (page - 1) * per_page

        const where: {
            status?: string;
            origem?: string;
            campanha_id?: string;
            OR?: Array<{
                nome?: { contains: string; mode: 'insensitive' };
                email?: { contains: string; mode: 'insensitive' };
                telefone?: { contains: string; mode: 'insensitive' };
            }>;
            created_at?: {
                gte?: Date;
                lte?: Date;
            };
        } = {}

        if (query.status) {
            where.status = query.status
        }

        if (query.origem) {
            where.origem = query.origem
        }

        if (query.campanha_id) {
            where.campanha_id = query.campanha_id
        }

        if (query.search) {
            where.OR = [
                { nome: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
                { telefone: { contains: query.search, mode: 'insensitive' } }
            ]
        }

        if (query.data_inicio) {
            where.created_at = { gte: query.data_inicio }
        }

        if (query.data_fim) {
            where.created_at = {
                ...where.created_at,
                lte: query.data_fim
            }
        }

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                include: {
                    veiculo_interesse: true,
                    campanha: true
                },
                orderBy: { created_at: 'desc' },
                skip,
                take: per_page
            }),
            prisma.lead.count({ where })
        ])

        return {
            data: leads as Lead[],
            total,
            page,
            per_page,
            total_pages: Math.ceil(total / per_page)
        }
    },

    async updateLead(id: string, data: Partial<Lead>) {
        const lead = await prisma.lead.update({
            where: { id },
            data,
            include: {
                veiculo_interesse: true,
                campanha: true
            }
        })

        return lead
    },

    async getLeadById(id: string) {
        const lead = await prisma.lead.findUnique({
            where: { id },
            include: {
                veiculo_interesse: true,
                campanha: true,
                interacoes: {
                    orderBy: { created_at: 'desc' }
                },
                simulacoes: {
                    orderBy: { created_at: 'desc' }
                },
                agendamentos: {
                    orderBy: { created_at: 'desc' }
                },
                eventos: {
                    orderBy: { created_at: 'desc' }
                }
            }
        })

        return lead
    },

    // Veículos
    async createVeiculo(data: Omit<Veiculo, 'id' | 'created_at' | 'updated_at'>) {
        const veiculo = await prisma.veiculo.create({
            data: {
                marca: data.marca,
                modelo: data.modelo,
                versao: data.versao,
                ano: data.ano,
                combustivel: data.combustivel,
                cambio: data.cambio,
                cor: data.cor,
                km: data.km,
                preco: data.preco,
                preco_promocional: data.preco_promocional,
                fotos: data.fotos,
                descricao: data.descricao,
                opcionais: data.opcionais,
                placa: data.placa,
                chassi: data.chassi,
                renavam: data.renavam,
                disponivel: data.disponivel,
                destaque: data.destaque
            }
        })

        return veiculo
    },

    async getVeiculos(query: VeiculoQuery = {}): Promise<PaginatedResponse<Veiculo>> {
        const page = query.page || 1
        const per_page = query.per_page || 20
        const skip = (page - 1) * per_page

        const where: {
            disponivel: boolean;
            marca?: string;
            modelo?: { contains: string; mode: 'insensitive' };
            ano?: { gte?: number; lte?: number };
            preco?: { gte?: number; lte?: number };
            combustivel?: string;
            destaque?: boolean;
            OR?: Array<{
                marca?: { contains: string; mode: 'insensitive' };
                modelo?: { contains: string; mode: 'insensitive' };
            }>;
        } = { disponivel: true }

        if (query.marca) {
            where.marca = query.marca
        }

        if (query.modelo) {
            where.modelo = { contains: query.modelo, mode: 'insensitive' }
        }

        if (query.ano_min) {
            where.ano = { gte: query.ano_min }
        }

        if (query.ano_max) {
            where.ano = { ...where.ano, lte: query.ano_max }
        }

        if (query.preco_min) {
            where.preco = { gte: query.preco_min }
        }

        if (query.preco_max) {
            where.preco = { ...where.preco, lte: query.preco_max }
        }

        if (query.combustivel) {
            where.combustivel = query.combustivel
        }

        if (query.destaque !== undefined) {
            where.destaque = query.destaque
        }

        if (query.search) {
            where.OR = [
                { marca: { contains: query.search, mode: 'insensitive' } },
                { modelo: { contains: query.search, mode: 'insensitive' } }
            ]
        }

        const [veiculos, total] = await Promise.all([
            prisma.veiculo.findMany({
                where,
                orderBy: { created_at: 'desc' },
                skip,
                take: per_page
            }),
            prisma.veiculo.count({ where })
        ])

        return {
            data: veiculos as Veiculo[],
            total,
            page,
            per_page,
            total_pages: Math.ceil(total / per_page)
        }
    },

    async getVeiculoById(id: string) {
        const veiculo = await prisma.veiculo.findUnique({
            where: { id },
            include: {
                leads_interessados: true,
                simulacoes: true,
                agendamentos: true
            }
        })

        return veiculo
    },

    async getVeiculosDestaque() {
        const veiculos = await prisma.veiculo.findMany({
            where: {
                disponivel: true,
                destaque: true
            },
            orderBy: { created_at: 'desc' },
            take: 6
        })

        return veiculos
    },

    // Interações
    async createInteracao(data: Omit<Interacao, 'id' | 'created_at'>) {
        const interacao = await prisma.interacao.create({
            data: {
                lead_id: data.lead_id,
                tipo: data.tipo,
                canal: data.canal,
                assunto: data.assunto,
                mensagem: data.mensagem,
                anexos: data.anexos,
                enviado_por: data.enviado_por,
                status: data.status
            }
        })

        return interacao
    },

    async getInteracoesByLead(leadId: string) {
        const interacoes = await prisma.interacao.findMany({
            where: { lead_id: leadId },
            orderBy: { created_at: 'desc' }
        })

        return interacoes
    },

    // Simulações
    async createSimulacao(data: Omit<Simulacao, 'id' | 'created_at'>) {
        const simulacao = await prisma.simulacao.create({
            data: {
                lead_id: data.lead_id,
                veiculo_id: data.veiculo_id,
                valor_veiculo: data.valor_veiculo,
                valor_entrada: data.valor_entrada,
                valor_financiado: data.valor_financiado,
                prazo_meses: data.prazo_meses,
                taxa_juros: data.taxa_juros,
                valor_parcela: data.valor_parcela,
                valor_total: data.valor_total,
                banco: data.banco,
                aprovado: data.aprovado
            }
        })

        return simulacao
    },

    // Agendamentos
    async createAgendamento(data: Omit<Agendamento, 'id' | 'created_at' | 'updated_at'>) {
        const agendamento = await prisma.agendamento.create({
            data: {
                lead_id: data.lead_id,
                veiculo_id: data.veiculo_id,
                tipo: data.tipo,
                data_agendamento: data.data_agendamento,
                status: data.status,
                observacoes: data.observacoes
            }
        })

        return agendamento
    },

    // Eventos de tracking
    async createEvento(data: Omit<Evento, 'id' | 'created_at'>) {
        const evento = await prisma.evento.create({
            data: {
                lead_id: data.lead_id,
                veiculo_id: data.veiculo_id,
                evento: data.evento,
                pagina: data.pagina,
                parametros: data.parametros || undefined,
                ip_address: data.ip_address,
                user_agent: data.user_agent
            }
        })

        return evento
    },

    // Configurações
    async getConfiguracoes() {
        const configuracoes = await prisma.configuracao.findMany({
            orderBy: { chave: 'asc' }
        })

        return configuracoes
    },

    async getConfiguracao(chave: string) {
        const configuracao = await prisma.configuracao.findUnique({
            where: { chave }
        })

        return configuracao
    },

    async setConfiguracao(chave: string, valor: string, descricao?: string) {
        const configuracao = await prisma.configuracao.upsert({
            where: { chave },
            update: { valor, descricao },
            create: { chave, valor, descricao }
        })

        return configuracao
    },

    // Campanhas
    async getCampanhas() {
        const campanhas = await prisma.campanha.findMany({
            where: { ativo: true },
            orderBy: { created_at: 'desc' }
        })

        return campanhas
    },

    async getCampanhaByUtm(utm_source: string, utm_medium?: string, utm_campaign?: string) {
        const campanha = await prisma.campanha.findFirst({
            where: {
                utm_source,
                utm_medium,
                utm_campaign,
                ativo: true
            }
        })

        return campanha
    },

    // Estatísticas
    async getLeadStats() {
        const hoje = new Date()
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
        const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())

        const [totalLeads, leadsMes, leadsHoje] = await Promise.all([
            prisma.lead.count(),
            prisma.lead.count({
                where: {
                    created_at: { gte: inicioMes }
                }
            }),
            prisma.lead.count({
                where: {
                    created_at: { gte: inicioHoje }
                }
            })
        ])

        return {
            total_leads: totalLeads,
            leads_mes: leadsMes,
            leads_hoje: leadsHoje
        }
    },

    async getVeiculoStats() {
        const [totalVeiculos, veiculosDisponiveis, veiculosDestaque] = await Promise.all([
            prisma.veiculo.count(),
            prisma.veiculo.count({
                where: { disponivel: true }
            }),
            prisma.veiculo.count({
                where: { destaque: true }
            })
        ])

        return {
            total_veiculos: totalVeiculos,
            veiculos_disponiveis: veiculosDisponiveis,
            veiculos_destaque: veiculosDestaque
        }
    },

    async getLeadsPorStatus() {
        const leads = await prisma.lead.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        })

        return leads.reduce((acc, item) => {
            acc[item.status] = item._count.id
            return acc
        }, {} as Record<string, number>)
    },

    async getLeadsPorOrigem() {
        const leads = await prisma.lead.groupBy({
            by: ['origem'],
            _count: {
                id: true
            }
        })

        return leads.reduce((acc, item) => {
            acc[item.origem] = item._count.id
            return acc
        }, {} as Record<string, number>)
    },

    async getVeiculosPorMarca() {
        const veiculos = await prisma.veiculo.groupBy({
            by: ['marca'],
            _count: {
                id: true
            },
            where: { disponivel: true }
        })

        return veiculos.reduce((acc, item) => {
            acc[item.marca] = item._count.id
            return acc
        }, {} as Record<string, number>)
    }
}

// Função para calcular score do lead
function calculateLeadScore(data: LeadFormData): number {
    let score = 0

    // Pontuação base por ter dados completos
    if (data.nome && data.email && data.telefone) score += 20

    // Interesse específico em veículo
    if (data.marca_interesse) score += 15
    if (data.modelo_interesse) score += 10

    // Faixa de preço definida
    if (data.faixa_preco_min || data.faixa_preco_max) score += 15

    // Forma de pagamento
    if (data.forma_pagamento === 'avista') score += 30
    if (data.forma_pagamento === 'financiado') score += 20

    // Prazo de compra
    if (data.prazo_compra === 'imediato') score += 25
    if (data.prazo_compra === '30_dias') score += 20
    if (data.prazo_compra === '60_dias') score += 15

    // Veículo para troca
    if (data.tem_veiculo_troca) score += 10

    return Math.min(score, 100) // Máximo 100
}

// Função para conectar/desconectar do banco
export async function connectDatabase() {
    try {
        await prisma.$connect()
        console.log('✅ Conectado ao PostgreSQL via Prisma')
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error)
        throw error
    }
}

export async function disconnectDatabase() {
    try {
        await prisma.$disconnect()
        console.log('✅ Desconectado do PostgreSQL')
    } catch (error) {
        console.error('❌ Erro ao desconectar do banco:', error)
    }
}

// Função para verificar saúde do banco
export async function checkDatabaseHealth() {
    try {
        await prisma.$queryRaw`SELECT 1`
        return { status: 'healthy', timestamp: new Date() }
    } catch (error) {
        return { status: 'error', error: error instanceof Error ? error.message : 'Erro desconhecido', timestamp: new Date() }
    }
} 