import Link from 'next/link'

export function Header() {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-sm">
            <Link href="/" className="font-bold text-xl text-blue-600 hover:text-blue-800">
                CarencIA
            </Link>

            <nav className="flex items-center gap-6">
                <Link
                    href="/catalogo"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                    Catálogo
                </Link>
                <Link
                    href="/#contato"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                    Contato
                </Link>
                <Link
                    href="/admin/leads"
                    className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                    title="Área Administrativa"
                >
                    Admin
                </Link>
                <Link
                    href="/catalogo"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Ver Veículos
                </Link>
            </nav>
        </header>
    );
} 