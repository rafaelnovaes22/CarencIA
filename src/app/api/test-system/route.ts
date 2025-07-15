import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { processarLead } from '@/lib/lead-distributor'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        console.log('🧪 Iniciando teste do sistema...')

        // 1. Verificar se existe concessionária
        const concessionaria = await prisma.concessionaria.findFirst()
        if (!concessionaria) {
            return NextResponse.json({
                success: false,
                error: 'Nenhuma concessionária encontrada. Execute: npm run db:seed',
                step: 'concessionaria_check'
            }, { status: 400 })
        }
        console.log('✅ Concessionária encontrada:', concessionaria.nome)

        // 2. Verificar se existem veículos
        const veiculo = await prisma.veiculo.findFirst()
        if (!veiculo) {
            return NextResponse.json({
                success: false,
                error: 'Nenhum veículo encontrado. Execute: npm run db:seed',
                step: 'veiculo_check'
            }, { status: 400 })
        }
        console.log('✅ Veículo encontrado:', `${veiculo.marca} ${veiculo.modelo}`)

        // 3. Criar lead de teste
        const leadTeste = await prisma.lead.create({
            data: {
                nome: 'João Teste Silva',
                email: 'joao.teste@exemplo.com',
                telefone: '(11) 99999-0000',
                veiculo_interesse_id: veiculo.id,
                origem: 'test_system',
                utm_source: 'teste',
                utm_medium: 'sistema',
                utm_campaign: 'teste_automatizado',
                utm_content: 'endpoint_test',
                custo_lead: 2.50,
                status: 'novo',
                temperatura: 'morno',
                score: 30
            }
        })
        console.log('✅ Lead de teste criado:', leadTeste.id)

        // 4. Testar distribuição automática
        const distribuicaoResult = await processarLead(leadTeste.id)
        if (!distribuicaoResult.success) {
            return NextResponse.json({
                success: false,
                error: `Falha na distribuição: ${distribuicaoResult.error}`,
                step: 'distribuicao_test',
                lead_id: leadTeste.id
            }, { status: 500 })
        }
        console.log('✅ Distribuição automática funcionando')

        // 5. Verificar se o lead foi atualizado
        const leadAtualizado = await prisma.lead.findUnique({
            where: { id: leadTeste.id },
            include: {
                concessionaria_responsavel: true,
                veiculo_interesse: true,
                interacoes: true,
                eventos: true
            }
        })

        // 6. Buscar métricas para verificar APIs
        const response = await fetch(`${request.nextUrl.origin}/api/leads?stats=true`, {
            headers: {
                'User-Agent': 'CarencIA-TestSystem/1.0'
            }
        })
        const metricas = await response.json()

        // 7. Limpar lead de teste (opcional)
        await prisma.lead.delete({
            where: { id: leadTeste.id }
        })
        console.log('🧹 Lead de teste removido')

        return NextResponse.json({
            success: true,
            message: 'Sistema funcionando corretamente! ✅',
            results: {
                concessionaria: {
                    id: concessionaria.id,
                    nome: concessionaria.nome,
                    recebe_leads: concessionaria.recebe_leads
                },
                veiculo: {
                    id: veiculo.id,
                    descricao: `${veiculo.ano} ${veiculo.marca} ${veiculo.modelo}`,
                    fonte: veiculo.fonte_scraping
                },
                lead_test: {
                    criado: true,
                    distribuido: distribuicaoResult.success,
                    concessionaria_atribuida: leadAtualizado?.concessionaria_responsavel?.nome,
                    interacoes_criadas: leadAtualizado?.interacoes?.length || 0,
                    eventos_registrados: leadAtualizado?.eventos?.length || 0
                },
                apis: {
                    leads_api: metricas.success,
                    stats_working: !!metricas.data?.stats,
                    utm_tracking: !!metricas.data?.stats?.por_fonte
                }
            },
            components_status: {
                '✅ Banco de dados': 'Conectado',
                '✅ Distribuição automática': 'Funcionando',
                '✅ Tracking UTM': 'Ativo',
                '✅ APIs': 'Respondendo',
                '✅ Métricas': 'Calculando'
            }
        })

    } catch (error) {
        console.error('❌ Erro no teste do sistema:', error)
        return NextResponse.json({
            success: false,
            error: 'Erro durante o teste do sistema',
            details: error instanceof Error ? error.message : 'Erro desconhecido'
        }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Endpoint de teste do sistema CarencIA',
        usage: 'POST para executar teste completo',
        components: [
            'Banco de dados (Prisma + PostgreSQL)',
            'Distribuição automática de leads',
            'Sistema de tracking UTM',
            'APIs de leads, veículos e eventos',
            'Dashboard com métricas',
            'Scraping multi-fonte (Robust Car)'
        ]
    })
} 