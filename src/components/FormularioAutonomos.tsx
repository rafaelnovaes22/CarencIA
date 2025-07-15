'use client'

import { useState } from 'react'
import { useUTMTracking, calculateLeadCost } from '@/lib/utm-tracker'

export function FormularioAutonomos() {
    const [formData, setFormData] = useState({
        nome: '',
        profissao: '',
        renda_mensal: '',
        usa_carro_trabalho: '',
        horas_trabalho: '',
        carro_atual: '',
        problema_atual: '',
        prioridade: '',
        valor_entrada: '',
        telefone: '',
        email: '',
        urgencia_compra: ''
    })

    const [enviando, setEnviando] = useState(false)
    const [sucesso, setSucesso] = useState(false)
    const [erro, setErro] = useState('')

    // Capturar dados UTM automaticamente
    const { utmData } = useUTMTracking()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setEnviando(true)
        setErro('')

        try {
            // Calcular score baseado nas respostas autônomos
            let score = 35 // Base para autônomos (alta necessidade)

            // Pontuação por profissão
            if (formData.profissao === 'motorista_app') score += 25
            else if (formData.profissao === 'entregador') score += 20
            else if (formData.profissao === 'vendedor') score += 15
            else if (formData.profissao === 'comerciante') score += 10

            // Pontuação por renda
            const renda = parseInt(formData.renda_mensal.replace(/\D/g, ''))
            if (renda >= 4000) score += 25
            else if (renda >= 3000) score += 20
            else if (renda >= 2000) score += 15
            else if (renda >= 1500) score += 10

            // Pontuação por uso do carro no trabalho
            if (formData.usa_carro_trabalho === 'sim_integral') score += 25
            else if (formData.usa_carro_trabalho === 'sim_parcial') score += 15

            // Pontuação por horas de trabalho
            const horas = parseInt(formData.horas_trabalho)
            if (horas >= 12) score += 20
            else if (horas >= 8) score += 15
            else if (horas >= 6) score += 10

            // Pontuação por problema atual
            if (formData.problema_atual === 'quebra_muito') score += 25
            else if (formData.problema_atual === 'consumo_alto') score += 20
            else if (formData.problema_atual === 'sem_carro') score += 30

            // Pontuação por entrada
            if (formData.valor_entrada) {
                const entrada = parseInt(formData.valor_entrada.replace(/\D/g, ''))
                if (entrada >= 15000) score += 20
                else if (entrada >= 10000) score += 15
                else if (entrada >= 5000) score += 10
            }

            // Pontuação por urgência
            if (formData.urgencia_compra === 'imediato') score += 30
            else if (formData.urgencia_compra === '15_dias') score += 25
            else if (formData.urgencia_compra === '30_dias') score += 15

            // Determinar temperatura do lead
            let temperatura = 'frio'
            if (score >= 90) temperatura = 'quente'
            else if (score >= 70) temperatura = 'morno'

            // Calcular custo estimado do lead
            const custoEstimado = calculateLeadCost(utmData)

            const payload = {
                nome: formData.nome,
                telefone: formData.telefone,
                email: formData.email || undefined,
                origem: utmData.utm_source || 'landing_autonomos',
                temperatura,
                score,
                // Dados específicos do perfil autônomo
                forma_pagamento: 'financiado', // Autônomos precisam de financiamento
                prazo_compra: formData.urgencia_compra || '30_dias',
                // Dados UTM
                utm_source: utmData.utm_source || 'google',
                utm_medium: utmData.utm_medium || 'paid',
                utm_campaign: utmData.utm_campaign || 'autonomos_ferramenta_trabalho',
                utm_content: utmData.utm_content || 'landing_page',
                custo_lead: custoEstimado?.toString(),
                // Observações detalhadas para o vendedor
                mensagem: `🔧 PERFIL AUTÔNOMO
💼 Profissão: ${formData.profissao}
💰 Renda mensal: R$ ${formData.renda_mensal}
🚗 Usa carro no trabalho: ${formData.usa_carro_trabalho}
⏰ Horas de trabalho/dia: ${formData.horas_trabalho}h
🔧 Situação atual: ${formData.carro_atual || 'Não informado'}
❌ Problema atual: ${formData.problema_atual}
🎯 Prioridade: ${formData.prioridade}
💵 Entrada: ${formData.valor_entrada ? `R$ ${formData.valor_entrada}` : 'A definir'}
⚡ Urgência: ${formData.urgencia_compra}
🎯 Score: ${score} | Temperatura: ${temperatura.toUpperCase()}

ABORDAGEM RECOMENDADA:
- Foque na capacidade de geração de renda do veículo
- Destaque economia de combustível e baixa manutenção
- Mostre ROI: quanto ele pode ganhar a mais com um carro melhor
- Facilite aprovação para autônomos
- Use linguagem de "investimento" não "gasto"`
            }

            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error || 'Erro ao processar sua solicitação')
            }

            // Sucesso - Preparar mensagem para WhatsApp
            const mensagemWhatsApp = `
🔧 Olá! Preciso de um carro para trabalhar e vencer na vida!

👤 ${formData.nome}
💼 Profissão: ${formData.profissao}
💰 Renda mensal: R$ ${formData.renda_mensal}
🚗 Uso o carro para trabalhar: ${formData.usa_carro_trabalho}
⏰ Trabalho ${formData.horas_trabalho}h por dia

🔧 Situação atual: ${formData.carro_atual || 'Não tenho carro'}
❌ Problema: ${formData.problema_atual}
🎯 Prioridade: ${formData.prioridade}
💵 Entrada disponível: ${formData.valor_entrada ? `R$ ${formData.valor_entrada}` : 'A conversar'}

Preciso ${formData.urgencia_compra === 'imediato' ? 'URGENTE de um carro para trabalhar!' : `de um carro em ${formData.urgencia_compra?.replace('_', ' ')}`}

O carro é minha ferramenta de trabalho, podem me ajudar? 🚗💪
            `.trim()

            const whatsappUrl = `https://wa.me/5511940763330?text=${encodeURIComponent(mensagemWhatsApp)}`
            window.open(whatsappUrl, '_blank')

            setSucesso(true)

        } catch (error) {
            console.error('Erro ao enviar:', error)
            setErro('Ops! Algo deu errado. Tente novamente ou fale direto no WhatsApp.')
        } finally {
            setEnviando(false)
        }
    }

    if (sucesso) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-6xl mb-4">🔧</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">
                    Sua ferramenta de trabalho está a caminho!
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                    Redirecionamos você para nosso WhatsApp. Nossa equipe especializada em profissionais autônomos
                    vai te ajudar a encontrar o carro que vai turbinar sua renda!
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2">💼 Próximos passos:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>✅ Análise do perfil profissional</li>
                        <li>✅ Seleção de carros econômicos e resistentes</li>
                        <li>✅ Simulação com aprovação facilitada</li>
                        <li>✅ Cálculo do ROI do investimento</li>
                    </ul>
                </div>
                <button
                    onClick={() => setSucesso(false)}
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                    Simular outro perfil
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
                <div className="text-4xl mb-4">🔧</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Encontre sua ferramenta de trabalho
                </h2>
                <p className="text-gray-600">
                    Preencha os dados e descubra como um carro melhor pode aumentar sua renda
                </p>
            </div>

            {erro && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seu nome *
                    </label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome completo"
                    />
                </div>

                {/* Profissão */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qual sua profissão? *
                    </label>
                    <select
                        name="profissao"
                        value={formData.profissao}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="motorista_app">Motorista de app (Uber, 99...)</option>
                        <option value="entregador">Entregador (iFood, Rappi...)</option>
                        <option value="vendedor">Vendedor externo</option>
                        <option value="comerciante">Comerciante</option>
                        <option value="prestador_servicos">Prestador de serviços</option>
                        <option value="autonomo_outros">Outros autônomos</option>
                    </select>
                </div>

                {/* Renda mensal */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sua renda mensal *
                    </label>
                    <select
                        name="renda_mensal"
                        value={formData.renda_mensal}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="1500">Até R$ 1.500</option>
                        <option value="2000">R$ 1.501 a R$ 2.000</option>
                        <option value="3000">R$ 2.001 a R$ 3.000</option>
                        <option value="4000">R$ 3.001 a R$ 4.000</option>
                        <option value="5000">R$ 4.001 a R$ 5.000</option>
                        <option value="6000">Acima de R$ 5.000</option>
                    </select>
                </div>

                {/* Usa carro no trabalho */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Você usa carro para trabalhar? *
                    </label>
                    <select
                        name="usa_carro_trabalho"
                        value={formData.usa_carro_trabalho}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="sim_integral">Sim, uso o dia inteiro</option>
                        <option value="sim_parcial">Sim, uso algumas horas</option>
                        <option value="nao">Não, mas quero começar</option>
                    </select>
                </div>

                {/* Horas de trabalho */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantas horas trabalha por dia? *
                    </label>
                    <select
                        name="horas_trabalho"
                        value={formData.horas_trabalho}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="4">4 horas</option>
                        <option value="6">6 horas</option>
                        <option value="8">8 horas</option>
                        <option value="10">10 horas</option>
                        <option value="12">12 horas ou mais</option>
                    </select>
                </div>

                {/* Carro atual */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qual carro você tem hoje? (opcional)
                    </label>
                    <input
                        type="text"
                        name="carro_atual"
                        value={formData.carro_atual}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Gol 2010, HB20 2018, ou 'Não tenho'"
                    />
                </div>

                {/* Problema atual */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qual seu maior problema hoje? *
                    </label>
                    <select
                        name="problema_atual"
                        value={formData.problema_atual}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="sem_carro">Não tenho carro</option>
                        <option value="quebra_muito">Meu carro quebra muito</option>
                        <option value="consumo_alto">Gasto muito combustível</option>
                        <option value="manutencao_cara">Manutenção muito cara</option>
                        <option value="carro_velho">Carro muito antigo</option>
                    </select>
                </div>

                {/* Prioridade */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        O que é mais importante para você? *
                    </label>
                    <select
                        name="prioridade"
                        value={formData.prioridade}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="economia">Economia de combustível</option>
                        <option value="confiabilidade">Confiabilidade (não quebrar)</option>
                        <option value="valor_revenda">Bom valor de revenda</option>
                        <option value="conforto">Conforto para longas jornadas</option>
                        <option value="preco_baixo">Menor preço</option>
                    </select>
                </div>

                {/* Entrada */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quanto você tem para entrada?
                    </label>
                    <select
                        name="valor_entrada"
                        value={formData.valor_entrada}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="0">Sem entrada</option>
                        <option value="3000">Até R$ 3.000</option>
                        <option value="5000">R$ 3.001 a R$ 5.000</option>
                        <option value="10000">R$ 5.001 a R$ 10.000</option>
                        <option value="15000">R$ 10.001 a R$ 15.000</option>
                        <option value="20000">Acima de R$ 15.000</option>
                    </select>
                </div>

                {/* Urgência */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quando você precisa do carro? *
                    </label>
                    <select
                        name="urgencia_compra"
                        value={formData.urgencia_compra}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="imediato">🚨 URGENTE! Preciso agora</option>
                        <option value="15_dias">📅 Em até 15 dias</option>
                        <option value="30_dias">⏰ Em até 30 dias</option>
                        <option value="60_dias">📆 Em até 60 dias</option>
                    </select>
                </div>

                {/* Telefone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp para contato *
                    </label>
                    <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(11) 99999-9999"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail (opcional)
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="seu@email.com"
                    />
                </div>

                {/* CTA */}
                <button
                    type="submit"
                    disabled={enviando}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                    {enviando ? (
                        <>
                            <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                            Processando...
                        </>
                    ) : (
                        '🔧 Quero meu carro para trabalhar!'
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    📱 Você será redirecionado para nosso WhatsApp especializado em profissionais
                </p>
            </form>
        </div>
    )
} 