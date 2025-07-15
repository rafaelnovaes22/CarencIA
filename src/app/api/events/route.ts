import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Registrar novo evento
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            lead_id,
            veiculo_id,
            evento,
            pagina,
            parametros
        } = body

        // Validações básicas
        if (!evento) {
            return NextResponse.json(
                { success: false, error: 'Tipo de evento é obrigatório' },
                { status: 400 }
            )
        }

        // Capturar dados do request
        const ip_address = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown'

        const user_agent = request.headers.get('user-agent') || 'unknown'

        // Registrar evento
        const eventoRegistrado = await prisma.evento.create({
            data: {
                lead_id: lead_id || null,
                veiculo_id: veiculo_id || null,
                evento,
                pagina: pagina || request.headers.get('referer') || '/',
                parametros: parametros || {},
                ip_address,
                user_agent
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                id: eventoRegistrado.id,
                evento: eventoRegistrado.evento,
                created_at: eventoRegistrado.created_at
            },
            message: 'Evento registrado com sucesso'
        })

    } catch (error) {
        console.error('Erro ao registrar evento:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

// GET - Buscar eventos (para analytics)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const evento = searchParams.get('evento')
        const lead_id = searchParams.get('lead_id')
        const veiculo_id = searchParams.get('veiculo_id')
        const data_inicio = searchParams.get('data_inicio')
        const data_fim = searchParams.get('data_fim')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')

        // Construir filtros
        const where: {
            evento?: string;
            lead_id?: string;
            veiculo_id?: string;
            created_at?: {
                gte?: Date;
                lte?: Date;
            };
        } = {}

        if (evento) {
            where.evento = evento
        }

        if (lead_id) {
            where.lead_id = lead_id
        }

        if (veiculo_id) {
            where.veiculo_id = veiculo_id
        }

        if (data_inicio || data_fim) {
            where.created_at = {}
            if (data_inicio) {
                where.created_at.gte = new Date(data_inicio)
            }
            if (data_fim) {
                where.created_at.lte = new Date(data_fim)
            }
        }

        // Buscar eventos
        const [eventos, total] = await Promise.all([
            prisma.evento.findMany({
                where,
                include: {
                    lead: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                            telefone: true
                        }
                    },
                    veiculo: {
                        select: {
                            id: true,
                            marca: true,
                            modelo: true,
                            ano: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.evento.count({ where })
        ])

        // Estatísticas se solicitado
        const includeStats = searchParams.get('stats') === 'true'
        let stats = null

        if (includeStats) {
            const [
                eventosPorTipo,
                eventosPorPagina,
                eventosHoje,
                eventosOntem
            ] = await Promise.all([
                prisma.evento.groupBy({
                    by: ['evento'],
                    _count: { id: true },
                    orderBy: { _count: { id: 'desc' } },
                    take: 10
                }),
                prisma.evento.groupBy({
                    by: ['pagina'],
                    _count: { id: true },
                    orderBy: { _count: { id: 'desc' } },
                    take: 10
                }),
                prisma.evento.count({
                    where: {
                        created_at: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                }),
                prisma.evento.count({
                    where: {
                        created_at: {
                            gte: new Date(new Date().setDate(new Date().getDate() - 1)),
                            lt: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                })
            ])

            stats = {
                eventos_por_tipo: eventosPorTipo.map(e => ({
                    evento: e.evento,
                    count: e._count.id
                })),
                eventos_por_pagina: eventosPorPagina.map(e => ({
                    pagina: e.pagina,
                    count: e._count.id
                })),
                eventos_hoje: eventosHoje,
                eventos_ontem: eventosOntem,
                crescimento: eventosOntem > 0 ?
                    ((eventosHoje - eventosOntem) / eventosOntem * 100).toFixed(1) :
                    '0'
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                eventos,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                stats
            }
        })

    } catch (error) {
        console.error('Erro ao buscar eventos:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
} 