import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
}

export function generateId(): string {
    return Math.random().toString(36).substr(2, 9)
}

export function calculateCompatibilityScore(
    socialScore: number,
    preferencesScore: number,
    behaviorScore: number
): number {
    // Peso: dados sociais 40%, preferências 35%, comportamento 25%
    return Math.round(
        socialScore * 0.4 +
        preferencesScore * 0.35 +
        behaviorScore * 0.25
    )
}

export function getLifestyleCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        urbano: 'Urbano',
        familia: 'Família',
        aventureiro: 'Aventureiro',
        executivo: 'Executivo'
    }
    return labels[category] || category
}

export function getUrgencyLevelLabel(level: string): string {
    const labels: Record<string, string> = {
        imediatamente: 'Imediatamente',
        '3_meses': 'Em 3 meses',
        '6_meses': 'Em 6 meses',
        pesquisando: 'Apenas pesquisando'
    }
    return labels[level] || level
}

export function validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '')

    if (cnpj.length !== 14) return false

    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1+$/.test(cnpj)) return false

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    let digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--
        if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado !== parseInt(digitos.charAt(0))) return false

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--
        if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado !== parseInt(digitos.charAt(1))) return false

    return true
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
} 