import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Parâmetros de filtro
        const marca = searchParams.get('marca')
        const modelo = searchParams.get('modelo')
        const anoMin = searchParams.get('anoMin')
        const anoMax = searchParams.get('anoMax')
        const precoMin = searchParams.get('precoMin')
        const precoMax = searchParams.get('precoMax')
        const combustivel = searchParams.get('combustivel')
        const cambio = searchParams.get('cambio')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')

        // Construir filtros dinâmicos
        const where: {
            marca?: { contains: string; mode: 'insensitive' };
            modelo?: { contains: string; mode: 'insensitive' };
            ano?: { gte?: number; lte?: number };
            preco?: { gte?: number; lte?: number };
            combustivel?: { contains: string; mode: 'insensitive' };
            cambio?: { contains: string; mode: 'insensitive' };
        } = {}

        if (marca) {
            where.marca = { contains: marca, mode: 'insensitive' }
        }

        if (modelo) {
            where.modelo = { contains: modelo, mode: 'insensitive' }
        }

        if (anoMin || anoMax) {
            where.ano = {}
            if (anoMin) where.ano.gte = parseInt(anoMin)
            if (anoMax) where.ano.lte = parseInt(anoMax)
        }

        if (precoMin || precoMax) {
            where.preco = {}
            if (precoMin) where.preco.gte = parseFloat(precoMin)
            if (precoMax) where.preco.lte = parseFloat(precoMax)
        }

        if (combustivel) {
            where.combustivel = { contains: combustivel, mode: 'insensitive' }
        }

        if (cambio) {
            where.cambio = { contains: cambio, mode: 'insensitive' }
        }

        // Contar total para paginação
        const total = await prisma.veiculo.count({ where })

        // Buscar veículos com paginação
        const veiculos = await prisma.veiculo.findMany({
            where,
            orderBy: [
                { updated_at: 'desc' },
                { preco: 'asc' }
            ],
            skip: (page - 1) * limit,
            take: limit,
        })

        // Buscar marcas únicas para filtros
        const marcasUnicas = await prisma.veiculo.groupBy({
            by: ['marca'],
            _count: { marca: true },
            orderBy: { marca: 'asc' }
        })

        // Buscar modelos únicos para filtros
        const modelosUnicos = await prisma.veiculo.groupBy({
            by: ['modelo'],
            _count: { modelo: true },
            orderBy: { modelo: 'asc' }
        })

        return NextResponse.json({
            success: true,
            data: {
                veiculos,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                },
                filtros: {
                    marcas: marcasUnicas.map(m => ({ marca: m.marca, count: m._count.marca })),
                    modelos: modelosUnicos.map(m => ({ modelo: m.modelo, count: m._count.modelo }))
                }
            }
        })

    } catch (error) {
        console.error('Erro ao buscar veículos:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
} 