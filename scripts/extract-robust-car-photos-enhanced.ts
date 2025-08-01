import FirecrawlApp from '@mendable/firecrawl-js'
import { PrismaClient } from '@prisma/client'
import { ImageManager } from '../src/lib/image-manager'

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

async function extractVeiculosFromRobustCarEnhanced(): Promise<VeiculoScraping[]> {
    console.log('🔍 Iniciando extração APRIMORADA do site Robust Car...')

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

        // Passo 2: Fazer scraping específico de cada veículo com imagens em alta resolução
        const maxVeiculos = Math.min(veiculoUrls.length, 50) // Limitar para teste
        console.log(`🚀 Iniciando extração de ${maxVeiculos} veículos com imagens HD...`)

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
                const veiculo = await extractVeiculoFromPageEnhanced(scrapeResult as unknown as ValidScrapeResponse, url)
                if (veiculo) {
                    veiculos.push(veiculo)
                    console.log(`✅ Veículo extraído: ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano} - R$ ${veiculo.preco.toLocaleString('pt-BR')} (${veiculo.fotos.length} fotos)`)
                } else {
                    console.log(`⚠️ Não foi possível extrair dados do veículo`)
                }

                // Mostrar progresso a cada 5 veículos
                if ((i + 1) % 5 === 0) {
                    console.log(`📊 Progresso: ${i + 1}/${maxVeiculos} processados | ${veiculos.length} extraídos com sucesso`)
                }

                // Pausa otimizada para não sobrecarregar o servidor
                await new Promise(resolve => setTimeout(resolve, 2000))

            } catch (error) {
                console.error(`❌ Erro ao processar ${url}:`, error)
                continue
            }
        }

        console.log(`🎉 Extração concluída! Total de veículos: ${veiculos.length}`)

        return veiculos

    } catch (error) {
        console.error('❌ Erro durante a extração:', error)
        throw error
    }
}

async function extractVeiculoFromPageEnhanced(page: ValidScrapeResponse, sourceUrl: string): Promise<VeiculoScraping | null> {
    try {
        // Verificar se temos dados válidos
        if (!page || typeof page !== 'object') {
            console.error('❌ Dados de página inválidos')
            return null
        }

        const html = page.html || ''
        const markdown = page.markdown || ''

        // Estratégia aprimorada para encontrar imagens de alta resolução
        const images: string[] = []
        
        // 1. Buscar todas as imagens da página
        const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/g
        let match

        while ((match = imageRegex.exec(html)) !== null) {
            const imageUrl = match[1]
            
            // Filtrar imagens relevantes e priorizar alta resolução
            if (isCarImageUrl(imageUrl)) {
                const absoluteUrl = makeAbsoluteUrl(imageUrl)
                
                // Evitar duplicatas
                if (!images.includes(absoluteUrl)) {
                    images.push(absoluteUrl)
                }
            }
        }

        // 2. Buscar links para galeria de fotos ou lightbox
        const galleryRegex = /data-fancybox[^>]*href="([^"]+)"/g
        while ((match = galleryRegex.exec(html)) !== null) {
            const imageUrl = match[1]
            if (isCarImageUrl(imageUrl)) {
                const absoluteUrl = makeAbsoluteUrl(imageUrl)
                if (!images.includes(absoluteUrl)) {
                    images.push(absoluteUrl)
                }
            }
        }

        // 3. Buscar imagens em background-image do CSS
        const bgImageRegex = /background-image:\s*url\(['"]?([^'"]+)['"]?\)/g
        while ((match = bgImageRegex.exec(html)) !== null) {
            const imageUrl = match[1]
            if (isCarImageUrl(imageUrl)) {
                const absoluteUrl = makeAbsoluteUrl(imageUrl)
                if (!images.includes(absoluteUrl)) {
                    images.push(absoluteUrl)
                }
            }
        }

        // Filtrar e priorizar imagens por qualidade potencial
        const qualityImages = images
            .filter(url => !url.includes('logo') && !url.includes('icon'))
            .sort((a, b) => {
                // Priorizar URLs que indicam alta resolução
                const aScore = getImageQualityScore(a)
                const bScore = getImageQualityScore(b)
                return bScore - aScore
            })
            .slice(0, 15) // Máximo 15 fotos por veículo

        console.log(`📸 Encontradas ${qualityImages.length} imagens de qualidade para processamento`)

        // Extrair dados do veículo usando regex e análise do conteúdo
        const veiculo = parseVeiculoFromContentEnhanced(markdown, page.metadata?.title || '', qualityImages, sourceUrl)

        return veiculo

    } catch (error) {
        console.error('❌ Erro ao extrair veículo da página:', error)
        return null
    }
}

function isCarImageUrl(url: string): boolean {
    // Verificar se URL é de imagem de carro
    const carKeywords = ['veiculo', 'car', 'auto', 'foto', 'image', 'thumb', 'galeria']
    const imageExtensions = /\.(jpg|jpeg|png|webp)(\?|$)/i
    
    return imageExtensions.test(url) && 
           carKeywords.some(keyword => url.toLowerCase().includes(keyword))
}

function makeAbsoluteUrl(url: string): string {
    if (url.startsWith('http')) return url
    if (url.startsWith('//')) return `https:${url}`
    return `https://robustcar.com.br${url}`
}

function getImageQualityScore(url: string): number {
    let score = 0
    
    // Palavras que indicam alta resolução
    if (url.includes('large')) score += 20
    if (url.includes('full')) score += 20
    if (url.includes('hd')) score += 15
    if (url.includes('original')) score += 25
    
    // Penalizar thumbnails
    if (url.includes('thumb')) score -= 15
    if (url.includes('small')) score -= 10
    if (url.includes('mini')) score -= 10
    
    // Dimensões na URL
    const dimensionMatch = url.match(/(\d+)x(\d+)/)
    if (dimensionMatch) {
        const width = parseInt(dimensionMatch[1])
        const height = parseInt(dimensionMatch[2])
        if (width >= 800 && height >= 600) score += 15
        if (width >= 1200 && height >= 800) score += 25
    }
    
    return score
}

function parseVeiculoFromContentEnhanced(content: string, title: string, images: string[], sourceURL: string): VeiculoScraping | null {
    try {
        // Parsing específico para páginas de veículos individuais da Robust Car (enhanced)

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
            fotos: images, // URLs originais para processamento posterior
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

async function updateVeiculosWithEnhancedImages(veiculos: VeiculoScraping[]) {
    console.log('🔄 Atualizando veículos no banco com sistema de imagens aprimorado...')

    let updated = 0
    let created = 0
    let totalImagensProcessadas = 0

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

            let veiculoId: string

            if (existingVeiculo) {
                // Atualizar dados do veículo existente
                await prisma.veiculo.update({
                    where: { id: existingVeiculo.id },
                    data: {
                        fotos: veiculo.fotos, // Manter URLs originais
                        preco: veiculo.preco,
                        km: veiculo.km,
                        data_scraping: veiculo.data_scraping,
                        ativo_origem: true,
                        updated_at: new Date()
                    }
                })
                veiculoId = existingVeiculo.id
                updated++
                console.log(`✅ Atualizado: ${veiculo.marca} ${veiculo.modelo}`)
            } else {
                // Criar novo veículo
                const novoVeiculo = await prisma.veiculo.create({
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
                        fotos: veiculo.fotos, // Manter URLs originais
                        descricao: veiculo.descricao,
                        fonte_scraping: veiculo.fonte_scraping,
                        url_origem: veiculo.url_origem,
                        data_scraping: veiculo.data_scraping,
                        ativo_origem: true
                    }
                })
                veiculoId = novoVeiculo.id
                created++
                console.log(`🆕 Criado: ${veiculo.marca} ${veiculo.modelo}`)
            }

            // Processar imagens em alta resolução
            console.log(`📸 Processando ${veiculo.fotos.length} imagens para ${veiculo.marca} ${veiculo.modelo}...`)

            // Limpar imagens antigas deste veículo
            await prisma.imagemVeiculo.deleteMany({
                where: { veiculo_id: veiculoId }
            })

            // Processar cada imagem
            for (let i = 0; i < Math.min(veiculo.fotos.length, 10); i++) {
                const fotoUrl = veiculo.fotos[i]
                console.log(`  📥 [${i + 1}/${veiculo.fotos.length}] Processando: ${fotoUrl}`)

                try {
                    const processedImage = await ImageManager.processImage(fotoUrl, veiculoId, i)
                    
                    if (processedImage) {
                        const imagemId = await ImageManager.saveImageToDatabase(
                            veiculoId, 
                            processedImage, 
                            i, 
                            i === 0 // Primeira imagem é principal
                        )
                        
                        if (imagemId) {
                            totalImagensProcessadas++
                            console.log(`    ✅ Imagem processada e salva (${processedImage.metadata.width}x${processedImage.metadata.height})`)
                        }
                    } else {
                        console.log(`    ❌ Falha no processamento da imagem`)
                    }

                    // Pausa entre imagens para não sobrecarregar
                    await new Promise(resolve => setTimeout(resolve, 500))

                } catch (error) {
                    console.error(`    ❌ Erro ao processar imagem ${i + 1}:`, error)
                    continue
                }
            }

            // Atualizar foto principal no veículo
            const fotoPrincipal = await prisma.imagemVeiculo.findFirst({
                where: { 
                    veiculo_id: veiculoId,
                    is_principal: true 
                }
            })

            if (fotoPrincipal) {
                await prisma.veiculo.update({
                    where: { id: veiculoId },
                    data: { foto_principal: fotoPrincipal.url_large }
                })
            }

            console.log(`🎨 Concluído: ${veiculo.marca} ${veiculo.modelo} - Imagens processadas`)

        } catch (error) {
            console.error(`❌ Erro ao processar ${veiculo.marca} ${veiculo.modelo}:`, error)
        }
    }

    console.log(`🎉 Processo concluído!`)
    console.log(`📊 Veículos: ${updated} atualizados, ${created} criados`)
    console.log(`📸 Total de imagens processadas: ${totalImagensProcessadas}`)
}

// Função principal
async function main() {
    try {
        console.log('🚀 Iniciando extração APRIMORADA da Robust Car...')

        // Verificar se API key está configurada
        if (!process.env.FIRECRAWL_API_KEY || process.env.FIRECRAWL_API_KEY === 'YOUR_API_KEY_HERE') {
            console.error('❌ FIRECRAWL_API_KEY não configurada no arquivo .env')
            console.log('💡 Configure a API key e execute novamente')
            return
        }

        // Preparar diretórios de imagens
        await ImageManager.ensureDirectoriesExist()

        // Extrair veículos do site
        const veiculos = await extractVeiculosFromRobustCarEnhanced()

        if (veiculos.length === 0) {
            console.log('⚠️ Nenhum veículo encontrado')
            return
        }

        // Atualizar banco de dados com sistema de imagens aprimorado
        await updateVeiculosWithEnhancedImages(veiculos)

        console.log('✅ Extração com imagens HD concluída com sucesso!')

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

export { extractVeiculosFromRobustCarEnhanced, updateVeiculosWithEnhancedImages }