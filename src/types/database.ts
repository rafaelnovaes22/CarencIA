// Types para o banco de dados CarencIA com Prisma
import type {
    Campanha as PrismaCampanha,
    Veiculo as PrismaVeiculo,
    Lead as PrismaLead,
    Interacao as PrismaInteracao,
    Simulacao as PrismaSimulacao,
    Agendamento as PrismaAgendamento,
    Evento as PrismaEvento,
    Configuracao as PrismaConfiguracao
} from '@prisma/client'

// Re-export tipos do Prisma com aliases
export type Campanha = PrismaCampanha
export type Veiculo = PrismaVeiculo
export type Lead = PrismaLead
export type Interacao = PrismaInteracao
export type Simulacao = PrismaSimulacao
export type Agendamento = PrismaAgendamento
export type Evento = PrismaEvento
export type Configuracao = PrismaConfiguracao

// Types para formulários e DTOs
export interface LeadFormData {
    nome: string;
    email: string;
    telefone: string;
    marca_interesse?: string;
    modelo_interesse?: string;
    faixa_preco_min?: number;
    faixa_preco_max?: number;
    forma_pagamento?: 'avista' | 'financiado' | 'consorcio';
    tem_veiculo_troca?: boolean;
    veiculo_troca_marca?: string;
    veiculo_troca_modelo?: string;
    veiculo_troca_ano?: number;
    prazo_compra?: 'imediato' | '30_dias' | '60_dias' | '90_dias';
    observacoes?: string;
}

export interface VeiculoFilter {
    marca?: string;
    modelo?: string;
    ano_min?: number;
    ano_max?: number;
    preco_min?: number;
    preco_max?: number;
    combustivel?: string;
    cambio?: string;
    disponivel?: boolean;
}

export interface SimulacaoFinanciamento {
    valor_veiculo: number;
    valor_entrada: number;
    prazo_meses: number;
    taxa_juros: number;
}

export interface LeadStats {
    total_leads: number;
    leads_mes: number;
    leads_hoje: number;
    conversao_percent?: number;
    leads_por_status?: Record<string, number>;
    leads_por_origem?: Record<string, number>;
}

export interface VeiculoStats {
    total_veiculos: number;
    veiculos_disponiveis: number;
    veiculos_destaque: number;
    ticket_medio?: number;
    veiculos_por_marca?: Record<string, number>;
}

// Types para relacionamentos usando Prisma includes
export interface LeadComRelacoes extends Lead {
    veiculo_interesse?: Veiculo | null;
    campanha?: Campanha | null;
    interacoes?: Interacao[];
    simulacoes?: Simulacao[];
    agendamentos?: Agendamento[];
    eventos?: Evento[];
}

export interface VeiculoComRelacoes extends Veiculo {
    leads_interessados?: Lead[];
    simulacoes?: Simulacao[];
    agendamentos?: Agendamento[];
    eventos?: Evento[];
    total_interesse?: number;
}

export interface CampanhaComRelacoes extends Campanha {
    leads?: Lead[];
    total_leads?: number;
}

// Types para API responses
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    total?: number;
    page?: number;
    per_page?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

// Types para queries
export interface LeadQuery {
    page?: number;
    per_page?: number;
    status?: string;
    origem?: string;
    campanha_id?: string;
    data_inicio?: Date;
    data_fim?: Date;
    search?: string;
    temperatura?: string;
    score_min?: number;
    score_max?: number;
}

export interface VeiculoQuery {
    page?: number;
    per_page?: number;
    marca?: string;
    modelo?: string;
    ano_min?: number;
    ano_max?: number;
    preco_min?: number;
    preco_max?: number;
    combustivel?: string;
    cambio?: string;
    disponivel?: boolean;
    destaque?: boolean;
    search?: string;
}

export interface InteracaoQuery {
    page?: number;
    per_page?: number;
    lead_id?: string;
    tipo?: string;
    status?: string;
    data_inicio?: Date;
    data_fim?: Date;
}

export interface EventoQuery {
    page?: number;
    per_page?: number;
    lead_id?: string;
    veiculo_id?: string;
    evento?: string;
    data_inicio?: Date;
    data_fim?: Date;
}

// Enums para melhor type safety
export enum StatusLead {
    NOVO = 'novo',
    CONTACTADO = 'contactado',
    QUALIFICADO = 'qualificado',
    NEGOCIANDO = 'negociando',
    VENDIDO = 'vendido',
    PERDIDO = 'perdido'
}

export enum TemperaturaLead {
    FRIO = 'frio',
    MORNO = 'morno',
    QUENTE = 'quente'
}

export enum TipoInteracao {
    EMAIL = 'email',
    WHATSAPP = 'whatsapp',
    TELEFONE = 'telefone',
    PRESENCIAL = 'presencial',
    SISTEMA = 'sistema'
}

export enum StatusInteracao {
    ENVIADO = 'enviado',
    ENTREGUE = 'entregue',
    LIDO = 'lido',
    RESPONDIDO = 'respondido'
}

export enum TipoAgendamento {
    TEST_DRIVE = 'test_drive',
    VISITA = 'visita',
    AVALIACAO = 'avaliacao'
}

export enum StatusAgendamento {
    AGENDADO = 'agendado',
    CONFIRMADO = 'confirmado',
    REALIZADO = 'realizado',
    CANCELADO = 'cancelado'
}

export enum FormaPagamento {
    AVISTA = 'avista',
    FINANCIADO = 'financiado',
    CONSORCIO = 'consorcio'
}

export enum PrazoCompra {
    IMEDIATO = 'imediato',
    TRINTA_DIAS = '30_dias',
    SESSENTA_DIAS = '60_dias',
    NOVENTA_DIAS = '90_dias'
}

export enum TipoCombustivel {
    FLEX = 'flex',
    GASOLINA = 'gasolina',
    ETANOL = 'etanol',
    DIESEL = 'diesel',
    HIBRIDO = 'hibrido',
    ELETRICO = 'eletrico'
}

export enum TipoCambio {
    MANUAL = 'manual',
    AUTOMATICO = 'automatico',
    CVT = 'cvt',
    AUTOMATIZADO = 'automatizado'
}

// Types para eventos específicos
export interface EventoPageView {
    evento: 'page_view';
    pagina: string;
    parametros?: {
        referrer?: string;
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
    };
}

export interface EventoFormStart {
    evento: 'form_start';
    pagina: string;
    parametros?: {
        form_id: string;
        step?: number;
    };
}

export interface EventoFormSubmit {
    evento: 'form_submit';
    pagina: string;
    parametros?: {
        form_id: string;
        lead_id?: string;
        success: boolean;
    };
}

export interface EventoCtaClick {
    evento: 'cta_click';
    pagina: string;
    parametros?: {
        cta_text: string;
        veiculo_id?: string;
        position?: string;
    };
}

export interface EventoWhatsappClick {
    evento: 'whatsapp_click';
    pagina: string;
    parametros?: {
        veiculo_id?: string;
        message_template?: string;
    };
}

export type EventoData =
    | EventoPageView
    | EventoFormStart
    | EventoFormSubmit
    | EventoCtaClick
    | EventoWhatsappClick

// Types para configurações específicas
export interface ConfiguracaoEmpresa {
    nome: string;
    telefone: string;
    whatsapp: string;
    email: string;
    endereco: string;
    horario_funcionamento: string;
    latitude?: string;
    longitude?: string;
}

export interface ConfiguracaoSeo {
    titulo: string;
    descricao: string;
    keywords: string;
}

export interface ConfiguracaoAnalytics {
    google_analytics_id?: string;
    facebook_pixel_id?: string;
    hotjar_id?: string;
}

export interface ConfiguracaoEmail {
    provedor: 'resend' | 'sendgrid' | 'mailgun';
    api_key: string;
    from_email: string;
    templates: {
        welcome: string;
        follow_up: string;
        newsletter: string;
    };
}

// Types para dashboard/relatórios
export interface DashboardData {
    leads_stats: LeadStats;
    veiculos_stats: VeiculoStats;
    leads_recentes: Lead[];
    veiculos_destaque: Veiculo[];
    interacoes_recentes: Interacao[];
    conversao_mensal: Array<{
        mes: string;
        leads: number;
        vendas: number;
        conversao: number;
    }>;
}

export interface RelatorioVendas {
    periodo: {
        inicio: Date;
        fim: Date;
    };
    total_leads: number;
    total_vendas: number;
    ticket_medio: number;
    taxa_conversao: number;
    vendas_por_mes: Array<{
        mes: string;
        vendas: number;
        valor: number;
    }>;
    vendas_por_origem: Record<string, number>;
    vendas_por_veiculo: Array<{
        marca: string;
        modelo: string;
        vendas: number;
    }>;
}

// Type guards
export function isLeadComRelacoes(lead: Lead | LeadComRelacoes): lead is LeadComRelacoes {
    return 'veiculo_interesse' in lead || 'campanha' in lead || 'interacoes' in lead;
}

export function isVeiculoComRelacoes(veiculo: Veiculo | VeiculoComRelacoes): veiculo is VeiculoComRelacoes {
    return 'leads_interessados' in veiculo || 'simulacoes' in veiculo;
}

// Utility types
export type CreateLeadData = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'score'>;
export type UpdateLeadData = Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>;
export type CreateVeiculoData = Omit<Veiculo, 'id' | 'created_at' | 'updated_at'>;
export type UpdateVeiculoData = Partial<Omit<Veiculo, 'id' | 'created_at' | 'updated_at'>>;

// Constants
export const LEAD_STATUS_OPTIONS = [
    { value: StatusLead.NOVO, label: 'Novo', color: 'blue' },
    { value: StatusLead.CONTACTADO, label: 'Contactado', color: 'yellow' },
    { value: StatusLead.QUALIFICADO, label: 'Qualificado', color: 'orange' },
    { value: StatusLead.NEGOCIANDO, label: 'Negociando', color: 'purple' },
    { value: StatusLead.VENDIDO, label: 'Vendido', color: 'green' },
    { value: StatusLead.PERDIDO, label: 'Perdido', color: 'red' }
];

export const TEMPERATURA_OPTIONS = [
    { value: TemperaturaLead.FRIO, label: 'Frio', color: 'blue' },
    { value: TemperaturaLead.MORNO, label: 'Morno', color: 'yellow' },
    { value: TemperaturaLead.QUENTE, label: 'Quente', color: 'red' }
];

export const COMBUSTIVEL_OPTIONS = [
    { value: TipoCombustivel.FLEX, label: 'Flex' },
    { value: TipoCombustivel.GASOLINA, label: 'Gasolina' },
    { value: TipoCombustivel.ETANOL, label: 'Etanol' },
    { value: TipoCombustivel.DIESEL, label: 'Diesel' },
    { value: TipoCombustivel.HIBRIDO, label: 'Híbrido' },
    { value: TipoCombustivel.ELETRICO, label: 'Elétrico' }
];

export const CAMBIO_OPTIONS = [
    { value: TipoCambio.MANUAL, label: 'Manual' },
    { value: TipoCambio.AUTOMATICO, label: 'Automático' },
    { value: TipoCambio.CVT, label: 'CVT' },
    { value: TipoCambio.AUTOMATIZADO, label: 'Automatizado' }
]; 