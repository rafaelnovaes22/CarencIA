'use client'

import { useState } from 'react'
import { useUTMTracking, calculateLeadCost } from '@/lib/utm-tracker'

export function FormularioFamilias() {
    const [formData, setFormData] = useState({
        nome: '',
        numero_filhos: '',
        idade_filhos: '',
        renda_familiar: '',
        tem_carro_atual: '',
        modelo_atual: '',
        motivo_troca: '',
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
            // Calcular score baseado nas respostas familiares
            let score = 30 // Base para famílias (maior intenção de compra)

            // Pontuação por número de filhos (mais filhos = mais necessidade)
            const filhos = parseInt(formData.numero_filhos)
            if (filhos >= 3) score += 20
            else if (filhos >= 2) score += 15
            else if (filhos >= 1) score += 10

            // Pontuação por renda familiar
            const renda = parseInt(formData.renda_familiar.replace(/\D/g, ''))
            if (renda >= 8000) score += 25
            else if (renda >= 5000) score += 20
            else if (renda >= 3000) score += 15
            else if (renda >= 2000) score += 10

            // Pontuação por ter carro atual (capacidade de troca)
            if (formData.tem_carro_atual === 'sim') score += 15

            // Pontuação por motivo da troca
            if (formData.motivo_troca === 'pequeno') score += 20
            else if (formData.motivo_troca === 'inseguro') score += 15
            else if (formData.motivo_troca === 'gasto') score += 10

            // Pontuação por entrada
            if (formData.valor_entrada) {
                const entrada = parseInt(formData.valor_entrada.replace(/\D/g, ''))
                if (entrada >= 20000) score += 20
                else if (entrada >= 10000) score += 15
                else if (entrada >= 5000) score += 10
            }

            // Pontuação por urgência
            if (formData.urgencia_compra === 'imediato') score += 25
            else if (formData.urgencia_compra === '30_dias') score += 20
            else if (formData.urgencia_compra === '60_dias') score += 10

            // Determinar temperatura do lead
            let temperatura = 'frio'
            if (score >= 85) temperatura = 'quente'
            else if (score >= 65) temperatura = 'morno'

            // Calcular custo estimado do lead
            const custoEstimado = calculateLeadCost(utmData)

            const payload = {
                nome: formData.nome,
                telefone: formData.telefone,
                email: formData.email || undefined,
                origem: utmData.utm_source || 'landing_familias',
                temperatura,
                score,
                // Dados específicos do perfil família
                forma_pagamento: 'financiado', // Famílias preferem financiar
                prazo_compra: formData.urgencia_compra || '60_dias',
                // Dados UTM
                utm_source: utmData.utm_source || 'facebook',
                utm_medium: utmData.utm_medium || 'paid',
                utm_campaign: utmData.utm_campaign || 'familias_espaco_conforto',
                utm_content: utmData.utm_content || 'landing_page',
                custo_lead: custoEstimado?.toString(),
                // Observações detalhadas para o vendedor
                mensagem: `👨‍👩‍👧‍👦 PERFIL FAMÍLIA (${formData.numero_filhos} filhos)
💰 Renda familiar: R$ ${formData.renda_familiar}
🚗 Carro atual: ${formData.tem_carro_atual === 'sim' ? formData.modelo_atual : 'Não tem'}
🔄 Motivo troca: ${formData.motivo_troca}
🎯 Prioridade: ${formData.prioridade}
💵 Entrada: ${formData.valor_entrada ? `R$ ${formData.valor_entrada}` : 'A definir'}
⏰ Urgência: ${formData.urgencia_compra}
🎯 Score: ${score} | Temperatura: ${temperatura.toUpperCase()}

ABORDAGEM RECOMENDADA:
- Foque em segurança e espaço interno
- Destaque porta-malas grande e conforto
- Mencione economia no consumo (orçamento familiar)
- Mostre como o carro facilitará o dia a dia com crianças
- Use linguagem que conecte com responsabilidade familiar`
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
👨‍👩‍👧‍👦 Olá! Estamos procurando um carro mais adequado para nossa família!

👤 ${formData.nome}
👶 ${formData.numero_filhos} filhos (idades: ${formData.idade_filhos || 'variadas'})
💰 Renda familiar: R$ ${formData.renda_familiar}
🚗 Situação atual: ${formData.tem_carro_atual === 'sim' ? `Temos ${formData.modelo_atual}` : 'Não temos carro'}

${formData.motivo_troca ? `🔄 Motivo da troca: ${formData.motivo_troca}` : ''}
🎯 Nossa prioridade é: ${formData.prioridade}
💵 Entrada disponível: ${formData.valor_entrada ? `R$ ${formData.valor_entrada}` : 'A conversar'}

Estamos ${formData.urgencia_compra === 'imediato' ? 'com urgência para trocar' : `planejando trocar em ${formData.urgencia_compra?.replace('_', ' ')}`}.

Podem nos ajudar a encontrar um carro que atenda nossa família? 🚗👨‍👩‍👧‍👦
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
                <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">
                    Sua família merece o melhor!
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                    Redirecionamos você para nosso WhatsApp. Nossa equipe especializada em famílias
                    vai te ajudar a encontrar o carro perfeito com segurança e conforto!
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2">👨‍👩‍👧‍👦 Próximos passos:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>✅ Análise das necessidades da família</li>
                        <li>✅ Seleção de veículos seguros e espaçosos</li>
                        <li>✅ Simulação com condições especiais</li>
                        <li>✅ Agendamento de test-drive familiar</li>
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
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Encontre o carro perfeito para sua família
                </h2>
                <p className="text-gray-600">
                    Preencha os dados abaixo e receba uma simulação personalizada
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

                {/* Número de filhos */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantos filhos vocês têm? *
                    </label>
                    <select
                        name="numero_filhos"
                        value={formData.numero_filhos}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="1">1 filho</option>
                        <option value="2">2 filhos</option>
                        <option value="3">3 filhos</option>
                        <option value="4">4 ou mais filhos</option>
                    </select>
                </div>

                {/* Idade dos filhos */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Idades dos filhos (opcional)
                    </label>
                    <input
                        type="text"
                        name="idade_filhos"
                        value={formData.idade_filhos}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: 8, 12 e 15 anos"
                    />
                </div>

                {/* Renda familiar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Renda familiar mensal *
                    </label>
                    <select
                        name="renda_familiar"
                        value={formData.renda_familiar}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="2000">Até R$ 2.000</option>
                        <option value="3000">R$ 2.001 a R$ 3.000</option>
                        <option value="5000">R$ 3.001 a R$ 5.000</option>
                        <option value="8000">R$ 5.001 a R$ 8.000</option>
                        <option value="12000">R$ 8.001 a R$ 12.000</option>
                        <option value="15000">Acima de R$ 12.000</option>
                    </select>
                </div>

                {/* Carro atual */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vocês já têm carro? *
                    </label>
                    <select
                        name="tem_carro_atual"
                        value={formData.tem_carro_atual}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="sim">Sim, temos carro</option>
                        <option value="nao">Não, seria o primeiro</option>
                    </select>
                </div>

                {/* Modelo atual - Condicional */}
                {formData.tem_carro_atual === 'sim' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Qual carro vocês têm hoje?
                        </label>
                        <input
                            type="text"
                            name="modelo_atual"
                            value={formData.modelo_atual}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: Gol 2015, Palio 2018..."
                        />
                    </div>
                )}

                {/* Motivo da troca - Condicional */}
                {formData.tem_carro_atual === 'sim' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Por que querem trocar?
                        </label>
                        <select
                            name="motivo_troca"
                            value={formData.motivo_troca}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Selecione</option>
                            <option value="pequeno">Carro muito pequeno para família</option>
                            <option value="velho">Carro muito antigo</option>
                            <option value="gasto">Muitos gastos com manutenção</option>
                            <option value="inseguro">Pouca segurança</option>
                            <option value="conforto">Falta de conforto</option>
                        </select>
                    </div>
                )}

                {/* Prioridade */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        O que é mais importante para vocês? *
                    </label>
                    <select
                        name="prioridade"
                        value={formData.prioridade}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="espaco">Espaço interno e porta-malas</option>
                        <option value="seguranca">Segurança (airbags, freios...)</option>
                        <option value="economia">Economia de combustível</option>
                        <option value="conforto">Conforto (ar, direção...)</option>
                        <option value="preco">Menor preço</option>
                    </select>
                </div>

                {/* Entrada */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quanto têm disponível para entrada?
                    </label>
                    <select
                        name="valor_entrada"
                        value={formData.valor_entrada}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="0">Sem entrada</option>
                        <option value="5000">Até R$ 5.000</option>
                        <option value="10000">R$ 5.001 a R$ 10.000</option>
                        <option value="20000">R$ 10.001 a R$ 20.000</option>
                        <option value="30000">R$ 20.001 a R$ 30.000</option>
                        <option value="40000">Acima de R$ 30.000</option>
                    </select>
                </div>

                {/* Urgência */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Para quando precisam do carro? *
                    </label>
                    <select
                        name="urgencia_compra"
                        value={formData.urgencia_compra}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="imediato">🚨 Urgente (precisamos agora)</option>
                        <option value="30_dias">📅 Em até 30 dias</option>
                        <option value="60_dias">⏰ Em até 60 dias</option>
                        <option value="90_dias">📆 Em até 90 dias</option>
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
                        placeholder="familia@email.com"
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
                        '👨‍👩‍👧‍👦 Simular agora e surpreender a família!'
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    📱 Você será redirecionado para nosso WhatsApp especializado em famílias
                </p>
            </form>
        </div>
    )
} 