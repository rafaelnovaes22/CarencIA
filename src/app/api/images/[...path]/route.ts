import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/')
    
    // Verificar se é uma solicitação de imagem de veículo
    if (!imagePath.startsWith('veiculos/')) {
      return new NextResponse('Not Found', { status: 404 })
    }

    // Construir caminho completo do arquivo
    const fullPath = path.join(process.cwd(), 'public', 'images', imagePath)
    
    // Verificar se arquivo existe
    if (!fs.existsSync(fullPath)) {
      return new NextResponse('Image Not Found', { status: 404 })
    }

    // Ler arquivo
    const fileBuffer = fs.readFileSync(fullPath)
    
    // Determinar tipo de conteúdo baseado na extensão
    const ext = path.extname(fullPath).toLowerCase()
    let contentType = 'image/jpeg'
    
    switch (ext) {
      case '.png':
        contentType = 'image/png'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      default:
        contentType = 'image/jpeg'
    }

    // Headers para cache otimizado
    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable', // Cache por 1 ano
      'ETag': `"${path.basename(fullPath)}"`,
      'Last-Modified': fs.statSync(fullPath).mtime.toUTCString(),
    })

    // Verificar se cliente tem cache válido (ETag)
    const clientETag = request.headers.get('if-none-match')
    if (clientETag === headers.get('ETag')) {
      return new NextResponse(null, { status: 304, headers })
    }

    return new NextResponse(fileBuffer, { headers })

  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Endpoint para obter metadados de imagem
export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { action, veiculoId } = await request.json()

    if (action === 'get-metadata' && veiculoId) {
      const imagens = await prisma.imagemVeiculo.findMany({
        where: { veiculo_id: veiculoId },
        orderBy: { ordem: 'asc' }
      })

      return NextResponse.json({
        success: true,
        imagens: imagens.map(img => ({
          id: img.id,
          url_thumbnail: img.url_thumbnail,
          url_medium: img.url_medium,
          url_large: img.url_large,
          url_original: img.url_local,
          largura: img.largura,
          altura: img.altura,
          formato: img.formato,
          tamanho_bytes: img.tamanho_bytes,
          qualidade_score: img.qualidade_score,
          is_principal: img.is_principal,
          ordem: img.ordem
        }))
      })
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error in image metadata API:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}