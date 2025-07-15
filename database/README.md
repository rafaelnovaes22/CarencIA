# 🗄️ Estrutura do Banco de Dados CarencIA

## Visão Geral

O sistema CarencIA utiliza PostgreSQL como banco de dados principal, com integração Supabase para facilitar o desenvolvimento e deployment.

## 📋 Tabelas Principais

### 1. `leads`
Tabela principal para armazenar informações dos potenciais clientes.

**Campos principais:**
- Dados pessoais: `nome`, `email`, `telefone`, `cpf`
- Interesses: `marca_interesse`, `modelo_interesse`, `faixa_preco_min/max`
- Condições de compra: `forma_pagamento`, `prazo_compra`, `tem_veiculo_troca`
- Status: `status`, `temperatura`, `score`
- Tracking: `origem`, `campanha_id`, `ip_address`

### 2. `veiculos`
Catálogo de veículos disponíveis para venda.

**Campos principais:**
- Dados do veículo: `marca`, `modelo`, `versao`, `ano`, `combustivel`
- Especificações: `cambio`, `cor`, `km`, `preco`, `preco_promocional`
- Mídia: `fotos[]`, `descricao`, `opcionais[]`
- Status: `disponivel`, `destaque`

### 3. `interacoes`
Histórico de todas as comunicações com leads.

**Campos principais:**
- Relacionamento: `lead_id`
- Tipo: `tipo` (email, whatsapp, telefone, presencial, sistema)
- Conteúdo: `assunto`, `mensagem`, `anexos[]`
- Status: `status` (enviado, entregue, lido, respondido)

### 4. `simulacoes`
Simulações de financiamento realizadas.

**Campos principais:**
- Relacionamentos: `lead_id`, `veiculo_id`
- Valores: `valor_veiculo`, `valor_entrada`, `valor_financiado`
- Condições: `prazo_meses`, `taxa_juros`, `valor_parcela`

### 5. `agendamentos`
Agendamentos de test drive, visitas e avaliações.

**Campos principais:**
- Relacionamentos: `lead_id`, `veiculo_id`
- Agendamento: `tipo`, `data_agendamento`, `status`
- Observações: `observacoes`

### 6. `eventos`
Eventos de tracking e analytics.

**Campos principais:**
- Relacionamentos: `lead_id`, `veiculo_id` (opcionais)
- Evento: `evento`, `pagina`, `parametros`
- Tracking: `ip_address`, `user_agent`

### 7. `campanhas`
Campanhas de marketing para tracking de origem.

**Campos principais:**
- Identificação: `nome`, `descricao`
- UTM: `utm_source`, `utm_medium`, `utm_campaign`
- Status: `ativo`

### 8. `configuracoes`
Configurações gerais do sistema.

**Campos principais:**
- Configuração: `chave`, `valor`, `tipo`
- Metadados: `descricao`

## 🔧 Configuração

### Variáveis de Ambiente Necessárias

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@carencia.com.br

# WhatsApp Configuration
WHATSAPP_NUMBER=5511940763330

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=your_facebook_pixel_id

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Instalação do Banco

1. **Criar projeto no Supabase:**
   - Acesse [supabase.com](https://supabase.com)
   - Crie um novo projeto
   - Anote as credenciais (URL, anon key, service role key)

2. **Executar schema:**
   ```bash
   # No painel do Supabase, vá em SQL Editor
   # Cole o conteúdo do arquivo database/schema.sql
   # Execute o script
   ```

3. **Inserir dados iniciais:**
   ```bash
   # No SQL Editor do Supabase
   # Cole o conteúdo do arquivo database/seed.sql
   # Execute o script
   ```

## 📊 Índices e Performance

### Índices Criados

- `idx_leads_email` - Busca por email
- `idx_leads_telefone` - Busca por telefone
- `idx_leads_status` - Filtro por status
- `idx_leads_created_at` - Ordenação por data
- `idx_veiculos_marca_modelo` - Busca por marca/modelo
- `idx_veiculos_preco` - Filtro por preço
- `idx_interacoes_lead` - Histórico por lead
- `idx_eventos_lead` - Eventos por lead

### Otimizações

- Triggers automáticos para `updated_at`
- Uso de UUIDs para chaves primárias
- Arrays para campos multi-valor (fotos, opcionais)
- JSONB para dados flexíveis (parâmetros de eventos)

## 🔐 Segurança

### Row Level Security (RLS)

Configure políticas RLS no Supabase para:
- Leads: acesso apenas a dados do próprio usuário
- Veículos: leitura pública, escrita restrita
- Interações: acesso apenas ao lead relacionado

### Exemplo de Política RLS

```sql
-- Política para leads
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

-- Política para veículos (leitura pública)
CREATE POLICY "Public can view available vehicles" ON veiculos
  FOR SELECT USING (disponivel = true);
```

## 🚀 Migrations

### Estrutura de Migrations

```
database/
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_add_lead_scoring.sql
│   ├── 003_add_campaign_tracking.sql
│   └── ...
└── seeds/
    ├── 001_configuracoes.sql
    ├── 002_veiculos_robust_car.sql
    └── ...
```

### Executar Migrations

```bash
# Usando Supabase CLI
supabase db push

# Ou manualmente no SQL Editor
```

## 📈 Analytics e Reporting

### Queries Úteis

```sql
-- Leads por dia
SELECT DATE(created_at) as data, COUNT(*) as total
FROM leads
GROUP BY DATE(created_at)
ORDER BY data DESC;

-- Veículos mais procurados
SELECT marca, modelo, COUNT(*) as interesse
FROM leads
WHERE marca_interesse IS NOT NULL
GROUP BY marca, modelo
ORDER BY interesse DESC;

-- Taxa de conversão por campanha
SELECT 
  c.nome,
  COUNT(l.id) as total_leads,
  COUNT(CASE WHEN l.status = 'vendido' THEN 1 END) as vendidos,
  ROUND(COUNT(CASE WHEN l.status = 'vendido' THEN 1 END) * 100.0 / COUNT(l.id), 2) as taxa_conversao
FROM campanhas c
LEFT JOIN leads l ON c.id = l.campanha_id
GROUP BY c.id, c.nome
ORDER BY taxa_conversao DESC;
```

## 🔄 Backup e Restore

### Backup Automático

O Supabase oferece backups automáticos diários. Para backups adicionais:

```bash
# Usando pg_dump
pg_dump -h your-db-host -U your-user -d your-db > backup.sql

# Restore
psql -h your-db-host -U your-user -d your-db < backup.sql
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão:**
   - Verifique as variáveis de ambiente
   - Confirme as credenciais do Supabase

2. **Problemas de performance:**
   - Verifique se os índices estão criados
   - Analise queries com `EXPLAIN ANALYZE`

3. **Erros de permissão:**
   - Revise as políticas RLS
   - Verifique se o service role key está correto

### Debug Mode

```typescript
// Habilitar logs SQL
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('status', 'novo')
  .explain({ analyze: true, verbose: true })
```

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization) 