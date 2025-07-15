import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Validar se o ID é válido (não vazio)
        if (!id || id.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'ID do veículo inválido' },
                { status: 400 }
            )
        }

        // Buscar o veículo
        const veiculo = await prisma.veiculo.findUnique({
            where: { id: id }
        })

        if (!veiculo) {
            return NextResponse.json(
                { success: false, error: 'Veículo não encontrado' },
                { status: 404 }
            )
        }

        // Buscar veículos similares (mesma marca, modelo diferente ou mesmo modelo, ano próximo)
        const veiculosSimilares = await prisma.veiculo.findMany({
            where: {
                AND: [
                    { id: { not: id } }, // Excluir o veículo atual
                    {
                        OR: [
                            {
                                marca: veiculo.marca,
                                modelo: { not: veiculo.modelo }
                            },
                            {
                                marca: veiculo.marca,
                                modelo: veiculo.modelo,
                                ano: {
                                    gte: veiculo.ano - 2,
                                    lte: veiculo.ano + 2
                                }
                            }
                        ]
                    }
                ]
            },
            orderBy: [
                { updated_at: 'desc' },
                { preco: 'asc' }
            ],
            take: 4 // Máximo 4 veículos similares
        })

        return NextResponse.json({
            success: true,
            data: {
                veiculo,
                similares: veiculosSimilares
            }
        })

    } catch (error) {
        console.error('Erro ao buscar veículo:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
} 