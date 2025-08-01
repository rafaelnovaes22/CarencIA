'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageMetadata {
  id: string
  url_thumbnail: string
  url_medium: string
  url_large: string
  url_original: string
  largura: number
  altura: number
  formato: string
  tamanho_bytes: number
  qualidade_score: number
  is_principal: boolean
  ordem: number
}

interface OptimizedImageProps {
  veiculoId: string
  alt: string
  size?: 'thumbnail' | 'medium' | 'large' | 'original'
  className?: string
  width?: number
  height?: number
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
}

export function OptimizedImage({
  veiculoId,
  alt,
  size = 'medium',
  className = '',
  width = 400,
  height = 300,
  priority = false,
  onLoad,
  onError,
  fallbackSrc = '/placeholder-car.svg'
}: OptimizedImageProps) {
  const [imageData, setImageData] = useState<ImageMetadata | null>(null)
  const [currentSrc, setCurrentSrc] = useState<string>(fallbackSrc)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    loadImageMetadata()
  }, [veiculoId])

  const loadImageMetadata = async () => {
    try {
      setIsLoading(true)
      setError(false)

      const response = await fetch('/api/images/veiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-metadata',
          veiculoId: veiculoId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to load image metadata')
      }

      const data = await response.json()
      
      if (data.success && data.imagens && data.imagens.length > 0) {
        // Buscar imagem principal ou primeira disponível
        const principalImage = data.imagens.find((img: ImageMetadata) => img.is_principal)
        const selectedImage = principalImage || data.imagens[0]
        
        setImageData(selectedImage)
        setCurrentSrc(getOptimizedUrl(selectedImage, size))
      } else {
        // Fallback para imagem padrão
        setCurrentSrc(fallbackSrc)
      }
    } catch (error) {
      console.error('Error loading image metadata:', error)
      setError(true)
      setCurrentSrc(fallbackSrc)
    } finally {
      setIsLoading(false)
    }
  }

  const getOptimizedUrl = (image: ImageMetadata, requestedSize: string): string => {
    switch (requestedSize) {
      case 'thumbnail':
        return image.url_thumbnail || image.url_medium || image.url_large || fallbackSrc
      case 'medium':
        return image.url_medium || image.url_large || image.url_thumbnail || fallbackSrc
      case 'large':
        return image.url_large || image.url_medium || image.url_thumbnail || fallbackSrc
      case 'original':
        return image.url_original || image.url_large || fallbackSrc
      default:
        return image.url_medium || fallbackSrc
    }
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    setError(false)
    onLoad?.()
  }

  const handleImageError = () => {
    setError(true)
    setCurrentSrc(fallbackSrc)
    onError?.()
  }

  // Calcular aspect ratio baseado nos metadados da imagem
  const aspectRatio = imageData?.largura && imageData?.altura 
    ? imageData.largura / imageData.altura 
    : width / height

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Carregando...</div>
        </div>
      )}
      
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover transition-opacity duration-300"
        style={{
          aspectRatio: aspectRatio,
          opacity: isLoading ? 0 : 1
        }}
        priority={priority}
        onLoad={handleImageLoad}
        onError={handleImageError}
        sizes={getSizesAttribute(size)}
      />

      {/* Indicador de qualidade */}
      {imageData && imageData.qualidade_score > 80 && !isLoading && (
        <div className="absolute top-2 left-2 bg-green-500 text-white px-1 py-0.5 rounded text-xs font-semibold">
          HD
        </div>
      )}

      {/* Informações de debug (só em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && imageData && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1">
          {imageData.largura}x{imageData.altura} • {imageData.formato} • 
          {(imageData.tamanho_bytes / 1024).toFixed(1)}KB • 
          Q{imageData.qualidade_score}
        </div>
      )}
    </div>
  )
}

// Helper para definir sizes attribute do Next.js Image
function getSizesAttribute(size: string): string {
  switch (size) {
    case 'thumbnail':
      return '(max-width: 768px) 150px, 300px'
    case 'medium':
      return '(max-width: 768px) 300px, 600px'
    case 'large':
      return '(max-width: 768px) 600px, 1200px'
    case 'original':
      return '100vw'
    default:
      return '(max-width: 768px) 300px, 600px'
  }
}

// Hook para carregar múltiplas imagens de um veículo
export function useVeiculoImages(veiculoId: string) {
  const [images, setImages] = useState<ImageMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadImages()
  }, [veiculoId])

  const loadImages = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/images/veiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-metadata',
          veiculoId: veiculoId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to load images')
      }

      const data = await response.json()
      
      if (data.success) {
        setImages(data.imagens || [])
      } else {
        setError(data.message || 'Failed to load images')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { images, loading, error, reload: loadImages }
}