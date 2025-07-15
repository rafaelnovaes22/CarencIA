import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()

// Configurar OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
})

interface FiltrosInteligentes {
    marcas?: string[]
    modelos?: string[]
    anoMin?: number
    anoMax?: number
    precoMin?: number
    precoMax?: number
    combustivel?: string[]
    cambio?: string[]
    cores?: string[]
    categorias?: string[]
    caracteristicas?: string[]
    confianca: number
}

export async function POST(request: NextRequest) {
    try {
        const { busca } = await request.json()

        if (!busca || typeof busca !== 'string') {
            return NextResponse.json({
                success: false,
                error: 'Busca é obrigatória'
            }, { status: 400 })
        }

        // Verificar se a API key da OpenAI está configurada
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'OpenAI API key não configurada. Configure OPENAI_API_KEY no arquivo .env'
            }, { status: 500 })
        }

        console.log('🤖 Processando busca inteligente:', busca)

        // Buscar informações do banco para contexto
        const [marcasDisponiveis, modelosDisponiveis] = await Promise.all([
            prisma.veiculo.groupBy({
                by: ['marca'],
                where: { ativo_origem: true },
                _count: { marca: true },
                orderBy: { _count: { marca: 'desc' } }
            }),
            prisma.veiculo.groupBy({
                by: ['modelo'],
                where: { ativo_origem: true },
                _count: { modelo: true },
                orderBy: { _count: { modelo: 'desc' } }
            })
        ])

        // Criar prompt estruturado para a OpenAI
        const prompt = `
VOCÊ É UM ESPECIALISTA EM VENDAS DE VEÍCULOS NO BRASIL. Sua missão é analisar a necessidade do cliente e transformar em filtros estruturados para encontrar o veículo ideal.

=== CONTEXTO DO INVENTÁRIO ===
MARCAS DISPONÍVEIS: ${marcasDisponiveis.map(m => m.marca).join(', ')}
MODELOS POPULARES: ${modelosDisponiveis.slice(0, 20).map(m => m.modelo).join(', ')}

=== NECESSIDADE DO CLIENTE ===
"${busca}"

=== PROCESSO DE ANÁLISE (PENSE PASSO A PASSO) ===

PASSO 1 - IDENTIFIQUE O PERFIL DO USUÁRIO:
- Família com filhos → "familiar", "espaçoso", "seguro"
- Profissional autônomo → "trabalho", "econômico", "confiável" 
- Jovem → "esportivo", "moderno", "tecnologia"
- Primeira compra → "básico", "econômico", "simples"
- Luxo/status → "luxo", "premium", "diferenciado"

PASSO 2 - DETECTE SINÔNIMOS E VARIAÇÕES:
Marcas: Honda = Honda, VW = Volkswagen, Chevy = Chevrolet, Fiat = Fiat, GM = Chevrolet, Toyota = Toyota, Renault = Renault, Nissan = Nissan, Hyundai = Hyundai, Kia = Kia, Ford = Ford, Peugeot = Peugeot, Citroën = Citroen

Modelos: Civic = CIVIC, Corolla = COROLLA, Golf = GOLF, Polo = POLO, Up = UP!, Gol = GOL, Fiesta = FIESTA, Ka = KA, Onix = ONIX, Prisma = PRISMA, HB20 = HB20, Creta = CRETA, Kicks = KICKS, Captur = CAPTUR, HR-V = HR-V, T-Cross = T-CROSS

Categorias: SUV = utilitário esportivo, crossover, 4x4, todo terreno / Sedan = sedã, 4 portas / Hatch = hatchback, compacto, 2 ou 4 portas / Pickup = picape, caminhonete / Wagon = perua, familiar

PASSO 3 - INTERPRETE EXPRESSÕES TEMPORAIS:
- "novo", "zero km" → ano atual (2024/2025)
- "2020 em diante", "a partir de 2020" → anoMin: 2020
- "até 2018", "anterior a 2019" → anoMax: 2018
- "entre 2018 e 2022" → anoMin: 2018, anoMax: 2022
- "recente", "novo" → anoMin: 2020
⚠️ IMPORTANTE: NÃO infira expressões temporais apenas por contexto (trabalho, família, etc). Só aplique filtros de preço se o usuário mencionar EXPLICITAMENTE valores ou termos financeiros.


PASSO 4 - DECODIFIQUE VALORES FINANCEIROS (APENAS SE EXPLICITAMENTE MENCIONADOS):
- "até 30 mil", "máximo 30k", "no máximo R$ 30.000" → precoMax: 30000
- "acima de 50k", "mais de 50 mil" → precoMin: 50000
- "entre 40 e 60 mil" → precoMin: 40000, precoMax: 60000
- "barato", "em conta", "valor baixo" → precoMax: 40000
- "premium", "caro", "valor alto" → precoMin: 80000
🚨 REGRA CRÍTICA: NUNCA adicione filtros de preço (precoMin/precoMax) a menos que o usuário mencione EXPLICITAMENTE:
- Valores específicos: "até 50 mil", "máximo 30k", "entre 40 e 60k"
- Termos financeiros diretos: "barato", "caro", "premium", "valor baixo", "valor alto"
- NÃO inferir preços por contexto como: trabalho, família, primeiro carro, jovem, etc.
- Se houver dúvida, NÃO aplique filtro de preço.

PASSO 5 - IDENTIFIQUE CARACTERÍSTICAS TÉCNICAS:
Combustível:
- "econômico", "gasta pouco", "economia" → FLEX
- "potente", "performance" → GASOLINA
- "diesel", "a diesel" → DIESEL
- "híbrido", "sustentável" → HIBRIDO
- "elétrico" → ELETRICO

Câmbio:
- "automático", "sem embreagem", "direção suave" → AUTOMATICO, CVT
- "manual", "com embreagem" → MANUAL
- "CVT", "continuamente variável" → CVT

PASSO 6 - CONTEXTUALIZE PARA USO BRASILEIRO:
- "para cidade" → hatch, econômico, compacto
- "para estrada" → sedan, mais potente
- "para família" → SUV, wagon, espaçoso, seguro
- "primeiro carro" → básico, econômico, confiável
- "para trabalho" → econômico, resistente, baixa manutenção
- "uber/app" → sedan, econômico, confortável, 4 portas

PASSO 7 - ANALISE CONTEXTO EMOCIONAL:
- "sonho", "sempre quis" → marca/modelo específico mencionado
- "necessidade", "preciso" → funcionalidade prioritária
- "urgente" → disponibilidade imediata
- "investimento" → foco em valor de revenda

PASSO 8 - CONSIDERE PADRÕES REGIONAIS BRASILEIROS:
- Automático é premium no Brasil → maior preço esperado
- FLEX é padrão → economia prioritária
- SUV = status + família
- Sedan = Uber/executivo
- Hatch = juventude/economia

=== FORMATO DE RESPOSTA (APENAS JSON) ===
{
  "marcas": ["array de marcas em MAIÚSCULO"],
  "modelos": ["array de modelos em MAIÚSCULO"],
  "anoMin": número ou null,
  "anoMax": número ou null,
  "precoMin": número ou null (⚠️ APENAS se valor explícito mencionado),
  "precoMax": número ou null (⚠️ APENAS se valor explícito mencionado),
  "combustivel": ["FLEX", "GASOLINA", "DIESEL", "HIBRIDO", "ELETRICO"],
  "cambio": ["MANUAL", "AUTOMATICO", "CVT"],
  "cores": ["cores em MAIÚSCULO se mencionadas"],
  "categorias": ["SUV", "SEDAN", "HATCH", "PICKUP", "WAGON"],
  "caracteristicas": ["economico", "familiar", "esportivo", "luxo", "trabalho", "primeiro_carro", "cidade", "estrada"],
  "confianca": número de 0 a 100 (baseado na especificidade da busca)
}

🚨 LEMBRE-SE: precoMin e precoMax devem ser null se o usuário NÃO mencionar valores explícitos!

=== EXEMPLOS DETALHADOS DE ANÁLISE ===

ENTRADA: "Preciso de um carro para a família, espaçoso e seguro, até 80 mil"
ANÁLISE PASSO A PASSO:
- Perfil: Família com filhos
- Características: espaçoso = SUV/WAGON, seguro = familiar
- Limite financeiro: até 80k = precoMax: 80000
- Confiança: Alta (especificou uso, características e orçamento)
SAÍDA: {"categorias": ["SUV", "WAGON"], "caracteristicas": ["familiar"], "precoMax": 80000, "confianca": 90}

ENTRADA: "Honda Civic 2020 automático prata"
ANÁLISE PASSO A PASSO:
- Marca específica: Honda
- Modelo específico: Civic
- Ano específico: 2020 em diante
- Câmbio específico: automático (inclui CVT)
- Cor específica: prata
- Confiança: Muito alta (todos detalhes específicos)
SAÍDA: {"marcas": ["HONDA"], "modelos": ["CIVIC"], "anoMin": 2020, "cambio": ["AUTOMATICO", "CVT"], "cores": ["PRATA"], "confianca": 95}

ENTRADA: "Carro econômico para trabalhar de Uber"
ANÁLISE PASSO A PASSO:
- Uso específico: trabalho + Uber
- Uber requer: sedan (4 portas), confortável, econômico
- Econômico = FLEX, baixo consumo
- Não menciona valor específico = NÃO aplicar filtro de preço
- Confiança: Boa (uso claro, mas sem especificações técnicas)
SAÍDA: {"combustivel": ["FLEX"], "categorias": ["SEDAN"], "caracteristicas": ["trabalho", "economico"], "confianca": 85}

ENTRADA: "SUV compacto, branco, 2021 em diante, automático"
ANÁLISE PASSO A PASSO:
- Categoria específica: SUV
- Tamanho: compacto (não full-size)
- Cor específica: branco
- Período: 2021 em diante
- Câmbio: automático
- Confiança: Muito alta (múltiplos critérios específicos)
SAÍDA: {"categorias": ["SUV"], "cores": ["BRANCO"], "anoMin": 2021, "cambio": ["AUTOMATICO", "CVT"], "confianca": 92}

ENTRADA: "Primeiro carro, algo simples e que gaste pouco"
ANÁLISE PASSO A PASSO:
- Perfil: primeira compra
- Simplicidade = hatch básico, sem muitos equipamentos
- Gasta pouco = FLEX, baixo consumo (mas não menciona valor específico)
- Não aplica filtro de preço pois usuário não menciona valor
- Confiança: Boa (perfil claro, mas genérico)
SAÍDA: {"combustivel": ["FLEX"], "categorias": ["HATCH"], "caracteristicas": ["primeiro_carro", "economico"], "confianca": 80}

ENTRADA: "Carro para trabalho, até 50 mil reais"
ANÁLISE PASSO A PASSO:
- Uso: trabalho
- Valor explícito: "até 50 mil" = precoMax: 50000
- Trabalho sugere: econômico, confiável
- Confiança: Alta (uso claro e orçamento definido)
SAÍDA: {"caracteristicas": ["trabalho", "economico"], "precoMax": 50000, "confianca": 90}

ENTRADA: "Quero um carro potente para estrada, tipo um Camaro"
ANÁLISE PASSO A PASSO:
- Uso: estrada (performance prioritária)
- Potente = gasolina, esportivo
- Camaro = referência de esportivo (marca Chevrolet)
- Estrada = preferencialmente sedan ou cupê
- Confiança: Alta (uso e referência específicos)
SAÍDA: {"combustivel": ["GASOLINA"], "caracteristicas": ["esportivo", "estrada"], "categorias": ["SEDAN"], "precoMin": 60000, "confianca": 88}

AGORA ANALISE A BUSCA DO CLIENTE E RETORNE APENAS O JSON ESTRUTURADO:`

        // Fazer chamada para a OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Você é um especialista brasileiro em análise de buscas de veículos. Siga EXATAMENTE o processo passo a passo e retorne APENAS JSON válido, sem explicações adicionais. Pense como um vendedor experiente que entende as necessidades dos clientes brasileiros."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 800
        })

        const resposta = completion.choices[0]?.message?.content
        if (!resposta) {
            throw new Error('Resposta vazia da OpenAI')
        }

        console.log('🤖 Resposta da OpenAI:', resposta)

        // Tentar parsear a resposta JSON
        let filtros: FiltrosInteligentes
        try {
            filtros = JSON.parse(resposta)
        } catch (error) {
            console.error('❌ Erro ao parsear JSON da OpenAI:', error)
            throw new Error('Resposta inválida da OpenAI')
        }

        // Construir query para o banco de dados
        const whereClause: Record<string, unknown> = {
            ativo_origem: true
        }

        // Aplicar filtros extraídos
        if (filtros.marcas && filtros.marcas.length > 0) {
            whereClause.marca = { in: filtros.marcas }
        }

        if (filtros.modelos && filtros.modelos.length > 0) {
            whereClause.modelo = { in: filtros.modelos }
        }

        if (filtros.anoMin || filtros.anoMax) {
            whereClause.ano = {}
            if (filtros.anoMin) (whereClause.ano as Record<string, number>).gte = filtros.anoMin
            if (filtros.anoMax) (whereClause.ano as Record<string, number>).lte = filtros.anoMax
        }

        if (filtros.precoMin || filtros.precoMax) {
            whereClause.preco = {}
            if (filtros.precoMin) (whereClause.preco as Record<string, number>).gte = filtros.precoMin
            if (filtros.precoMax) (whereClause.preco as Record<string, number>).lte = filtros.precoMax
        }

        if (filtros.combustivel && filtros.combustivel.length > 0) {
            whereClause.combustivel = { in: filtros.combustivel }
        }

        if (filtros.cambio && filtros.cambio.length > 0) {
            whereClause.cambio = { in: filtros.cambio }
        }

        if (filtros.cores && filtros.cores.length > 0) {
            whereClause.cor = { in: filtros.cores.map(c => c.toUpperCase()) }
        }

        // Buscar veículos no banco
        const veiculos = await prisma.veiculo.findMany({
            where: whereClause,
            orderBy: [
                { destaque: 'desc' },
                { preco: 'asc' }
            ],
            take: 20 // Limitar resultados
        })

        console.log(`✅ Encontrados ${veiculos.length} veículos para a busca: "${busca}"`)

        return NextResponse.json({
            success: true,
            data: {
                veiculos,
                filtros_aplicados: filtros,
                busca_original: busca,
                total_encontrados: veiculos.length,
                interpretacao: {
                    confianca: filtros.confianca,
                    filtros_ativos: Object.keys(filtros).filter(key => {
                        const valor = filtros[key as keyof FiltrosInteligentes]
                        return valor && (Array.isArray(valor) ? valor.length > 0 : valor !== null)
                    })
                }
            }
        })

    } catch (error) {
        console.error('❌ Erro na busca inteligente:', error)

        return NextResponse.json({
            success: false,
            error: 'Erro ao processar busca inteligente',
            details: error instanceof Error ? error.message : 'Erro desconhecido'
        }, { status: 500 })
    }
}

// GET - Endpoint para testar configuração
export async function GET() {
    const temApiKey = !!process.env.OPENAI_API_KEY

    return NextResponse.json({
        success: true,
        message: 'Endpoint de busca inteligente',
        configurado: temApiKey,
        modelo: 'gpt-3.5-turbo',
        funcionalidades: [
            'Interpretação de linguagem natural',
            'Extração de filtros estruturados',
            'Busca contextual no banco de dados',
            'Análise de confiança da interpretação'
        ]
    })
} 