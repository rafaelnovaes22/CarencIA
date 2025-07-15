'use client'

import { useState } from 'react'
import { useUTMTracking, calculateLeadCost } from '@/lib/utm-tracker'

export function FormularioJovens() {
    const [formData, setFormData] = useState({
        nome: '',
        idade: '',
        profissao: '',
        situacao_emprego: '',
        renda_mensal: '',
        tem_entrada: '',
        valor_entrada: '',
        telefone: '',
        email: '',
        urgencia_compra: '',
        primeira_compra: 'sim'
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
            // Calcular score baseado nas respostas
            let score = 20 // Base para jovens

            // Pontuação por idade (mais jovem = mais pontos pela primeira compra)
            if (parseInt(formData.idade) <= 25) score += 15
            else if (parseInt(formData.idade) <= 28) score += 10

            // Pontuação por situação de emprego
            if (formData.situacao_emprego === 'clt') score += 20
            else if (formData.situacao_emprego === 'autonomo') score += 15
            else if (formData.situacao_emprego === 'estagiario') score += 10

            // Pontuação por renda
            const renda = parseInt(formData.renda_mensal.replace(/\D/g, ''))
            if (renda >= 3000) score += 25
            else if (renda >= 2000) score += 20
            else if (renda >= 1500) score += 15
            else if (renda >= 1200) score += 10

            // Pontuação por entrada
            if (formData.tem_entrada === 'sim') {
                score += 20
                const entrada = parseInt(formData.valor_entrada.replace(/\D/g, ''))
                if (entrada >= 10000) score += 15
                else if (entrada >= 5000) score += 10
                else if (entrada >= 3000) score += 5
            }

            // Pontuação por urgência
            if (formData.urgencia_compra === 'imediato') score += 25
            else if (formData.urgencia_compra === '30_dias') score += 20
            else if (formData.urgencia_compra === '60_dias') score += 10

            // Determinar temperatura do lead
            let temperatura = 'frio'
            if (score >= 80) temperatura = 'quente'
            else if (score >= 60) temperatura = 'morno'

            // Calcular custo estimado do lead
            const custoEstimado = calculateLeadCost(utmData)

            const payload = {
                nome: formData.nome,
                telefone: formData.telefone,
                email: formData.email || undefined,
                origem: utmData.utm_source || 'landing_jovens',
                temperatura,
                score,
                // Dados específicos do perfil jovem
                forma_pagamento: formData.situacao_emprego === 'clt' ? 'financiado' : 'avista',
                prazo_compra: formData.urgencia_compra || '30_dias',
                // Dados UTM
                utm_source: utmData.utm_source || 'facebook',
                utm_medium: utmData.utm_medium || 'paid',
                utm_campaign: utmData.utm_campaign || 'jovens_primeira_compra',
                utm_content: utmData.utm_content || 'landing_page',
                custo_lead: custoEstimado?.toString(),
                // Observações detalhadas para o vendedor
                mensagem: `🎯 PERFIL JOVEM (${formData.idade} anos)
💼 ${formData.profissao} - ${formData.situacao_emprego}
💰 Renda: R$ ${formData.renda_mensal}
💵 Entrada: ${formData.tem_entrada === 'sim' ? `R$ ${formData.valor_entrada}` : 'Não tem'}
⏰ Urgência: ${formData.urgencia_compra}
🎯 Score: ${score} | Temperatura: ${temperatura.toUpperCase()}
🚗 Primeira compra: SIM

ABORDAGEM RECOMENDADA:
- Foque em parcelas baixas e aprovação facilitada
- Destaque carros econômicos (consumo)
- Mostre independência e status que o carro traz
- Use linguagem jovem e descontraída`
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
🎉 Olá! Quero conquistar minha primeira liberdade sobre rodas!

👤 ${formData.nome}, ${formData.idade} anos
💼 ${formData.profissao}
💰 Renda mensal: R$ ${formData.renda_mensal}
💵 Entrada disponível: ${formData.tem_entrada === 'sim' ? `R$ ${formData.valor_entrada}` : 'Sem entrada no momento'}

Estou ${formData.urgencia_compra === 'imediato' ? 'pronto para comprar AGORA' : `querendo comprar em ${formData.urgencia_compra.replace('_', ' ')}`}!

Podem me ajudar a encontrar um carro que caiba no meu bolso? 🚗✨
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
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">
                    Seu sonho está mais perto!
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                    Redirecionamos você para nosso WhatsApp. Nossa equipe especializada em jovens compradores
                    vai te ajudar a encontrar o carro perfeito com as melhores condições!
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2">📞 Próximos passos:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>✅ Análise do seu perfil em até 30 minutos</li>
                        <li>✅ Pré-aprovação facilitada para jovens</li>
                        <li>✅ Seleção de carros que cabem no seu bolso</li>
                        <li>✅ Simulação de parcelas sem compromisso</li>
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
                <div className="text-4xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Simule agora seu primeiro carro!
                </h2>
                <p className="text-gray-600">
                    Preencha os dados abaixo e descubra as melhores condições para jovens
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
                        Qual seu nome? *
                    </label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Seu nome completo"
                    />
                </div>

                {/* Idade */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantos anos você tem? *
                    </label>
                    <select
                        name="idade"
                        value={formData.idade}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione sua idade</option>
                        {Array.from({ length: 9 }, (_, i) => 20 + i).map(age => (
                            <option key={age} value={age}>{age} anos</option>
                        ))}
                    </select>
                </div>

                {/* Profissão */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qual sua profissão? *
                    </label>
                    <input
                        type="text"
                        name="profissao"
                        value={formData.profissao}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Vendedor, Programador, Estudante..."
                    />
                </div>

                {/* Situação de Emprego */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Como você trabalha? *
                    </label>
                    <select
                        name="situacao_emprego"
                        value={formData.situacao_emprego}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="clt">CLT (Carteira assinada)</option>
                        <option value="autonomo">Autônomo/Freelancer</option>
                        <option value="estagiario">Estagiário</option>
                        <option value="estudante">Só estudo</option>
                    </select>
                </div>

                {/* Renda */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qual sua renda mensal? *
                    </label>
                    <select
                        name="renda_mensal"
                        value={formData.renda_mensal}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="1200">Até R$ 1.200</option>
                        <option value="1500">R$ 1.201 a R$ 1.500</option>
                        <option value="2000">R$ 1.501 a R$ 2.000</option>
                        <option value="3000">R$ 2.001 a R$ 3.000</option>
                        <option value="4000">R$ 3.001 a R$ 4.000</option>
                        <option value="5000">Acima de R$ 4.000</option>
                    </select>
                </div>

                {/* Entrada */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Você tem dinheiro para entrada? *
                    </label>
                    <select
                        name="tem_entrada"
                        value={formData.tem_entrada}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="sim">Sim, tenho entrada</option>
                        <option value="nao">Não tenho entrada</option>
                    </select>
                </div>

                {/* Valor da Entrada - Condicional */}
                {formData.tem_entrada === 'sim' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quanto você tem de entrada?
                        </label>
                        <select
                            name="valor_entrada"
                            value={formData.valor_entrada}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Selecione</option>
                            <option value="1000">Até R$ 1.000</option>
                            <option value="3000">R$ 1.001 a R$ 3.000</option>
                            <option value="5000">R$ 3.001 a R$ 5.000</option>
                            <option value="10000">R$ 5.001 a R$ 10.000</option>
                            <option value="15000">Acima de R$ 10.000</option>
                        </select>
                    </div>
                )}

                {/* Urgência */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quando você quer seu carro? *
                    </label>
                    <select
                        name="urgencia_compra"
                        value={formData.urgencia_compra}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione</option>
                        <option value="imediato">🚀 Agora mesmo!</option>
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
                        '🎉 Quero simular agora!'
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    📱 Você será redirecionado para nosso WhatsApp com suas informações preenchidas
                </p>
            </form>
        </div>
    )
} 