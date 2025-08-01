import fs from 'fs'
import path from 'path'
import { createHash } from 'crypto'
import { PrismaClient } from '@prisma/client'
import sharp from 'sharp'

const prisma = new PrismaClient()

export interface ImageMetadata {
  width: number
  height: number
  format: string
  size: number
  quality: number
}

export interface ProcessedImage {
  originalUrl: string
  localPath: string
  thumbnailPath: string
  mediumPath: string
  largePath: string
  metadata: ImageMetadata
}

export class ImageManager {
  private static readonly IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'veiculos')
  private static readonly MAX_RETRIES = 3
  private static readonly RETRY_DELAY = 1000

  // Garantir que o diretório existe
  static async ensureDirectoriesExist() {
    const dirs = [
      this.IMAGES_DIR,
      path.join(this.IMAGES_DIR, 'thumbnails'),
      path.join(this.IMAGES_DIR, 'medium'),
      path.join(this.IMAGES_DIR, 'large'),
      path.join(this.IMAGES_DIR, 'original')
    ]

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    }
  }

  // Gerar hash único para a imagem baseado na URL
  static generateImageHash(url: string): string {
    return createHash('md5').update(url).digest('hex')
  }

  // Detectar URL de alta resolução a partir de thumbnail
  static async findHighResolutionUrl(thumbnailUrl: string): Promise<string> {
    // Estratégias para encontrar versão em alta resolução
    const strategies = [
      // Remover "_thumb", "_small", "_mini" do nome
      (url: string) => url.replace(/_(thumb|small|mini|thumbnail)(\.[a-z]+)$/i, '$2'),
      
      // Substituir dimensões pequenas por grandes
      (url: string) => url.replace(/\/(\d+)x(\d+)\//g, (match, w, h) => {
        const width = parseInt(w)
        const height = parseInt(h)
        if (width < 400 || height < 300) {
          return '/800x600/'
        }
        return match
      }),
      
      // Tentar versões comuns de alta resolução
      (url: string) => url.replace(/thumb/gi, 'large'),
      (url: string) => url.replace(/small/gi, 'large'),
      (url: string) => url.replace(/mini/gi, 'full'),
      
      // Para Robust Car especificamente - buscar versão original
      (url: string) => {
        if (url.includes('robustcar.com.br')) {
          // Tentar diferentes padrões de URL da Robust Car
          return url
            .replace('/thumb/', '/full/')
            .replace('_thumb', '_full')
            .replace('150x', '800x')
            .replace('200x', '1024x')
        }
        return url
      }
    ]

    // Testar cada estratégia
    for (const strategy of strategies) {
      const candidateUrl = strategy(thumbnailUrl)
      if (candidateUrl !== thumbnailUrl) {
        const isValid = await this.validateImageUrl(candidateUrl)
        if (isValid) {
          console.log(`✅ Encontrada versão HD: ${candidateUrl}`)
          return candidateUrl
        }
      }
    }

    // Se não encontrou, tentar buscar no HTML da página origem
    return await this.extractHighResFromPage(thumbnailUrl) || thumbnailUrl
  }

  // Validar se URL de imagem existe e tem boa resolução
  static async validateImageUrl(url: string): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) return false

      const contentType = response.headers.get('content-type')
      const contentLength = response.headers.get('content-length')

      // Verificar se é imagem
      if (!contentType?.startsWith('image/')) return false

      // Verificar tamanho mínimo (> 5KB para filtrar thumbnails muito pequenos)
      if (contentLength && parseInt(contentLength) < 5000) return false

      return true
    } catch (error) {
      return false
    }
  }

  // Extrair URL de alta resolução do HTML da página
  static async extractHighResFromPage(thumbnailUrl: string): Promise<string | null> {
    try {
      // Implementar scraping da página para encontrar imagem original
      // Por enquanto retorna null, pode ser expandido conforme necessário
      return null
    } catch (error) {
      return null
    }
  }

  // Download da imagem com retry
  static async downloadImage(url: string, outputPath: string): Promise<boolean> {
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`📥 Tentativa ${attempt}/${this.MAX_RETRIES}: Baixando ${url}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache'
          }
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const buffer = await response.arrayBuffer()
        
        // Verificar se o arquivo é uma imagem válida
        if (buffer.byteLength < 1000) {
          throw new Error('Arquivo muito pequeno, possivelmente corrompido')
        }

        // Criar diretório se não existir
        const dir = path.dirname(outputPath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }

        // Salvar arquivo
        fs.writeFileSync(outputPath, Buffer.from(buffer))
        
        console.log(`✅ Imagem salva: ${outputPath} (${(buffer.byteLength / 1024).toFixed(1)}KB)`)
        return true

      } catch (error) {
        console.error(`❌ Tentativa ${attempt} falhou:`, error)
        
        if (attempt < this.MAX_RETRIES) {
          console.log(`⏳ Aguardando ${this.RETRY_DELAY}ms antes da próxima tentativa...`)
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY))
        }
      }
    }

    console.error(`💥 Falhou em todas as ${this.MAX_RETRIES} tentativas para: ${url}`)
    return false
  }

  // Processar imagem: fazer download e criar versões otimizadas
  static async processImage(originalUrl: string, veiculoId: string, order: number = 0): Promise<ProcessedImage | null> {
    try {
      await this.ensureDirectoriesExist()

      // Encontrar URL de alta resolução
      const highResUrl = await this.findHighResolutionUrl(originalUrl)
      
      // Gerar nome único para o arquivo
      const hash = this.generateImageHash(highResUrl)
      const extension = this.getImageExtension(highResUrl)
      const filename = `${veiculoId}_${order}_${hash}.${extension}`

      // Paths para diferentes versões
      const originalPath = path.join(this.IMAGES_DIR, 'original', filename)
      const thumbnailPath = path.join(this.IMAGES_DIR, 'thumbnails', filename)
      const mediumPath = path.join(this.IMAGES_DIR, 'medium', filename)
      const largePath = path.join(this.IMAGES_DIR, 'large', filename)

      // Fazer download da imagem original
      const downloadSuccess = await this.downloadImage(highResUrl, originalPath)
      
      if (!downloadSuccess) {
        throw new Error('Falha no download da imagem')
      }

      // Obter metadados da imagem
      const metadata = await this.getImageMetadata(originalPath)

      // Criar versões otimizadas com Sharp
      await this.createOptimizedVersions(originalPath, thumbnailPath, mediumPath, largePath)

      const processedImage: ProcessedImage = {
        originalUrl: highResUrl,
        localPath: originalPath,
        thumbnailPath,
        mediumPath,
        largePath,
        metadata
      }

      console.log(`🎨 Imagem processada: ${filename} (${metadata.width}x${metadata.height})`)
      return processedImage

    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error)
      return null
    }
  }

  // Salvar metadados da imagem no banco
  static async saveImageToDatabase(
    veiculoId: string, 
    processedImage: ProcessedImage, 
    order: number, 
    isPrincipal: boolean = false
  ): Promise<string | null> {
    try {
      const imagemVeiculo = await prisma.imagemVeiculo.create({
        data: {
          veiculo_id: veiculoId,
          url_original: processedImage.originalUrl,
          url_local: `/images/veiculos/original/${path.basename(processedImage.localPath)}`,
          url_thumbnail: `/images/veiculos/thumbnails/${path.basename(processedImage.thumbnailPath)}`,
          url_medium: `/images/veiculos/medium/${path.basename(processedImage.mediumPath)}`,
          url_large: `/images/veiculos/large/${path.basename(processedImage.largePath)}`,
          largura: processedImage.metadata.width,
          altura: processedImage.metadata.height,
          tamanho_bytes: processedImage.metadata.size,
          formato: processedImage.metadata.format,
          qualidade_score: processedImage.metadata.quality,
          is_principal: isPrincipal,
          ordem: order,
          processado: true
        }
      })

      return imagemVeiculo.id
    } catch (error) {
      console.error('❌ Erro ao salvar imagem no banco:', error)
      return null
    }
  }

  // Obter metadados da imagem usando Sharp
  private static async getImageMetadata(filePath: string): Promise<ImageMetadata> {
    try {
      const stats = fs.statSync(filePath)
      const metadata = await sharp(filePath).metadata()
      
      // Calcular score de qualidade baseado em resolução e tamanho
      const width = metadata.width || 0
      const height = metadata.height || 0
      const totalPixels = width * height
      const bytesPerPixel = stats.size / totalPixels
      
      // Score de qualidade: 0-100 baseado em resolução e compressão
      let quality = 50
      if (totalPixels > 1000000) quality += 20 // > 1MP
      if (totalPixels > 2000000) quality += 15 // > 2MP
      if (bytesPerPixel > 1) quality += 10 // Boa compressão
      if (width >= 800 && height >= 600) quality += 5 // Resolução mínima boa
      
      return {
        width: width,
        height: height,
        format: metadata.format || path.extname(filePath).substring(1).toLowerCase(),
        size: stats.size,
        quality: Math.min(100, quality)
      }
    } catch (error) {
      console.error('❌ Erro ao obter metadados:', error)
      const stats = fs.statSync(filePath)
      return {
        width: 0,
        height: 0,
        format: path.extname(filePath).substring(1).toLowerCase(),
        size: stats.size,
        quality: 0
      }
    }
  }

  // Criar versões otimizadas da imagem
  private static async createOptimizedVersions(
    originalPath: string,
    thumbnailPath: string,
    mediumPath: string,
    largePath: string
  ): Promise<void> {
    try {
      const image = sharp(originalPath)
      const metadata = await image.metadata()
      
      console.log(`🔧 Criando versões otimizadas (original: ${metadata.width}x${metadata.height})`)

      // Thumbnail: 300x200, alta compressão
      await image
        .clone()
        .resize(300, 200, { 
          fit: 'cover', 
          position: 'center',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 75, progressive: true })
        .toFile(thumbnailPath)

      // Medium: 600x400, boa qualidade
      await image
        .clone()
        .resize(600, 400, { 
          fit: 'cover', 
          position: 'center',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(mediumPath)

      // Large: 1200x800, alta qualidade
      await image
        .clone()
        .resize(1200, 800, { 
          fit: 'cover', 
          position: 'center',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 90, progressive: true })
        .toFile(largePath)

      console.log(`✅ Versões criadas: thumbnail (300x200), medium (600x400), large (1200x800)`)

    } catch (error) {
      console.error('❌ Erro ao criar versões otimizadas:', error)
      // Fallback: copiar original se falhar
      fs.copyFileSync(originalPath, thumbnailPath)
      fs.copyFileSync(originalPath, mediumPath)
      fs.copyFileSync(originalPath, largePath)
    }
  }

  // Extrair extensão da URL
  private static getImageExtension(url: string): string {
    const match = url.match(/\.([a-z]+)(?:\?|$)/i)
    return match ? match[1].toLowerCase() : 'jpg'
  }

  // Limpar imagens órfãs (sem veículo associado)
  static async cleanupOrphanImages(): Promise<void> {
    try {
      // Buscar imagens sem veículo
      const orphanImages = await prisma.imagemVeiculo.findMany({
        where: {
          veiculo: null
        }
      })

      for (const image of orphanImages) {
        // Deletar arquivos físicos
        if (image.url_local) {
          const filePath = path.join(process.cwd(), 'public', image.url_local)
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
        }

        // Deletar registro do banco
        await prisma.imagemVeiculo.delete({
          where: { id: image.id }
        })
      }

      console.log(`🧹 Limpeza concluída: ${orphanImages.length} imagens órfãs removidas`)
    } catch (error) {
      console.error('❌ Erro na limpeza de imagens:', error)
    }
  }
}