'use client'

import { useState } from 'react'
import { Veiculo } from '@/types/database'
import { useUTMTracking, calculateLeadCost, generateLeadSourceReport } from '@/lib/utm-tracker'

interface FormularioInteresseProps {
    veiculo: Veiculo
}

export function FormularioInteresse({ veiculo }: FormularioInteresseProps) {
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        email: '',
        mensagem: '',
        forma_pagamento: '',
        prazo_compra: ''
    })

    const [enviando, setEnviando] = useState(false)
    const [sucesso, setSucesso] = useState(false)

    // Capturar dados UTM automaticamente
    const { utmData } = useUTMTracking()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setEnviando(true)

        try {
            // 1. Calcular custo estimado do lead
            const custoEstimado = calculateLeadCost(utmData)
            const relatorioOrigem = generateLeadSourceReport(utmData)

            // 2. Salvar lead na API com dados UTM
            const payload = {
                nome: formData.nome,
                telefone: formData.telefone,
                email: formData.email || undefined,
                mensagem: formData.mensagem || `${formData.mensagem ? formData.mensagem + ' | ' : ''}Origem: ${relatorioOrigem}`,
                veiculo_interesse_id: veiculo.id,
                origem: utmData.utm_source || 'formulario_veiculo',
                forma_pagamento: formData.forma_pagamento || undefined,
                prazo_compra: formData.prazo_compra || 'imediato',
                // Dados UTM para tracking
                utm_source: utmData.utm_source,
                utm_medium: utmData.utm_medium,
                utm_campaign: utmData.utm_campaign,
                utm_content: utmData.utm_content,
                utm_term: utmData.utm_term,
                custo_lead: custoEstimado?.toString()
            }

            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error || 'Erro ao processar interesse')
            }

            // 2. Abrir WhatsApp com os dados preenchidos
            const mensagemWhatsApp = `
Olá! Tenho interesse no veículo:

🚗 ${veiculo.ano} ${veiculo.marca} ${veiculo.modelo}
${veiculo.versao !== 'PADRÃO' ? `Versão: ${veiculo.versao}` : ''}
💰 Preço: ${Number(veiculo.preco) > 0 ? `R$ ${Number(veiculo.preco).toLocaleString('pt-BR')}` : 'Consultar'}

👤 Nome: ${formData.nome}
📱 Telefone: ${formData.telefone}
📧 Email: ${formData.email}

${formData.mensagem ? `💬 Mensagem: ${formData.mensagem}` : ''}

Aguardo contato. Obrigado!
`.trim()

            const whatsappUrl = `https://wa.me/5511940763330?text=${encodeURIComponent(mensagemWhatsApp)}`
            window.open(whatsappUrl, '_blank')

            setSucesso(true)
            setFormData({
                nome: '',
                telefone: '',
                email: '',
                mensagem: '',
                forma_pagamento: '',
                prazo_compra: ''
            })

        } catch (error) {
            console.error('Erro ao enviar:', error)
            alert('Erro ao enviar interesse. Tente novamente ou entre em contato diretamente via WhatsApp.')
        } finally {
            setEnviando(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    if (sucesso) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-green-600 text-lg font-semibold mb-2">
                    ✅ Interesse enviado com sucesso!
                </div>
                <p className="text-green-700 mb-4">
                    Redirecionamos você para o WhatsApp da Robust Car. Eles entrarão em contato em breve.
                </p>
                <button
                    onClick={() => setSucesso(false)}
                    className="text-green-600 hover:text-green-800 font-medium"
                >
                    Enviar outro interesse
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
                Tenho Interesse
            </h3>

            <p className="text-gray-600 mb-6">
                Preencha seus dados e entraremos em contato para agendar uma visita ou test-drive.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome completo *
                    </label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Seu nome completo"
                    />
                </div>

                {/* Telefone */}
                <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone/WhatsApp *
                    </label>
                    <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        required
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(11) 99999-9999"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="seu@email.com"
                    />
                </div>

                {/* Forma de Pagamento */}
                <div>
                    <label htmlFor="forma_pagamento" className="block text-sm font-medium text-gray-700 mb-1">
                        Como pretende pagar?
                    </label>
                    <select
                        id="forma_pagamento"
                        name="forma_pagamento"
                        value={formData.forma_pagamento}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="avista">À vista</option>
                        <option value="financiado">Financiado</option>
                        <option value="consorcio">Consórcio</option>
                    </select>
                </div>

                {/* Prazo de Compra */}
                <div>
                    <label htmlFor="prazo_compra" className="block text-sm font-medium text-gray-700 mb-1">
                        Quando pretende comprar?
                    </label>
                    <select
                        id="prazo_compra"
                        name="prazo_compra"
                        value={formData.prazo_compra}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="imediato">Imediatamente</option>
                        <option value="30_dias">Em até 30 dias</option>
                        <option value="60_dias">Em até 60 dias</option>
                        <option value="90_dias">Em até 90 dias</option>
                    </select>
                </div>

                {/* Mensagem */}
                <div>
                    <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                        Mensagem (opcional)
                    </label>
                    <textarea
                        id="mensagem"
                        name="mensagem"
                        rows={3}
                        value={formData.mensagem}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Gostaria de agendar test-drive, tenho um carro para trocar, etc..."
                    />
                </div>

                {/* Resumo do veículo */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-900 mb-2">Veículo de interesse:</h4>
                    <p className="text-gray-700">
                        <strong>{veiculo.ano} {veiculo.marca} {veiculo.modelo}</strong>
                        {veiculo.versao !== 'PADRÃO' && (
                            <span className="text-gray-600"> • {veiculo.versao}</span>
                        )}
                    </p>
                    {Number(veiculo.preco) > 0 && (
                        <p className="text-green-600 font-semibold mt-1">
                            R$ {Number(veiculo.preco).toLocaleString('pt-BR')}
                        </p>
                    )}
                </div>

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={enviando || !formData.nome || !formData.telefone}
                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {enviando ? (
                            <>
                                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                Enviando...
                            </>
                        ) : (
                            '📱 Enviar via WhatsApp'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            const telefone = '5511940763330'
                            const mensagem = `Olá! Tenho interesse no ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}. Gostaria de saber mais informações.`
                            const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`
                            window.open(whatsappUrl, '_blank')
                        }}
                        className="sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                        💬 WhatsApp Direto
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                    Ao enviar, você será redirecionado para o WhatsApp da Robust Car
                </p>
            </form>
        </div>
    )
} 