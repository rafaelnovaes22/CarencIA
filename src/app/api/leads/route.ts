import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { processarLead } from '@/lib/lead-distributor'

const prisma = new PrismaClient()

// POST - Criar novo lead
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            nome,
            email,
            telefone,
            mensagem,
            veiculo_interesse_id,
            origem = 'website',
            forma_pagamento,
            prazo_compra
        } = body

        // Validações básicas
        if (!nome || !telefone) {
            return NextResponse.json(
                { success: false, error: 'Nome e telefone são obrigatórios' },
                { status: 400 }
            )
        }

        // Capturar dados do request
        const ip_address = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown'

        const user_agent = request.headers.get('user-agent') || 'unknown'

        // Capturar parâmetros UTM do corpo da requisição
        const {
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            utm_term,
            custo_lead
        } = body

        // Verificar se o lead já existe (mesmo email ou telefone)
        const leadExistente = await prisma.lead.findFirst({
            where: {
                OR: [
                    { email: email || '' },
                    { telefone }
                ]
            }
        })

        let lead

        if (leadExistente) {
            // Atualizar lead existente
            lead = await prisma.lead.update({
                where: { id: leadExistente.id },
                data: {
                    nome,
                    email: email || leadExistente.email,
                    veiculo_interesse_id,
                    forma_pagamento,
                    prazo_compra,
                    ip_address,
                    user_agent,
                    // Atualizar UTM parameters se fornecidos
                    utm_source: utm_source || leadExistente.utm_source,
                    utm_medium: utm_medium || leadExistente.utm_medium,
                    utm_campaign: utm_campaign || leadExistente.utm_campaign,
                    utm_content: utm_content || leadExistente.utm_content,
                    utm_term: utm_term || leadExistente.utm_term,
                    custo_lead: custo_lead ? parseFloat(custo_lead) : leadExistente.custo_lead,
                    updated_at: new Date()
                },
                include: {
                    veiculo_interesse: true
                }
            })

            // Registrar interação de atualização
            await prisma.interacao.create({
                data: {
                    lead_id: lead.id,
                    tipo: 'sistema',
                    canal: 'automatico',
                    assunto: 'Lead atualizado',
                    mensagem: `Lead atualizado via formulário de interesse. ${mensagem ? `Mensagem: ${mensagem}` : ''}`,
                    enviado_por: 'sistema'
                }
            })

        } else {
            // Criar novo lead
            lead = await prisma.lead.create({
                data: {
                    nome,
                    email: email || '',
                    telefone,
                    veiculo_interesse_id,
                    origem,
                    forma_pagamento,
                    prazo_compra,
                    ip_address,
                    user_agent,
                    // Parâmetros UTM para tracking
                    utm_source,
                    utm_medium,
                    utm_campaign,
                    utm_content,
                    utm_term,
                    custo_lead: custo_lead ? parseFloat(custo_lead) : null,
                    status: 'novo',
                    temperatura: 'morno', // Formulário preenchido = interesse
                    score: 25 // Score inicial por demonstrar interesse
                },
                include: {
                    veiculo_interesse: true
                }
            })

            // Registrar interação inicial
            await prisma.interacao.create({
                data: {
                    lead_id: lead.id,
                    tipo: 'sistema',
                    canal: 'automatico',
                    assunto: 'Lead criado',
                    mensagem: `Novo lead criado via formulário de interesse. ${mensagem ? `Mensagem: ${mensagem}` : ''}`,
                    enviado_por: 'sistema'
                }
            })
        }

        // Registrar evento de conversão
        await prisma.evento.create({
            data: {
                lead_id: lead.id,
                veiculo_id: veiculo_interesse_id,
                evento: 'form_submit',
                pagina: veiculo_interesse_id ? `/veiculo/${veiculo_interesse_id}` : '/catalogo',
                parametros: {
                    tipo: 'formulario_interesse',
                    origem,
                    mensagem: mensagem || null,
                    utm_source,
                    utm_medium,
                    utm_campaign
                },
                ip_address,
                user_agent
            }
        })

        // Processar distribuição automática do lead
        try {
            const distribuicaoResult = await processarLead(lead.id)
            if (distribuicaoResult.success) {
                console.log(`✅ Lead ${lead.id} distribuído para: ${distribuicaoResult.concessionaria?.nome}`)
            } else {
                console.warn(`⚠️ Falha na distribuição do lead ${lead.id}:`, distribuicaoResult.error)
            }
        } catch (error) {
            console.error('❌ Erro na distribuição automática:', error)
            // Não falhar a criação do lead por causa de erro na distribuição
        }

        return NextResponse.json({
            success: true,
            data: {
                id: lead.id,
                nome: lead.nome,
                email: lead.email,
                telefone: lead.telefone,
                status: lead.status,
                veiculo_interesse: lead.veiculo_interesse
            },
            message: leadExistente ? 'Lead atualizado com sucesso' : 'Lead criado com sucesso'
        })

    } catch (error) {
        console.error('Erro ao processar lead:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

// GET - Listar leads (admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const status = searchParams.get('status')
        const temperatura = searchParams.get('temperatura')
        const veiculo_id = searchParams.get('veiculo_id')
        const search = searchParams.get('search')

        const skip = (page - 1) * limit

        // Construir filtros
        const where: {
            status?: string;
            temperatura?: string;
            veiculo_interesse_id?: string;
            OR?: Array<{
                nome?: { contains: string; mode: 'insensitive' };
                email?: { contains: string; mode: 'insensitive' };
                telefone?: { contains: string; mode: 'insensitive' };
            }>;
        } = {}

        if (status) {
            where.status = status
        }

        if (temperatura) {
            where.temperatura = temperatura
        }

        if (veiculo_id) {
            where.veiculo_interesse_id = veiculo_id
        }

        if (search) {
            where.OR = [
                { nome: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { telefone: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Buscar leads
        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                include: {
                    veiculo_interesse: {
                        select: {
                            id: true,
                            marca: true,
                            modelo: true,
                            ano: true,
                            preco: true
                        }
                    },
                    _count: {
                        select: {
                            interacoes: true,
                            agendamentos: true
                        }
                    }
                },
                orderBy: [
                    { updated_at: 'desc' }
                ],
                skip,
                take: limit
            }),
            prisma.lead.count({ where })
        ])

        // Estatísticas avançadas
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        const ontem = new Date(hoje)
        ontem.setDate(ontem.getDate() - 1)
        const umMesAtras = new Date()
        umMesAtras.setDate(umMesAtras.getDate() - 30)

        const [
            stats,
            temperaturas,
            leadsHoje,
            leadsOntem,
            leadsVendidos,
            leadsPorFonte,
            leadsPorCampanha,
            custoTotal
        ] = await Promise.all([
            // Stats por status
            prisma.lead.groupBy({
                by: ['status'],
                _count: { id: true }
            }),
            // Stats por temperatura
            prisma.lead.groupBy({
                by: ['temperatura'],
                _count: { id: true }
            }),
            // Leads hoje
            prisma.lead.count({
                where: {
                    created_at: { gte: hoje }
                }
            }),
            // Leads ontem
            prisma.lead.count({
                where: {
                    created_at: {
                        gte: ontem,
                        lt: hoje
                    }
                }
            }),
            // Leads vendidos (últimos 30 dias)
            prisma.lead.count({
                where: {
                    status: 'vendido',
                    created_at: { gte: umMesAtras }
                }
            }),
            // Leads por fonte UTM
            prisma.lead.groupBy({
                by: ['utm_source'],
                _count: { id: true },
                _avg: { custo_lead: true },
                where: {
                    created_at: { gte: umMesAtras }
                },
                orderBy: { _count: { id: 'desc' } },
                take: 5
            }),
            // Leads por campanha
            prisma.lead.groupBy({
                by: ['utm_campaign', 'utm_source', 'utm_medium'],
                _count: { id: true },
                where: {
                    created_at: { gte: umMesAtras },
                    utm_campaign: { not: null }
                },
                orderBy: { _count: { id: 'desc' } },
                take: 5
            }),
            // Custo total de leads
            prisma.lead.aggregate({
                _sum: { custo_lead: true },
                _count: { custo_lead: true },
                where: {
                    created_at: { gte: umMesAtras },
                    custo_lead: { not: null }
                }
            })
        ])

        // Calcular métricas derivadas
        const totalLeads30Dias = stats.reduce((acc, item) => acc + item._count.id, 0)
        const taxaConversao = totalLeads30Dias > 0 ? (leadsVendidos / totalLeads30Dias * 100).toFixed(1) : '0.0'
        const crescimentoHoje = leadsOntem > 0 ? ((leadsHoje - leadsOntem) / leadsOntem * 100).toFixed(1) : '0'
        const custoMedioLead = custoTotal._count.custo_lead > 0
            ? (Number(custoTotal._sum.custo_lead) / custoTotal._count.custo_lead).toFixed(2)
            : '0,00'

        return NextResponse.json({
            success: true,
            data: {
                leads,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                stats: {
                    // Estatísticas básicas
                    por_status: stats.reduce((acc, item) => {
                        acc[item.status] = item._count.id
                        return acc
                    }, {} as Record<string, number>),
                    por_temperatura: temperaturas.reduce((acc, item) => {
                        acc[item.temperatura] = item._count.id
                        return acc
                    }, {} as Record<string, number>),

                    // Métricas de performance
                    leads_hoje: leadsHoje,
                    leads_ontem: leadsOntem,
                    crescimento_hoje: crescimentoHoje,
                    taxa_conversao: taxaConversao,
                    custo_medio_lead: custoMedioLead,

                    // Métricas por fonte UTM
                    por_fonte: leadsPorFonte.map(item => ({
                        fonte: item.utm_source || 'direto',
                        count: item._count.id,
                        custo_medio: item._avg.custo_lead ? Number(item._avg.custo_lead).toFixed(2) : '0,00'
                    })),

                    // Métricas por campanha
                    por_campanha: leadsPorCampanha.map(item => ({
                        campanha: item.utm_campaign,
                        fonte: item.utm_source,
                        meio: item.utm_medium,
                        count: item._count.id,
                        taxa_conversao: '0' // TODO: Calcular taxa de conversão por campanha
                    }))
                }
            }
        })

    } catch (error) {
        console.error('Erro ao buscar leads:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
} 