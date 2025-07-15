'use client'

import { useState } from 'react'
import { useUTMTracking, calculateLeadCost } from '@/lib/utm-tracker'

export function FormularioTroca() {
    const [formData, setFormData] = useState({
        nome: '',
        modelo_atual: '',
        ano_atual: '',
        problema_atual: '',
        motivo_urgencia: '',
        valor_usado: '',
        renda_mensal: '',
        valor_entrada: '',
        tipo_carro_desejado: '',
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
            // Calcular score baseado nas respostas de troca
            let score = 40 // Base para troca urgente (alta conversão)

            // Pontuação por motivo da urgência
            if (formData.motivo_urgencia === 'quebrou') score += 30
            else if (formData.motivo_urgencia === 'acidente') score += 25
            else if (formData.motivo_urgencia === 'manutencao') score += 20
            else if (formData.motivo_urgencia === 'trabalho') score += 15

            // Pontuação por idade do carro atual
            const ano = parseInt(formData.ano_atual)
            const idade = 2024 - ano
            if (idade >= 15) score += 20
            else if (idade >= 10) score += 15
            else if (idade >= 5) score += 10

            // Pontuação por renda
            const renda = parseInt(formData.renda_mensal.replace(/\D/g, ''))
            if (renda >= 5000) score += 25
            else if (renda >= 3000) score += 20
            else if (renda >= 2000) score += 15
            else if (renda >= 1500) score += 10

            // Pontuação por valor do usado
            if (formData.valor_usado) {
                const valorUsado = parseInt(formData.valor_usado.replace(/\D/g, ''))
                if (valorUsado >= 30000) score += 25
                else if (valorUsado >= 20000) score += 20
                else if (valorUsado >= 15000) score += 15
                else if (valorUsado >= 10000) score += 10
            }

            // Pontuação por entrada adicional
            if (formData.valor_entrada) {
                const entrada = parseInt(formData.valor_entrada.replace(/\D/g, ''))
                if (entrada >= 10000) score += 15
                else if (entrada >= 5000) score += 10
                else if (entrada >= 3000) score += 5
            }

            // Pontuação por urgência
            if (formData.urgencia_compra === 'imediato') score += 30
            else if (formData.urgencia_compra === '7_dias') score += 25
            else if (formData.urgencia_compra === '15_dias') score += 20

            // Determinar temperatura do lead
            let temperatura = 'quente' // Troca urgente é sempre quente
            if (score >= 100) temperatura = 'super_quente'
            else if (score >= 80) temperatura = 'quente'
            else if (score >= 60) temperatura = 'morno'

            // Calcular custo estimado do lead
            const custoEstimado = calculateLeadCost(utmData)

            const payload = {
                nome: formData.nome,
                telefone: formData.telefone,
                email: formData.email || undefined,
                origem: utmData.utm_source || 'landing_troca',
                temperatura,
                score,
                // Dados específicos do perfil troca
                forma_pagamento: 'troca_mais_financiamento',
                prazo_compra: formData.urgencia_compra || 'imediato',
                // Dados UTM
                utm_source: utmData.utm_source || 'google',
                utm_medium: utmData.utm_medium || 'paid',
                utm_campaign: utmData.utm_campaign || 'troca_urgente',
                utm_content: utmData.utm_content || 'landing_page',
                custo_lead: custoEstimado?.toString(),
                // Observações detalhadas para o vendedor
                mensagem: `🔄 PERFIL TROCA URGENTE
🚗 Carro atual: ${formData.modelo_atual} ${formData.ano_atual}
❌ Problema: ${formData.problema_atual}
🚨 Motivo urgência: ${formData.motivo_urgencia}
💰 Valor estimado do usado: R$ ${formData.valor_usado}
💰 Renda mensal: R$ ${formData.renda_mensal}
💵 Entrada adicional: ${formData.valor_entrada ? `R$ ${formData.valor_entrada}` : 'Só o usado'}
🎯 Quer: ${formData.tipo_carro_desejado}
⚡ Urgência: ${formData.urgencia_compra}
🎯 Score: ${score} | Temperatura: ${temperatura.toUpperCase()}

⚠️ ATENÇÃO: LEAD QUENTE!
- Cliente com necessidade urgente
- Já tem veículo para dar de entrada
- Priorizar atendimento imediato
- Fazer avaliação do usado rapidamente
- Facilitar processo de troca`
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
🚨 TROCA URGENTE! Preciso trocar meu carro o mais rápido possível!

👤 ${formData.nome}
🚗 Carro atual: ${formData.modelo_atual} ${formData.ano_atual}
❌ Problema: ${formData.problema_atual}
🚨 Motivo da urgência: ${formData.motivo_urgencia}

💰 Renda mensal: R$ ${formData.renda_mensal}
💵 Valor estimado do meu carro: R$ ${formData.valor_usado}
💵 Entrada adicional: ${formData.valor_entrada ? `R$ ${formData.valor_entrada}` : 'Só o usado mesmo'}

🎯 Quero: ${formData.tipo_carro_desejado}

Preciso resolver isso ${formData.urgencia_compra === 'imediato' ? 'HOJE!' : `em ${formData.urgencia_compra?.replace('_', ' ')}`}

Podem me ajudar com a troca? É urgente! 🚗💨
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
                <div className="text-6xl mb-4">🚨</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">
                    Sua troca urgente está sendo processada!
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                    Redirecionamos você para nosso WhatsApp. Nossa equipe de troca urgente
                    vai te atender com prioridade total!
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-red-900 mb-2">🚨 ATENDIMENTO PRIORITÁRIO:</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                        <li>✅ Avaliação do seu usado em até 2 horas</li>
                        <li>✅ Seleção de carros disponíveis imediatamente</li>
                        <li>✅ Aprovação de crédito em até 24h</li>
                        <li>✅ Troca finalizada em até 48h</li>
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
                <div className="text-4xl mb-4">🚨</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Troca urgente do seu carro
                </h2>
                <p className="text-gray-600">
                    Não dá mais para esperar? Nós te ajudamos com a troca rápida!
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

                {/* Modelo atual */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qual carro você tem hoje? *
                    </label>
                    <input
                        type="text"
                        name="modelo_atual"
                        value={formData.modelo_atual}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Gol, Palio, HB20, Corsa..."
                    />
                </div>

                {/* Ano atual */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ano do seu carro *
                    </label>
                    <select
                        name="ano_atual"
                        value={formData.ano_atual}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione o ano</option>
                        {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Problema atual */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qual o problema com seu carro? *
                    </label>
                    <select
                        name="problema_atual"
                        value={formData.problema_atual}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="quebrou">Quebrou e não funciona</option>
                        <option value="motor">Problema no motor</option>
                        <option value="cambio">Problema no câmbio</option>
                        <option value="eletrica">Problema elétrico</option>
                        <option value="batida">Sofreu batida/acidente</option>
                        <option value="manutencao">Manutenção muito cara</option>
                        <option value="velho">Muito antigo</option>
                        <option value="outros">Outros problemas</option>
                    </select>
                </div>

                {/* Motivo urgência */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Por que é urgente? *
                    </label>
                    <select
                        name="motivo_urgencia"
                        value={formData.motivo_urgencia}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="trabalho">Preciso para trabalhar</option>
                        <option value="quebrou">Carro quebrou de vez</option>
                        <option value="acidente">Carro bateu/acidentou</option>
                        <option value="manutencao">Manutenção não compensa</option>
                        <option value="mudanca">Mudança de vida</option>
                        <option value="familia">Necessidade da família</option>
                    </select>
                </div>

                {/* Valor do usado */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quanto vale seu carro hoje? *
                    </label>
                    <select
                        name="valor_usado"
                        value={formData.valor_usado}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="5000">Até R$ 5.000</option>
                        <option value="10000">R$ 5.001 a R$ 10.000</option>
                        <option value="15000">R$ 10.001 a R$ 15.000</option>
                        <option value="20000">R$ 15.001 a R$ 20.000</option>
                        <option value="30000">R$ 20.001 a R$ 30.000</option>
                        <option value="40000">R$ 30.001 a R$ 40.000</option>
                        <option value="50000">Acima de R$ 40.000</option>
                        <option value="0">Não vale nada (só sucata)</option>
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
                        <option value="7000">Acima de R$ 5.000</option>
                    </select>
                </div>

                {/* Entrada adicional */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tem dinheiro para dar de entrada além do usado?
                    </label>
                    <select
                        name="valor_entrada"
                        value={formData.valor_entrada}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Só o usado mesmo</option>
                        <option value="3000">R$ 3.000</option>
                        <option value="5000">R$ 5.000</option>
                        <option value="10000">R$ 10.000</option>
                        <option value="15000">R$ 15.000</option>
                        <option value="20000">R$ 20.000 ou mais</option>
                    </select>
                </div>

                {/* Tipo de carro desejado */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Que tipo de carro você quer? *
                    </label>
                    <select
                        name="tipo_carro_desejado"
                        value={formData.tipo_carro_desejado}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="popular">Carro popular (Gol, Palio, Ka...)</option>
                        <option value="compacto">Compacto (HB20, Onix, Argo...)</option>
                        <option value="sedan">Sedan (Prisma, Voyage, Logan...)</option>
                        <option value="suv">SUV (Kicks, T-Cross, Duster...)</option>
                        <option value="pickup">Pickup (Saveiro, Strada...)</option>
                        <option value="qualquer">Qualquer um que funcione</option>
                    </select>
                </div>

                {/* Urgência */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Para quando você precisa? *
                    </label>
                    <select
                        name="urgencia_compra"
                        value={formData.urgencia_compra}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="imediato">🚨 HOJE! É urgente!</option>
                        <option value="7_dias">📅 Esta semana</option>
                        <option value="15_dias">⏰ Em até 15 dias</option>
                        <option value="30_dias">📆 Em até 30 dias</option>
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
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                    {enviando ? (
                        <>
                            <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                            Processando...
                        </>
                    ) : (
                        '🚨 URGENTE! Simular minha troca agora!'
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    🚨 Atendimento prioritário para troca urgente
                </p>
            </form>
        </div>
    )
} 