'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface GaleriaFotosProps {
    fotos: string[]
    titulo: string
}

export function GaleriaFotos({ fotos, titulo }: GaleriaFotosProps) {
    const [fotoAtiva, setFotoAtiva] = useState(0)
    const [modalAberto, setModalAberto] = useState(false)

    const fotosValidas = fotos.filter(foto => foto && foto.trim() !== '')

    if (fotosValidas.length === 0) {
        return (
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <Image
                    src="/placeholder-car.svg"
                    alt={titulo}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
        )
    }

    const proximaFoto = () => {
        setFotoAtiva((prev) => (prev + 1) % fotosValidas.length)
    }

    const fotoAnterior = () => {
        setFotoAtiva((prev) => (prev - 1 + fotosValidas.length) % fotosValidas.length)
    }

    const abrirModal = (index: number) => {
        setFotoAtiva(index)
        setModalAberto(true)
    }

    return (
        <>
            {/* Galeria Principal */}
            <div className="space-y-4">
                {/* Imagem Principal */}
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group">
                    <Image
                        src={fotosValidas[fotoAtiva]}
                        alt={`${titulo} - Foto ${fotoAtiva + 1}`}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                        onClick={() => abrirModal(fotoAtiva)}
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-car.svg'
                        }}
                    />

                    {/* Contador de fotos */}
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                        {fotoAtiva + 1} / {fotosValidas.length}
                    </div>

                    {/* Botões de navegação */}
                    {fotosValidas.length > 1 && (
                        <>
                            <button
                                onClick={fotoAnterior}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={proximaFoto}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {fotosValidas.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {fotosValidas.map((foto, index) => (
                            <button
                                key={index}
                                onClick={() => setFotoAtiva(index)}
                                className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ${index === fotoAtiva
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <Image
                                    src={foto}
                                    alt={`${titulo} - Thumbnail ${index + 1}`}
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder-car.svg'
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Foto Ampliada */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-7xl max-h-full">
                        {/* Botão Fechar */}
                        <button
                            onClick={() => setModalAberto(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <XMarkIcon className="w-8 h-8" />
                        </button>

                        {/* Imagem no Modal */}
                        <Image
                            src={fotosValidas[fotoAtiva]}
                            alt={`${titulo} - Foto ${fotoAtiva + 1}`}
                            width={1200}
                            height={900}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder-car.svg'
                            }}
                        />

                        {/* Navegação no Modal */}
                        {fotosValidas.length > 1 && (
                            <>
                                <button
                                    onClick={fotoAnterior}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                                >
                                    <ChevronLeftIcon className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={proximaFoto}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                                >
                                    <ChevronRightIcon className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Contador no Modal */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full">
                            {fotoAtiva + 1} de {fotosValidas.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
} 