import { Veiculo } from '@/types/database'
import Link from 'next/link'
import Image from 'next/image'

interface VeiculoCardProps {
    veiculo: Veiculo
}

export function VeiculoCard({ veiculo }: VeiculoCardProps) {
    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco)
    }

    const formatarKM = (km: number) => {
        return new Intl.NumberFormat('pt-BR').format(km)
    }

    const imagemPrincipal = veiculo.fotos && veiculo.fotos.length > 0
        ? veiculo.fotos[0]
        : '/placeholder-car.svg'

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Imagem */}
            <div className="relative h-48 bg-gray-200">
                <Image
                    src={imagemPrincipal}
                    alt={`${veiculo.marca} ${veiculo.modelo}`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = '/placeholder-car.svg'
                    }}
                />
                {veiculo.fotos && veiculo.fotos.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        +{veiculo.fotos.length - 1} fotos
                    </div>
                )}
            </div>

            {/* Informações */}
            <div className="p-4">
                {/* Título */}
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {veiculo.ano} {veiculo.marca} {veiculo.modelo}
                </h3>

                {/* Versão */}
                {veiculo.versao && veiculo.versao !== 'PADRÃO' && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                        {veiculo.versao}
                    </p>
                )}

                {/* Preço */}
                <div className="mb-3">
                    {Number(veiculo.preco) > 0 ? (
                        <span className="text-2xl font-bold text-green-600">
                            {formatarPreco(Number(veiculo.preco))}
                        </span>
                    ) : (
                        <span className="text-lg font-semibold text-gray-500">
                            Consulte o preço
                        </span>
                    )}
                </div>

                {/* Detalhes */}
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                        <span>KM:</span>
                        <span className="font-medium">{formatarKM(veiculo.km)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Combustível:</span>
                        <span className="font-medium">{veiculo.combustivel}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Câmbio:</span>
                        <span className="font-medium">{veiculo.cambio}</span>
                    </div>
                    {veiculo.cor && (
                        <div className="flex justify-between">
                            <span>Cor:</span>
                            <span className="font-medium">{veiculo.cor}</span>
                        </div>
                    )}
                </div>

                {/* Botões */}
                <div className="flex gap-2">
                    <Link
                        href={`/veiculo/${veiculo.id}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition-colors duration-200"
                    >
                        Ver Detalhes
                    </Link>
                    <button
                        onClick={() => {
                            const mensagem = `Olá! Tenho interesse no ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}`
                            const whatsappUrl = `https://wa.me/5511940763330?text=${encodeURIComponent(mensagem)}`
                            window.open(whatsappUrl, '_blank')
                        }}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                        WhatsApp
                    </button>
                </div>
            </div>
        </div>
    )
} 