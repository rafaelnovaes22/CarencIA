import { NextResponse } from 'next/server'
import { extractVeiculosFromRobustCar, updateVeiculosWithRobustCarData } from '../../../../scripts/extract-robust-car-photos'

export async function POST() {
    try {
        console.log('🚀 Iniciando extração de fotos da Robust Car via API...')

        // Verificar se a API key do Firecrawl está configurada
        if (!process.env.FIRECRAWL_API_KEY || process.env.FIRECRAWL_API_KEY === 'YOUR_API_KEY_HERE') {
            return NextResponse.json({
                success: false,
                message: 'API key do Firecrawl não configurada. Configure FIRECRAWL_API_KEY no arquivo .env',
                instructions: [
                    '1. Acesse https://www.firecrawl.dev/app/api-keys',
                    '2. Crie uma conta e gere uma API key',
                    '3. Adicione FIRECRAWL_API_KEY=sua_api_key_aqui no arquivo .env',
                    '4. Reinicie o servidor e tente novamente'
                ]
            }, { status: 400 })
        }

        // Extrair veículos do site
        const veiculos = await extractVeiculosFromRobustCar()

        if (veiculos.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Nenhum veículo encontrado no site da Robust Car',
                data: {
                    veiculos_encontrados: 0,
                    veiculos_atualizados: 0,
                    veiculos_criados: 0
                }
            })
        }

        // Atualizar banco de dados
        await updateVeiculosWithRobustCarData(veiculos)

        // Contar estatísticas
        const stats = {
            veiculos_encontrados: veiculos.length,
            fotos_totais: veiculos.reduce((total, v) => total + v.fotos.length, 0),
            veiculos_com_fotos: veiculos.filter(v => v.fotos.length > 0).length
        }

        return NextResponse.json({
            success: true,
            message: 'Extração de fotos concluída com sucesso!',
            data: {
                ...stats,
                veiculos: veiculos.map(v => ({
                    marca: v.marca,
                    modelo: v.modelo,
                    ano: v.ano,
                    fotos_count: v.fotos.length,
                    fotos_preview: v.fotos.slice(0, 2) // Mostrar apenas 2 fotos como preview
                }))
            }
        })

    } catch (error: unknown) {
        console.error('❌ Erro durante a extração:', error)

        return NextResponse.json({
            success: false,
            message: 'Erro durante a extração de fotos',
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            suggestions: [
                'Verifique se a API key do Firecrawl está correta',
                'Confirme se o site https://robustcar.com.br está acessível',
                'Tente novamente em alguns minutos'
            ]
        }, { status: 500 })
    }
}

// Endpoint para verificar configuração
export async function GET() {
    try {
        const hasApiKey = !!process.env.FIRECRAWL_API_KEY && process.env.FIRECRAWL_API_KEY !== 'YOUR_API_KEY_HERE'

        return NextResponse.json({
            success: true,
            message: 'Status da configuração de extração de fotos',
            data: {
                firecrawl_configured: hasApiKey,
                target_site: 'https://robustcar.com.br',
                features: [
                    'Extração automática de fotos dos veículos',
                    'Atualização automática do banco de dados',
                    'Mapeamento inteligente veículo -> fotos',
                    'Validação de URLs de imagens'
                ]
            }
        })

    } catch (error: unknown) {
        return NextResponse.json({
            success: false,
            message: 'Erro ao verificar configuração',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        }, { status: 500 })
    }
} 