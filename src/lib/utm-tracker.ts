'use client'

import { useEffect, useState } from 'react'

export interface UTMParameters {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
    utm_id?: string
    gclid?: string // Google Ads
    fbclid?: string // Facebook Ads
}

export interface TrackingData extends UTMParameters {
    referrer?: string
    landing_page?: string
    session_start?: string
    page_views?: number
}

const UTM_STORAGE_KEY = 'carencia_utm_data'
const SESSION_STORAGE_KEY = 'carencia_session_data'

/**
 * Hook para capturar e gerenciar parâmetros UTM
 */
export function useUTMTracking() {
    const [utmData, setUtmData] = useState<TrackingData>({})
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // Capturar parâmetros UTM da URL atual
        const urlParams = new URLSearchParams(window.location.search)
        const currentUTM: UTMParameters = {}

        // Extrair parâmetros UTM da URL
        const utmParams = [
            'utm_source', 'utm_medium', 'utm_campaign',
            'utm_content', 'utm_term', 'utm_id', 'gclid', 'fbclid'
        ]

        let hasNewUTM = false
        utmParams.forEach(param => {
            const value = urlParams.get(param)
            if (value) {
                currentUTM[param as keyof UTMParameters] = value
                hasNewUTM = true
            }
        })

        // Recuperar dados existentes do localStorage
        const existingUTM = getStoredUTMData()
        const sessionData = getSessionData()

        // Mesclar dados: novos parâmetros UTM sobrescrevem os antigos
        const mergedData: TrackingData = {
            ...existingUTM,
            ...currentUTM,
            referrer: document.referrer || existingUTM.referrer,
            landing_page: existingUTM.landing_page || window.location.pathname,
            session_start: sessionData.session_start || new Date().toISOString(),
            page_views: (sessionData.page_views || 0) + 1
        }

        // Salvar dados atualizados
        if (hasNewUTM || !existingUTM.utm_source) {
            localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(mergedData))
        }

        // Atualizar dados da sessão
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
            session_start: mergedData.session_start,
            page_views: mergedData.page_views
        }))

        setUtmData(mergedData)
        setIsLoaded(true)

        // Registrar evento de page view
        trackPageView(mergedData)

    }, [])

    return { utmData, isLoaded }
}

/**
 * Recuperar dados UTM salvos no localStorage
 */
export function getStoredUTMData(): TrackingData {
    if (typeof window === 'undefined') return {}

    try {
        const stored = localStorage.getItem(UTM_STORAGE_KEY)
        return stored ? JSON.parse(stored) : {}
    } catch (error) {
        console.warn('Erro ao recuperar dados UTM:', error)
        return {}
    }
}

/**
 * Recuperar dados da sessão atual
 */
function getSessionData(): { session_start?: string; page_views?: number } {
    if (typeof window === 'undefined') return {}

    try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
        return stored ? JSON.parse(stored) : {}
    } catch (error) {
        console.warn('Erro ao recuperar dados da sessão:', error)
        return {}
    }
}

/**
 * Limpar dados UTM (útil para testes)
 */
export function clearUTMData() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(UTM_STORAGE_KEY)
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
}

/**
 * Gerar URL com parâmetros UTM para compartilhamento
 */
export function generateUTMUrl(baseUrl: string, utmParams: UTMParameters): string {
    const url = new URL(baseUrl)

    Object.entries(utmParams).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value)
        }
    })

    return url.toString()
}

/**
 * Registrar evento de page view
 */
async function trackPageView(trackingData: TrackingData) {
    try {
        await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                evento: 'page_view',
                pagina: window.location.pathname,
                parametros: {
                    ...trackingData,
                    timestamp: new Date().toISOString(),
                    user_agent: navigator.userAgent,
                    screen_resolution: `${screen.width}x${screen.height}`,
                    window_size: `${window.innerWidth}x${window.innerHeight}`
                }
            })
        })
    } catch (error) {
        console.warn('Erro ao registrar page view:', error)
    }
}

/**
 * Calcular custo estimado do lead baseado na fonte
 */
export function calculateLeadCost(utmData: TrackingData): number | null {
    if (!utmData.utm_source) return null

    // Custo médio por lead baseado na fonte (valores de exemplo)
    const leadCosts: Record<string, number> = {
        'google': 5.50,
        'facebook': 3.20,
        'instagram': 2.80,
        'website': 0, // Orgânico
        'whatsapp': 1.50,
        'email': 0.50
    }

    return leadCosts[utmData.utm_source] || null
}

/**
 * Gerar relatório de origem para o lead
 */
export function generateLeadSourceReport(utmData: TrackingData): string {
    const parts = []

    if (utmData.utm_source) {
        parts.push(`Fonte: ${utmData.utm_source}`)
    }

    if (utmData.utm_medium) {
        parts.push(`Meio: ${utmData.utm_medium}`)
    }

    if (utmData.utm_campaign) {
        parts.push(`Campanha: ${utmData.utm_campaign}`)
    }

    if (utmData.referrer) {
        parts.push(`Referência: ${utmData.referrer}`)
    }

    if (utmData.landing_page) {
        parts.push(`Página inicial: ${utmData.landing_page}`)
    }

    return parts.join(' | ') || 'Origem não identificada'
}

/**
 * Configurações de campanhas pré-definidas
 */
export const CAMPAIGN_PRESETS = {
    facebook_cars: {
        utm_source: 'facebook',
        utm_medium: 'paid',
        utm_campaign: 'carros_seminovos',
        utm_content: 'feed_post'
    },
    instagram_stories: {
        utm_source: 'instagram',
        utm_medium: 'paid',
        utm_campaign: 'stories_carros',
        utm_content: 'story_video'
    },
    google_search: {
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'pesquisa_carros',
        utm_content: 'anuncio_texto'
    },
    whatsapp_direct: {
        utm_source: 'whatsapp',
        utm_medium: 'direct',
        utm_campaign: 'compartilhamento',
        utm_content: 'link_direto'
    }
} as const

export type CampaignPreset = keyof typeof CAMPAIGN_PRESETS 