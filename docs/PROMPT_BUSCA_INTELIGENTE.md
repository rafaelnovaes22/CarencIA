# 🤖 Prompt de Busca Inteligente - Documentação Técnica

## 📋 Visão Geral

Este documento detalha o prompt estruturado desenvolvido para a API de busca inteligente, que utiliza OpenAI GPT-3.5 Turbo para interpretar necessidades de clientes em linguagem natural e convertê-las em filtros estruturados para busca de veículos.

## 🎯 Objetivos do Prompt

- **Interpretar linguagem natural** de clientes brasileiros
- **Extrair filtros estruturados** para busca no banco de dados
- **Contextualizar para o mercado brasileiro** de veículos
- **Fornecer score de confiança** da interpretação
- **Mapear sinônimos e variações** regionais

## 🧠 Processo de Análise - 8 Passos

### PASSO 1: Identificar Perfil do Usuário
```
👨‍👩‍👧‍👦 Família com filhos → "familiar", "espaçoso", "seguro"
💼 Profissional autônomo → "trabalho", "econômico", "confiável" 
👦 Jovem → "esportivo", "moderno", "tecnologia"
🚗 Primeira compra → "básico", "econômico", "simples"
💎 Luxo/status → "luxo", "premium", "diferenciado"
```

### PASSO 2: Detectar Sinônimos e Variações
```
Marcas: VW = Volkswagen, GM/Chevy = Chevrolet, etc.
Modelos: Civic = CIVIC, Golf = GOLF, etc.
Categorias: SUV = utilitário esportivo, crossover, 4x4
```

### PASSO 3: Interpretar Expressões Temporais
```
"novo", "zero km" → ano atual (2024/2025)
"2020 em diante" → anoMin: 2020
"até 2018" → anoMax: 2018
"entre 2018 e 2022" → anoMin: 2018, anoMax: 2022
```

### PASSO 4: Decodificar Valores Financeiros
```
"até 30 mil" → precoMax: 30000
"acima de 50k" → precoMin: 50000
"barato", "em conta" → precoMax: 40000
"premium", "caro" → precoMin: 80000
```

### PASSO 5: Identificar Características Técnicas
```
Combustível:
- "econômico", "gasta pouco" → FLEX
- "potente", "performance" → GASOLINA
- "diesel" → DIESEL
- "híbrido" → HIBRIDO

Câmbio:
- "automático", "sem embreagem" → AUTOMATICO, CVT
- "manual", "com embreagem" → MANUAL
```

### PASSO 6: Contextualizar para Uso Brasileiro
```
"para cidade" → hatch, econômico, compacto
"para estrada" → sedan, mais potente
"para família" → SUV, wagon, espaçoso
"uber/app" → sedan, econômico, 4 portas
```

### PASSO 7: Analisar Contexto Emocional
```
"sonho", "sempre quis" → marca/modelo específico
"necessidade", "preciso" → funcionalidade prioritária
"urgente" → disponibilidade imediata
"investimento" → foco em valor de revenda
```

### PASSO 8: Considerar Padrões Regionais Brasileiros
```
- Automático é premium no Brasil → maior preço esperado
- FLEX é padrão → economia prioritária
- SUV = status + família
- Sedan = Uber/executivo
- Hatch = juventude/economia
```

## 📊 Estrutura de Resposta JSON

```json
{
  "marcas": ["array de marcas em MAIÚSCULO"],
  "modelos": ["array de modelos em MAIÚSCULO"],
  "anoMin": "número ou null",
  "anoMax": "número ou null",
  "precoMin": "número ou null",
  "precoMax": "número ou null",
  "combustivel": ["FLEX", "GASOLINA", "DIESEL", "HIBRIDO", "ELETRICO"],
  "cambio": ["MANUAL", "AUTOMATICO", "CVT"],
  "cores": ["cores em MAIÚSCULO se mencionadas"],
  "categorias": ["SUV", "SEDAN", "HATCH", "PICKUP", "WAGON"],
  "caracteristicas": ["economico", "familiar", "esportivo", "luxo", "trabalho", "primeiro_carro", "cidade", "estrada"],
  "confianca": "número de 0 a 100 (baseado na especificidade da busca)"
}
```

## 🎯 Exemplos Práticos

### Exemplo 1: Busca Familiar
**Entrada:** "Preciso de um carro para a família, espaçoso e seguro, até 80 mil"

**Análise Passo a Passo:**
- Perfil: Família com filhos
- Características: espaçoso = SUV/WAGON, seguro = familiar
- Limite financeiro: até 80k = precoMax: 80000
- Confiança: Alta (especificou uso, características e orçamento)

**Saída:**
```json
{
  "categorias": ["SUV", "WAGON"],
  "caracteristicas": ["familiar"],
  "precoMax": 80000,
  "confianca": 90
}
```

### Exemplo 2: Busca Específica
**Entrada:** "Honda Civic 2020 automático prata"

**Análise Passo a Passo:**
- Marca específica: Honda
- Modelo específico: Civic
- Ano específico: 2020 em diante
- Câmbio específico: automático (inclui CVT)
- Cor específica: prata
- Confiança: Muito alta (todos detalhes específicos)

**Saída:**
```json
{
  "marcas": ["HONDA"],
  "modelos": ["CIVIC"],
  "anoMin": 2020,
  "cambio": ["AUTOMATICO", "CVT"],
  "cores": ["PRATA"],
  "confianca": 95
}
```

### Exemplo 3: Busca para Trabalho
**Entrada:** "Carro econômico para trabalhar de Uber"

**Análise Passo a Passo:**
- Uso específico: trabalho + Uber
- Uber requer: sedan (4 portas), confortável, econômico
- Econômico = FLEX, baixo consumo, preço acessível
- Confiança: Boa (uso claro, mas sem especificações técnicas)

**Saída:**
```json
{
  "combustivel": ["FLEX"],
  "categorias": ["SEDAN"],
  "caracteristicas": ["trabalho", "economico"],
  "precoMax": 60000,
  "confianca": 85
}
```

## 📈 Sistema de Confiança

| Score | Nível | Descrição |
|-------|-------|-----------|
| 90-100% | Muito Alta | Busca com múltiplos critérios específicos |
| 80-89% | Alta | Busca com critérios bem definidos |
| 70-79% | Boa | Busca com alguns critérios específicos |
| 50-69% | Média | Busca com critérios moderados |
| 0-49% | Baixa | Busca genérica ou ambígua |

## 🇧🇷 Contextualizações Brasileiras

### Marcas e Modelos Populares
- **Honda:** Civic, City, HR-V, WR-V, Fit
- **Toyota:** Corolla, Etios, Yaris, RAV4
- **Volkswagen:** Golf, Polo, T-Cross, Virtus, Jetta
- **Chevrolet:** Onix, Prisma, Cruze, Tracker, S10
- **Hyundai:** HB20, Creta, Tucson, Elantra
- **Nissan:** Kicks, Versa, Sentra, X-Trail

### Perfis de Uso Típicos
- **Família:** SUV/WAGON, segurança, espaço, FLEX
- **Jovem:** Hatch, design, tecnologia, preço acessível
- **Executivo:** Sedan, automático, luxo, imagem
- **Autônomo:** Econômico, FLEX, baixa manutenção
- **Uber/App:** Sedan, 4 portas, econômico, confortável

### Expressões Comuns
- "Gasta pouco" = combustível FLEX
- "Automático" = premium (preço maior)
- "Para família" = SUV ou wagon
- "Primeiro carro" = hatch básico
- "Para trabalho" = econômico e resistente

## ⚙️ Configurações Técnicas

### Parâmetros OpenAI
- **Modelo:** gpt-3.5-turbo
- **Temperature:** 0.1 (baixa para consistência)
- **Max Tokens:** 800 (suficiente para resposta estruturada)
- **System Message:** Contexto brasileiro especializado

### Fallback Strategy
Se a API OpenAI falhar ou retornar resposta inválida:
1. Log do erro
2. Redirecionamento para busca tradicional
3. Preservação da experiência do usuário

## 📊 Métricas de Performance

### Indicadores de Sucesso
- **Taxa de interpretação:** % de buscas interpretadas com sucesso
- **Score médio de confiança:** Precisão média das interpretações
- **Taxa de conversão:** % de buscas que resultam em leads
- **Satisfação do usuário:** Feedback sobre relevância dos resultados

### Monitoramento
- Logs detalhados de cada interpretação
- Análise de padrões de busca mais comuns
- Identificação de termos não reconhecidos
- Ajustes contínuos do prompt baseado no uso real

## 🔧 Manutenção e Evolução

### Atualizações Regulares
1. **Novos modelos:** Adicionar modelos lançados no mercado
2. **Gírias regionais:** Incorporar expressões locais
3. **Tendências de mercado:** Ajustar contextos econômicos
4. **Feedback de usuários:** Melhorar interpretações baseado no uso

### Versioning
- Manter histórico de versões do prompt
- Testes A/B para melhorias
- Rollback rápido em caso de problemas
- Documentação de mudanças

---

**Desenvolvido para:** CarencIA - Sistema de Busca Inteligente  
**Última atualização:** 2024  
**Versão:** 1.0  
**Tecnologia:** OpenAI GPT-3.5 Turbo + Next.js 