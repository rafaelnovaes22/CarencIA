import FirecrawlApp from '@mendable/firecrawl-js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Configurar Firecrawl (você precisa de uma API key)
const app = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY || 'YOUR_API_KEY_HERE'
})

// Interface para resposta válida do Firecrawl
interface ValidScrapeResponse {
    html?: string
    markdown?: string
    metadata?: {
        title?: string
        description?: string
        [key: string]: string | number | boolean | null | undefined
    }
    [key: string]: string | number | boolean | object | null | undefined
}

interface VeiculoScraping {
    marca: string
    modelo: string
    versao: string
    ano: number
    combustivel: string
    cambio: string
    cor: string
    km: number
    preco: number
    fotos: string[]
    descricao?: string
    fonte_scraping: string
    url_origem: string
    data_scraping: Date
}

async function extractVeiculosFromRobustCar(): Promise<VeiculoScraping[]> {
    console.log('🔍 Iniciando extração do site Robust Car...')

    try {
        const veiculos: VeiculoScraping[] = []

        // Passo 1: Extrair URLs de todas as páginas de busca paginada
        console.log('📄 Extraindo URLs das páginas de busca paginada...')
        const veiculoUrls: string[] = []

        // Processar páginas de busca (assumindo até 10 páginas)
        for (let pagina = 1; pagina <= 10; pagina++) {
            try {
                console.log(`🔍 Processando página ${pagina} da busca...`)

                const url = pagina === 1
                    ? 'https://robustcar.com.br/busca'
                    : `https://robustcar.com.br/busca//pag/${pagina}/ordem/ano-desc`

                const scrapeResult = await app.scrapeUrl(url, {
                    formats: ['html'],
                    onlyMainContent: false,
                    timeout: 30000
                })

                // Verificar se a resposta é válida e contém html
                if (!scrapeResult || !('html' in scrapeResult) || !scrapeResult.html) {
                    console.log(`   ⚠️ Página ${pagina}: Sem conteúdo HTML válido`)
                    continue
                }

                const html = scrapeResult.html

                // Extrair links "Mais detalhes" da página
                const linkRegex = /href="([^"]*\/carros\/[^"]*\.html)"/g
                let match
                let linksEncontrados = 0

                while ((match = linkRegex.exec(html)) !== null) {
                    const link = match[1]
                    const absoluteUrl = link.startsWith('http')
                        ? link
                        : `https://robustcar.com.br${link}`

                    if (!veiculoUrls.includes(absoluteUrl)) {
                        veiculoUrls.push(absoluteUrl)
                        linksEncontrados++
                    }
                }

                console.log(`   ✅ Página ${pagina}: ${linksEncontrados} veículos encontrados`)

                // Se não encontrou veículos, provavelmente chegou ao fim
                if (linksEncontrados === 0) {
                    console.log(`   🏁 Fim das páginas na página ${pagina}`)
                    break
                }

                // Pausa entre páginas
                await new Promise(resolve => setTimeout(resolve, 1000))

            } catch (error) {
                console.error(`❌ Erro ao processar página ${pagina}:`, error)
                break
            }
        }

        console.log(`🎯 Total de URLs de veículos encontradas: ${veiculoUrls.length}`)

        // Passo 2: Fazer scraping específico de cada veículo
        const maxVeiculos = veiculoUrls.length
        console.log(`🚀 Iniciando extração de ${maxVeiculos} veículos...`)

        for (let i = 0; i < maxVeiculos; i++) {
            const url = veiculoUrls[i]
            console.log(`🚗 [${i + 1}/${maxVeiculos}] Processando: ${url}`)

            try {
                // Fazer scraping da página individual do veículo
                const scrapeResult = await app.scrapeUrl(url, {
                    formats: ['markdown', 'html'],
                    onlyMainContent: true,
                    timeout: 30000
                })

                // Verificar se a resposta é válida
                if (!scrapeResult || !('html' in scrapeResult)) {
                    console.log(`   ⚠️ Sem conteúdo válido para ${url}`)
                    continue
                }

                // Extrair dados do veículo
                const veiculo = await extractVeiculoFromPage(scrapeResult as unknown as ValidScrapeResponse, url)
                if (veiculo) {
                    veiculos.push(veiculo)
                    console.log(`✅ Veículo extraído: ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano} - R$ ${veiculo.preco.toLocaleString('pt-BR')}`)
                } else {
                    console.log(`⚠️ Não foi possível extrair dados do veículo`)
                }

                // Mostrar progresso a cada 10 veículos
                if ((i + 1) % 10 === 0) {
                    console.log(`📊 Progresso: ${i + 1}/${maxVeiculos} processados | ${veiculos.length} extraídos com sucesso`)
                }

                // Pausa otimizada para não sobrecarregar o servidor
                await new Promise(resolve => setTimeout(resolve, 300))

            } catch (error) {
                console.error(`❌ Erro ao processar ${url}:`, error)
                continue
            }
        }

        console.log(`🎉 Extração concluída! Total de veículos: ${veiculos.length}`)

        // Relatório resumido por marca
        const marcas = veiculos.reduce((acc, veiculo) => {
            acc[veiculo.marca] = (acc[veiculo.marca] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        console.log('\n📊 Resumo por marca:')
        Object.entries(marcas)
            .sort((a, b) => b[1] - a[1]) // Ordenar por quantidade
            .forEach(([marca, count]) => {
                console.log(`   ${marca}: ${count} veículos`)
            })

        const totalFotos = veiculos.reduce((acc, veiculo) => acc + veiculo.fotos.length, 0)
        const valorTotalEstoque = veiculos.reduce((acc, veiculo) => acc + veiculo.preco, 0)
        const precoMedio = valorTotalEstoque / veiculos.length

        console.log(`\n📸 Total de fotos extraídas: ${totalFotos}`)
        console.log(`💰 Valor total do estoque: R$ ${valorTotalEstoque.toLocaleString('pt-BR')}`)
        console.log(`📈 Preço médio: R$ ${precoMedio.toLocaleString('pt-BR')}`)

        // Veículos mais caros e mais baratos
        const veiculosCaro = veiculos.filter(v => v.preco > 0).sort((a, b) => b.preco - a.preco)
        if (veiculosCaro.length > 0) {
            console.log(`\n🏆 Mais caro: ${veiculosCaro[0].marca} ${veiculosCaro[0].modelo} ${veiculosCaro[0].ano} - R$ ${veiculosCaro[0].preco.toLocaleString('pt-BR')}`)
            console.log(`💸 Mais barato: ${veiculosCaro[veiculosCaro.length - 1].marca} ${veiculosCaro[veiculosCaro.length - 1].modelo} ${veiculosCaro[veiculosCaro.length - 1].ano} - R$ ${veiculosCaro[veiculosCaro.length - 1].preco.toLocaleString('pt-BR')}`)
        }

        return veiculos

    } catch (error) {
        console.error('❌ Erro durante a extração:', error)
        throw error
    }
}

async function extractVeiculoFromPage(page: ValidScrapeResponse, sourceUrl: string): Promise<VeiculoScraping | null> {
    try {
        // Verificar se temos dados válidos
        if (!page || typeof page !== 'object') {
            console.error('❌ Dados de página inválidos')
            return null
        }

        const html = page.html || ''
        const markdown = page.markdown || ''

        // Extrair imagens da página - foco em thumbnails e imagens de veículos
        const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/g
        const images: string[] = []
        let match

        while ((match = imageRegex.exec(html)) !== null) {
            const imageUrl = match[1]
            // Filtrar imagens relevantes (fotos de veículos, thumbnails, etc.)
            if (imageUrl.includes('thumb') ||
                imageUrl.includes('veiculo') ||
                imageUrl.includes('car') ||
                imageUrl.includes('auto') ||
                imageUrl.includes('foto') ||
                imageUrl.match(/\.(jpg|jpeg|png|webp)$/i)) {

                // Converter para URL absoluta se necessário
                const absoluteUrl = imageUrl.startsWith('http')
                    ? imageUrl
                    : imageUrl.startsWith('//')
                        ? `https:${imageUrl}`
                        : `https://robustcar.com.br${imageUrl}`

                // Evitar duplicatas
                if (!images.includes(absoluteUrl)) {
                    images.push(absoluteUrl)
                }
            }
        }

        // Extrair dados do veículo usando regex e análise do conteúdo
        const veiculo = parseVeiculoFromContent(markdown, page.metadata?.title || '', images, sourceUrl)

        return veiculo

    } catch (error) {
        console.error('❌ Erro ao extrair veículo da página:', error)
        return null
    }
}

function parseVeiculoFromContent(content: string, title: string, images: string[], sourceURL: string): VeiculoScraping | null {
    try {
        // Parsing específico para páginas de veículos individuais da Robust Car

        // Extrair marca e modelo da URL (mais confiável)
        let marca = 'INDEFINIDO'
        let modelo = 'INDEFINIDO'
        let ano = new Date().getFullYear()

        // Extrair da URL: /carros/Marca/Modelo/versao/
        const urlMatch = sourceURL.match(/\/carros\/([^\/]+)\/([^\/]+)\//i)
        if (urlMatch) {
            marca = decodeURIComponent(urlMatch[1]).toUpperCase()
            modelo = decodeURIComponent(urlMatch[2]).toUpperCase()
        }

        // Se não conseguir da URL, tentar do título
        if (marca === 'INDEFINIDO') {
            const titleMatch = title.match(/(\d{4})\s+(\w+)\s+(\w+)/i)
            if (titleMatch) {
                ano = parseInt(titleMatch[1])
                marca = titleMatch[2].toUpperCase()
                modelo = titleMatch[3].toUpperCase()
            }
        }

        // Extrair ano do título se disponível
        const anoMatch = title.match(/(\d{4})/i)
        if (anoMatch) {
            ano = parseInt(anoMatch[1])
        }

        // Extrair versão do título
        const versaoMatch = title.match(/\d{4}\s+\w+\s+\w+\s+(.+)/i)
        const versao = versaoMatch ? versaoMatch[1].trim() : 'PADRÃO'

        // Extrair preço (formato: "R$ 139.990,00")
        const precoMatch = content.match(/R\$\s*([\d.,]+)/i)
        const preco = precoMatch ? parseFloat(precoMatch[1].replace(/\./g, '').replace(',', '.')) : 0

        // Extrair KM
        const kmMatch = content.match(/\*\*KM\*\*\s*(\d+[\.,]?\d*)/i)
        const km = kmMatch ? parseInt(kmMatch[1].replace(/[\.,]/g, '')) : 0

        // Extrair combustível
        const combustivelMatch = content.match(/\*\*Combustível\*\*\s*(\w+)/i)
        const combustivel = combustivelMatch ? combustivelMatch[1].toUpperCase() : 'FLEX'

        // Extrair cor
        const corMatch = content.match(/\*\*Cor\*\*\s*(\w+)/i)
        const cor = corMatch ? corMatch[1].toUpperCase() : 'INDEFINIDA'

        // Detectar câmbio (se tem "Automático" nos opcionais)
        const cambio = content.toLowerCase().includes('câmbio automático') ||
            content.toLowerCase().includes('automático') ? 'AUTOMATICO' : 'MANUAL'

        // Filtrar apenas imagens de veículos (excluir thumbnails muito pequenos)
        const fotosVeiculos = images.filter(img =>
            img.includes('thumb') ||
            img.match(/\.(jpg|jpeg|png|webp)$/i)
        ).slice(0, 10) // Máximo 10 fotos por veículo

        // Extrair descrição (resumo dos opcionais)
        const descricaoMatch = content.match(/#### Opcionais do Veículo([\s\S]*?)####/)
        const descricao = descricaoMatch ? descricaoMatch[1].replace(/\*/g, '').trim().substring(0, 500) :
            content.substring(0, 500)

        const veiculo: VeiculoScraping = {
            marca,
            modelo,
            versao,
            ano,
            combustivel,
            cambio,
            cor,
            km,
            preco,
            fotos: fotosVeiculos,
            descricao,
            fonte_scraping: 'robust_car',
            url_origem: sourceURL,
            data_scraping: new Date()
        }

        return veiculo

    } catch (error) {
        console.error('❌ Erro ao fazer parsing do veículo:', error)
        return null
    }
}

async function updateVeiculosWithRobustCarData(veiculos: VeiculoScraping[]) {
    console.log('🔄 Atualizando veículos no banco de dados...')

    let updated = 0
    let created = 0

    for (const veiculo of veiculos) {
        try {
            // Tentar encontrar veículo similar no banco
            const existingVeiculo = await prisma.veiculo.findFirst({
                where: {
                    marca: veiculo.marca,
                    modelo: veiculo.modelo,
                    ano: veiculo.ano,
                    fonte_scraping: 'robust_car'
                }
            })

            if (existingVeiculo) {
                // Atualizar dados do veículo existente
                await prisma.veiculo.update({
                    where: { id: existingVeiculo.id },
                    data: {
                        fotos: veiculo.fotos,
                        preco: veiculo.preco,
                        km: veiculo.km,
                        data_scraping: veiculo.data_scraping,
                        ativo_origem: true,
                        updated_at: new Date()
                    }
                })
                updated++
                console.log(`✅ Atualizado: ${veiculo.marca} ${veiculo.modelo} (${veiculo.fotos.length} fotos)`)
            } else {
                // Criar novo veículo
                await prisma.veiculo.create({
                    data: {
                        marca: veiculo.marca,
                        modelo: veiculo.modelo,
                        versao: veiculo.versao,
                        ano: veiculo.ano,
                        combustivel: veiculo.combustivel,
                        cambio: veiculo.cambio,
                        cor: veiculo.cor,
                        km: veiculo.km,
                        preco: veiculo.preco,
                        fotos: veiculo.fotos,
                        descricao: veiculo.descricao,
                        fonte_scraping: veiculo.fonte_scraping,
                        url_origem: veiculo.url_origem,
                        data_scraping: veiculo.data_scraping,
                        ativo_origem: true
                    }
                })
                created++
                console.log(`🆕 Criado: ${veiculo.marca} ${veiculo.modelo} (${veiculo.fotos.length} fotos)`)
            }

        } catch (error) {
            console.error(`❌ Erro ao processar ${veiculo.marca} ${veiculo.modelo}:`, error)
        }
    }

    console.log(`🎉 Processo concluído! Atualizados: ${updated}, Criados: ${created}`)
}

// Função principal
async function main() {
    try {
        console.log('🚀 Iniciando extração da Robust Car...')

        // Extrair veículos do site
        const veiculos = await extractVeiculosFromRobustCar()

        if (veiculos.length === 0) {
            console.log('⚠️ Nenhum veículo encontrado')
            return
        }

        // Atualizar banco de dados
        await updateVeiculosWithRobustCarData(veiculos)

        console.log('✅ Extração concluída com sucesso!')

    } catch (error) {
        console.error('❌ Erro durante a extração:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    main()
}

export { extractVeiculosFromRobustCar, updateVeiculosWithRobustCarData } 