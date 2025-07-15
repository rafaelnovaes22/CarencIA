import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Criar nova concessionária
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            nome,
            cidade,
            estado,
            telefone,
            email,
            website,
            scraping_ativo = true,
            scraping_config,
            recebe_leads = true,
            webhook_url
        } = body

        // Validações básicas
        if (!nome) {
            return NextResponse.json(
                { success: false, error: 'Nome é obrigatório' },
                { status: 400 }
            )
        }

        // Criar slug único baseado no nome
        const slug = nome.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 50)

        // Verificar se o slug já existe
        const existingConcessionaria = await prisma.concessionaria.findUnique({
            where: { slug }
        })

        if (existingConcessionaria) {
            return NextResponse.json(
                { success: false, error: 'Já existe uma concessionária com este nome' },
                { status: 400 }
            )
        }

        // Criar nova concessionária
        const concessionaria = await prisma.concessionaria.create({
            data: {
                nome,
                slug,
                cidade,
                estado,
                telefone,
                email,
                website,
                scraping_ativo,
                scraping_config,
                recebe_leads,
                webhook_url
            }
        })

        return NextResponse.json({
            success: true,
            data: concessionaria,
            message: 'Concessionária criada com sucesso'
        })

    } catch (error) {
        console.error('Erro ao criar concessionária:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

// GET - Listar concessionárias
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const includeStats = searchParams.get('stats') === 'true'

        const concessionarias = await prisma.concessionaria.findMany({
            include: {
                _count: includeStats ? {
                    select: {
                        veiculos: true,
                        leads: true
                    }
                } : false
            },
            orderBy: {
                nome: 'asc'
            }
        })

        // Se solicitado, incluir estatísticas detalhadas
        let stats = null
        if (includeStats) {
            stats = await Promise.all(
                concessionarias.map(async (concessionaria) => {
                    const [
                        veiculosAtivos,
                        leadsRecentes,
                        leadsHoje
                    ] = await Promise.all([
                        prisma.veiculo.count({
                            where: {
                                concessionaria_id: concessionaria.id,
                                disponivel: true
                            }
                        }),
                        prisma.lead.count({
                            where: {
                                concessionaria_responsavel_id: concessionaria.id,
                                created_at: {
                                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias
                                }
                            }
                        }),
                        prisma.lead.count({
                            where: {
                                concessionaria_responsavel_id: concessionaria.id,
                                created_at: {
                                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                                }
                            }
                        })
                    ])

                    return {
                        concessionaria_id: concessionaria.id,
                        veiculos_ativos: veiculosAtivos,
                        leads_30_dias: leadsRecentes,
                        leads_hoje: leadsHoje,
                        ultima_sincronizacao: concessionaria.ultima_sincronizacao
                    }
                })
            )
        }

        return NextResponse.json({
            success: true,
            data: {
                concessionarias,
                stats: stats || undefined
            }
        })

    } catch (error) {
        console.error('Erro ao buscar concessionárias:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

// PUT - Atualizar concessionária
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID da concessionária é obrigatório' },
                { status: 400 }
            )
        }

        // Verificar se a concessionária existe
        const existingConcessionaria = await prisma.concessionaria.findUnique({
            where: { id }
        })

        if (!existingConcessionaria) {
            return NextResponse.json(
                { success: false, error: 'Concessionária não encontrada' },
                { status: 404 }
            )
        }

        // Atualizar slug se o nome foi alterado
        if (updateData.nome && updateData.nome !== existingConcessionaria.nome) {
            const newSlug = updateData.nome.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '_')
                .substring(0, 50)

            // Verificar se o novo slug já existe
            const slugExists = await prisma.concessionaria.findFirst({
                where: {
                    slug: newSlug,
                    id: { not: id }
                }
            })

            if (slugExists) {
                return NextResponse.json(
                    { success: false, error: 'Já existe uma concessionária com este nome' },
                    { status: 400 }
                )
            }

            updateData.slug = newSlug
        }

        // Atualizar a concessionária
        const concessionaria = await prisma.concessionaria.update({
            where: { id },
            data: {
                ...updateData,
                updated_at: new Date()
            }
        })

        return NextResponse.json({
            success: true,
            data: concessionaria,
            message: 'Concessionária atualizada com sucesso'
        })

    } catch (error) {
        console.error('Erro ao atualizar concessionária:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
} 