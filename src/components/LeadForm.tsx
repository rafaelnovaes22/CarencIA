"use client";

import { useState } from "react";
import { useUTMTracking, calculateLeadCost } from "@/lib/utm-tracker";

export function LeadForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Capturar dados UTM automaticamente
    const { utmData } = useUTMTracking();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            // Calcular custo estimado do lead
            const custoEstimado = calculateLeadCost(utmData);

            const payload = {
                nome: "Lead Interesse",
                email,
                telefone: "",
                origem: utmData.utm_source || "website",
                // Incluir dados UTM
                utm_source: utmData.utm_source,
                utm_medium: utmData.utm_medium,
                utm_campaign: utmData.utm_campaign,
                utm_content: utmData.utm_content,
                utm_term: utmData.utm_term,
                custo_lead: custoEstimado?.toString(),
                mensagem: `Lead capturado via formulário de newsletter. Referrer: ${utmData.referrer || 'direto'}`
            };

            const res = await fetch("/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessage(data.message);
            setEmail("");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                        Seja o primeiro a saber
                    </h2>
                    <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Deixe seu email e avisaremos quando a plataforma for lançada.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                    <form className="flex space-x-2" onSubmit={handleSubmit}>
                        <input
                            className="max-w-lg flex-1 bg-gray-100 border-gray-300 rounded-md px-4"
                            placeholder="Seu melhor email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <button
                            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-4 text-sm font-medium text-gray-50 shadow disabled:opacity-50"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Enviando..." : "Quero ser notificado"}
                        </button>
                    </form>
                    {message && <p className="text-sm text-green-600">{message}</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
            </div>
        </section>
    );
} 