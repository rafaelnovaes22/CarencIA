-- CarencIA Database Schema
-- Sistema de Captação de Leads para Robust Car

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de Campanhas/Origens
CREATE TABLE campanhas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Veículos
CREATE TABLE veiculos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(200) NOT NULL,
    versao VARCHAR(200),
    ano INTEGER NOT NULL,
    combustivel VARCHAR(50) NOT NULL,
    cambio VARCHAR(50),
    cor VARCHAR(100),
    km INTEGER DEFAULT 0,
    preco DECIMAL(12,2) NOT NULL,
    preco_promocional DECIMAL(12,2),
    fotos TEXT[], -- Array de URLs das fotos
    descricao TEXT,
    opcionais TEXT[], -- Array de opcionais
    placa VARCHAR(20),
    chassi VARCHAR(50),
    renavam VARCHAR(50),
    disponivel BOOLEAN DEFAULT true,
    destaque BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    cpf VARCHAR(14),
    data_nascimento DATE,
    profissao VARCHAR(200),
    renda_mensal DECIMAL(12,2),
    
    -- Interesse em veículos
    veiculo_interesse_id UUID REFERENCES veiculos(id),
    marca_interesse VARCHAR(100),
    modelo_interesse VARCHAR(200),
    faixa_preco_min DECIMAL(12,2),
    faixa_preco_max DECIMAL(12,2),
    ano_preferencia_min INTEGER,
    ano_preferencia_max INTEGER,
    combustivel_preferencia VARCHAR(50),
    
    -- Condições de compra
    forma_pagamento VARCHAR(50), -- 'avista', 'financiado', 'consorcio'
    tem_veiculo_troca BOOLEAN DEFAULT false,
    veiculo_troca_marca VARCHAR(100),
    veiculo_troca_modelo VARCHAR(200),
    veiculo_troca_ano INTEGER,
    prazo_compra VARCHAR(50), -- 'imediato', '30_dias', '60_dias', '90_dias'
    
    -- Origem e tracking
    campanha_id UUID REFERENCES campanhas(id),
    origem VARCHAR(100) DEFAULT 'website',
    ip_address INET,
    user_agent TEXT,
    
    -- Status do lead
    status VARCHAR(50) DEFAULT 'novo', -- 'novo', 'contactado', 'qualificado', 'negociando', 'vendido', 'perdido'
    temperatura VARCHAR(20) DEFAULT 'frio', -- 'frio', 'morno', 'quente'
    score INTEGER DEFAULT 0,
    
    -- Dados administrativos
    vendedor_responsavel VARCHAR(255),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Interações
CREATE TABLE interacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'email', 'whatsapp', 'telefone', 'presencial', 'sistema'
    canal VARCHAR(50), -- 'automatico', 'manual', 'bot'
    assunto VARCHAR(255),
    mensagem TEXT,
    anexos TEXT[], -- Array de URLs de arquivos
    enviado_por VARCHAR(255),
    status VARCHAR(50) DEFAULT 'enviado', -- 'enviado', 'entregue', 'lido', 'respondido'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Simulações de Financiamento
CREATE TABLE simulacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    veiculo_id UUID REFERENCES veiculos(id),
    valor_veiculo DECIMAL(12,2) NOT NULL,
    valor_entrada DECIMAL(12,2) NOT NULL,
    valor_financiado DECIMAL(12,2) NOT NULL,
    prazo_meses INTEGER NOT NULL,
    taxa_juros DECIMAL(5,2) NOT NULL,
    valor_parcela DECIMAL(12,2) NOT NULL,
    valor_total DECIMAL(12,2) NOT NULL,
    banco VARCHAR(100),
    aprovado BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Agendamentos
CREATE TABLE agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    veiculo_id UUID REFERENCES veiculos(id),
    tipo VARCHAR(50) NOT NULL, -- 'test_drive', 'visita', 'avaliacao'
    data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'agendado', -- 'agendado', 'confirmado', 'realizado', 'cancelado'
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Eventos de Tracking
CREATE TABLE eventos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    veiculo_id UUID REFERENCES veiculos(id),
    evento VARCHAR(100) NOT NULL, -- 'page_view', 'form_start', 'form_submit', 'cta_click', 'whatsapp_click'
    pagina VARCHAR(255),
    parametros JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Configurações do Sistema
CREATE TABLE configuracoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chave VARCHAR(255) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimização
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_telefone ON leads(telefone);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_campanha ON leads(campanha_id);
CREATE INDEX idx_veiculos_marca_modelo ON veiculos(marca, modelo);
CREATE INDEX idx_veiculos_preco ON veiculos(preco);
CREATE INDEX idx_veiculos_disponivel ON veiculos(disponivel);
CREATE INDEX idx_interacoes_lead ON interacoes(lead_id);
CREATE INDEX idx_interacoes_tipo ON interacoes(tipo);
CREATE INDEX idx_eventos_lead ON eventos(lead_id);
CREATE INDEX idx_eventos_evento ON eventos(evento);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_veiculos_updated_at BEFORE UPDATE ON veiculos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campanhas_updated_at BEFORE UPDATE ON campanhas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON agendamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir configurações iniciais
INSERT INTO configuracoes (chave, valor, descricao) VALUES
('empresa_nome', 'Robust Car', 'Nome da empresa'),
('empresa_telefone', '(11) 2667-6852', 'Telefone principal'),
('empresa_whatsapp', '(11) 94076-3330', 'WhatsApp'),
('empresa_endereco', 'Av. Marechal Tito, 3240, Jardim Silva Teles - São Paulo/SP', 'Endereço completo'),
('horario_funcionamento', 'Seg-Sex: 9h-19h, Sáb: 9h-18h', 'Horário de funcionamento'),
('email_automatico_ativo', 'true', 'Ativar envio automático de emails'),
('taxa_juros_padrao', '1.99', 'Taxa de juros padrão para simulações'),
('entrada_minima_percent', '20', 'Percentual mínimo de entrada');

-- Inserir campanha padrão
INSERT INTO campanhas (nome, descricao, utm_source) VALUES
('Website Orgânico', 'Leads vindos do site principal', 'website'); 