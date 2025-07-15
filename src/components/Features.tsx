export function Features() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
                    Como funciona
                </h2>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                    <div className="flex flex-col justify-center space-y-4">
                        <h3 className="text-xl font-bold">1. Conecte suas redes</h3>
                        <p className="text-gray-500">
                            Importe seus dados do Facebook, Instagram e Google para uma análise de perfil completa.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                        <h3 className="text-xl font-bold">2. Análise com IA</h3>
                        <p className="text-gray-500">
                            Nossa IA processa seus interesses e define seu perfil de comprador.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center space-y-4">
                        <h3 className="text-xl font-bold">3. Receba Ofertas</h3>
                        <p className="text-gray-500">
                            Conectamos você a concessionárias que têm o carro ideal para você.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
} 