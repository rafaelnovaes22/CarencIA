import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface LeadDistributionResult {
    success: boolean
    concessionaria?: {
        id: string
        nome: string
        telefone?: string
        email?: string
        webhook_url?: string
    }
    error?: string
}

export interface NotificationResult {
    success: boolean
    method: 'webhook' | 'email' | 'none'
    message?: string
    error?: string
}

/**
 * Distribui um lead para a concessionária adequada baseado na fonte do veículo
 */
export async function distribuirLead(leadId: string): Promise<LeadDistributionResult> {
    try {
        // Buscar o lead com informações do veículo
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                veiculo_interesse: {
                    include: {
                        concessionaria: true
                    }
                }
            }
        })

        if (!lead) {
            return {
                success: false,
                error: 'Lead não encontrado'
            }
        }

        // Se o lead já tem concessionária responsável, não redistribuir
        if (lead.concessionaria_responsavel_id) {
            const concessionaria = await prisma.concessionaria.findUnique({
                where: { id: lead.concessionaria_responsavel_id }
            })

            return {
                success: true,
                concessionaria: concessionaria ? {
                    id: concessionaria.id,
                    nome: concessionaria.nome,
                    telefone: concessionaria.telefone || undefined,
                    email: concessionaria.email || undefined,
                    webhook_url: concessionaria.webhook_url || undefined
                } : undefined
            }
        }

        let concessionariaResponsavel = null

        // Estratégia 1: Usar concessionária do veículo (se existir)
        if (lead.veiculo_interesse?.concessionaria) {
            concessionariaResponsavel = lead.veiculo_interesse.concessionaria
        } else {
            // Estratégia 2: Buscar concessionária pela fonte do veículo
            if (lead.veiculo_interesse?.fonte_scraping) {
                concessionariaResponsavel = await getConcessionariaByFonte(
                    lead.veiculo_interesse.fonte_scraping
                )
            }
        }

        // Estratégia 3: Usar concessionária padrão se não encontrar
        if (!concessionariaResponsavel) {
            concessionariaResponsavel = await getConcessionariaPadrao()
        }

        if (!concessionariaResponsavel) {
            return {
                success: false,
                error: 'Nenhuma concessionária disponível para receber o lead'
            }
        }

        // Atualizar o lead com a concessionária responsável
        await prisma.lead.update({
            where: { id: leadId },
            data: {
                concessionaria_responsavel_id: concessionariaResponsavel.id,
                status: 'novo',
                updated_at: new Date()
            }
        })

        // Registrar evento de distribuição
        await prisma.evento.create({
            data: {
                lead_id: leadId,
                veiculo_id: lead.veiculo_interesse_id,
                evento: 'lead_distribuido',
                parametros: {
                    concessionaria_id: concessionariaResponsavel.id,
                    concessionaria_nome: concessionariaResponsavel.nome,
                    metodo_distribuicao: lead.veiculo_interesse?.concessionaria ? 'veiculo' : 'fonte'
                }
            }
        })

        return {
            success: true,
            concessionaria: {
                id: concessionariaResponsavel.id,
                nome: concessionariaResponsavel.nome,
                telefone: concessionariaResponsavel.telefone || undefined,
                email: concessionariaResponsavel.email || undefined,
                webhook_url: concessionariaResponsavel.webhook_url || undefined
            }
        }

    } catch (error) {
        console.error('Erro ao distribuir lead:', error)
        return {
            success: false,
            error: 'Erro interno ao distribuir lead'
        }
    }
}

/**
 * Envia notificação para a concessionária sobre o novo lead
 */
export async function notificarConcessionaria(
    leadId: string,
    concessionaria: NonNullable<LeadDistributionResult['concessionaria']>
): Promise<NotificationResult> {
    try {
        // Buscar dados completos do lead
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                veiculo_interesse: true
            }
        })

        if (!lead) {
            return {
                success: false,
                method: 'none',
                error: 'Lead não encontrado'
            }
        }

        // Prioridade 1: Webhook
        if (concessionaria.webhook_url) {
            const leadData = {
                id: lead.id,
                nome: lead.nome,
                email: lead.email,
                telefone: lead.telefone,
                origem: lead.origem,
                created_at: lead.created_at,
                veiculo_interesse: lead.veiculo_interesse ? {
                    id: lead.veiculo_interesse.id,
                    marca: lead.veiculo_interesse.marca,
                    modelo: lead.veiculo_interesse.modelo,
                    ano: lead.veiculo_interesse.ano,
                    preco: Number(lead.veiculo_interesse.preco)
                } : null
            }
            const webhookResult = await enviarWebhook(concessionaria.webhook_url, leadData)
            if (webhookResult.success) {
                return {
                    success: true,
                    method: 'webhook',
                    message: 'Webhook enviado com sucesso'
                }
            }
        }

        // Prioridade 2: Email (implementar depois)
        if (concessionaria.email) {
            // TODO: Implementar envio por email
            // const emailResult = await enviarEmail(concessionaria.email, lead)
        }

        // Prioridade 3: Apenas registrar (sem notificação ativa)
        await prisma.interacao.create({
            data: {
                lead_id: leadId,
                tipo: 'sistema',
                canal: 'automatico',
                assunto: 'Lead distribuído',
                mensagem: `Lead distribuído para ${concessionaria.nome}. Aguardando contato.`,
                enviado_por: 'sistema'
            }
        })

        return {
            success: true,
            method: 'none',
            message: 'Lead registrado para a concessionária'
        }

    } catch (error) {
        console.error('Erro ao notificar concessionária:', error)
        return {
            success: false,
            method: 'none',
            error: 'Erro interno ao enviar notificação'
        }
    }
}

/**
 * Processa um lead completo: distribui + notifica
 */
export async function processarLead(leadId: string) {
    try {
        console.log(`🔄 Processando lead ${leadId}...`)

        // Distribuir o lead
        const distribuicaoResult = await distribuirLead(leadId)

        if (!distribuicaoResult.success) {
            console.error('❌ Erro na distribuição:', distribuicaoResult.error)
            return {
                success: false,
                error: distribuicaoResult.error
            }
        }

        console.log(`✅ Lead distribuído para: ${distribuicaoResult.concessionaria?.nome}`)

        // Notificar a concessionária
        if (distribuicaoResult.concessionaria) {
            const notificacaoResult = await notificarConcessionaria(
                leadId,
                distribuicaoResult.concessionaria
            )

            if (notificacaoResult.success) {
                console.log(`📧 Notificação enviada via ${notificacaoResult.method}`)
            } else {
                console.warn('⚠️ Falha na notificação:', notificacaoResult.error)
            }
        }

        return {
            success: true,
            concessionaria: distribuicaoResult.concessionaria,
            message: 'Lead processado com sucesso'
        }

    } catch (error) {
        console.error('❌ Erro ao processar lead:', error)
        return {
            success: false,
            error: 'Erro interno no processamento'
        }
    }
}

/**
 * Helpers
 */
async function getConcessionariaByFonte(fonte: string) {
    // Mapeamento de fontes para concessionárias
    const mapeamento: Record<string, string> = {
        'robust_car': 'robust_car_concessionaria'
    }

    const slug = mapeamento[fonte]
    if (!slug) return null

    return await prisma.concessionaria.findUnique({
        where: { slug }
    })
}

async function getConcessionariaPadrao() {
    return await prisma.concessionaria.findFirst({
        where: {
            recebe_leads: true,
            scraping_ativo: true
        },
        orderBy: {
            created_at: 'asc'
        }
    })
}

async function enviarWebhook(url: string, lead: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    origem: string;
    created_at: Date;
    veiculo_interesse?: {
        id: string;
        marca: string;
        modelo: string;
        ano: number;
        preco: number;
    } | null;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const payload = {
            evento: 'novo_lead',
            timestamp: new Date().toISOString(),
            lead: {
                id: lead.id,
                nome: lead.nome,
                email: lead.email,
                telefone: lead.telefone,
                veiculo_interesse: lead.veiculo_interesse ? {
                    id: lead.veiculo_interesse.id,
                    marca: lead.veiculo_interesse.marca,
                    modelo: lead.veiculo_interesse.modelo,
                    ano: lead.veiculo_interesse.ano,
                    preco: lead.veiculo_interesse.preco
                } : null,
                origem: lead.origem,
                created_at: lead.created_at
            }
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'CarencIA-LeadDistributor/1.0'
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10000) // 10 segundos timeout
        })

        if (!response.ok) {
            return {
                success: false,
                error: `Webhook retornou status ${response.status}`
            }
        }

        return { success: true }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        }
    }
}

export {
    getConcessionariaByFonte,
    getConcessionariaPadrao,
    enviarWebhook
} 