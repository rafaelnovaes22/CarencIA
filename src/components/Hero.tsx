import Link from 'next/link'

export function Hero() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 to-white">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                            O match perfeito entre você e seu próximo carro
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                            CarencIA conecta você às melhores ofertas de veículos seminovos de concessionárias confiáveis.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link 
                            href="/catalogo"
                            className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-base font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                        >
                            Ver Catálogo de Veículos
                        </Link>
                        <Link 
                            href="/#contato"
                            className="inline-flex h-12 items-center justify-center rounded-md border border-blue-600 bg-white px-8 text-base font-medium text-blue-600 shadow transition-all hover:bg-blue-50"
                        >
                            Como Funciona
                        </Link>
                    </div>
                    
                    <div className="mt-8 text-sm text-gray-500">
                        <p>📍 Atualmente com estoque da <strong>Robust Car</strong> - 78 veículos disponíveis</p>
                    </div>
                </div>
            </div>
        </section>
    );
} 