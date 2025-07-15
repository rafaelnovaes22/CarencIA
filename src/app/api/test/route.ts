import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
    try {
        // Testar conexão e buscar dados
        const [
            configuracoes,
            campanhas,
            veiculos,
            veiculosDestaque,
            stats
        ] = await Promise.all([
            db.getConfiguracoes(),
            db.getCampanhas(),
            db.getVeiculos({ per_page: 5 }),
            db.getVeiculosDestaque(),
            db.getLeadStats()
        ])

        return NextResponse.json({
            success: true,
            message: 'Conexão com banco de dados funcionando!',
            data: {
                configuracoes_count: configuracoes.length,
                campanhas_count: campanhas.length,
                veiculos_total: veiculos.total,
                veiculos_destaque: veiculosDestaque.length,
                stats
            },
            timestamp: new Date().toISOString()
        })
    } catch (error: unknown) {
        console.error('Erro no teste de banco:', error)

        return NextResponse.json({
            success: false,
            message: 'Erro na conexão com banco de dados',
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
} 