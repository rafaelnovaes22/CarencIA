# 🔥 Configuração do Firecrawl para Extração de Fotos

## 📋 Visão Geral
Este documento explica como configurar o Firecrawl para extrair automaticamente as fotos dos veículos diretamente do site da Robust Car.

## 🚀 Configuração Inicial

### 1. Obter API Key do Firecrawl
1. Acesse [https://www.firecrawl.dev/app/api-keys](https://www.firecrawl.dev/app/api-keys)
2. Crie uma conta gratuita (oferece 500 créditos gratuitos)
3. Gere uma nova API key
4. Copie a API key gerada

### 2. Configurar Variável de Ambiente
Adicione a seguinte linha no seu arquivo `.env`:

```env
FIRECRAWL_API_KEY="sua_api_key_aqui"
```

## 📱 Como Usar

### Via Script (Recomendado)
```bash
# Verificar se está configurado
npm run extract:photos:help

# Executar extração
npm run extract:photos
```

### Via API Web
```bash
# Verificar configuração
curl http://localhost:3000/api/extract-photos

# Executar extração
curl -X POST http://localhost:3000/api/extract-photos
```

## 🛠️ Funcionalidades

### ✅ O que o Sistema Faz
- **Crawling Inteligente**: Analisa todo o site robustcar.com.br
- **Extração de Fotos**: Identifica e extrai URLs de todas as imagens dos veículos
- **Matching Automático**: Associa fotos aos veículos corretos no banco
- **Validação**: Verifica se as URLs das imagens são válidas
- **Atualização**: Atualiza automaticamente o banco de dados

### 🎯 Dados Extraídos
- **Fotos**: URLs das imagens reais dos veículos
- **Especificações**: Marca, modelo, ano, versão
- **Detalhes**: Preço, quilometragem, combustível, câmbio
- **Metadados**: Cor, descrição, data de atualização

## 📊 Resultados Esperados

### Exemplo de Saída
```json
{
  "success": true,
  "message": "Extração de fotos concluída com sucesso!",
  "data": {
    "veiculos_encontrados": 15,
    "fotos_totais": 67,
    "veiculos_com_fotos": 14,
    "veiculos": [
      {
        "marca": "CHEVROLET",
        "modelo": "SPIN",
        "ano": 2025,
        "fotos_count": 5,
        "fotos_preview": [
          "https://robustcar.com.br/images/spin-2025-1.jpg",
          "https://robustcar.com.br/images/spin-2025-2.jpg"
        ]
      }
    ]
  }
}
```

## 🔧 Troubleshooting

### Problemas Comuns

#### ❌ "API key não configurada"
**Solução**: Adicione `FIRECRAWL_API_KEY` no arquivo `.env`

#### ❌ "Nenhum veículo encontrado"
**Possíveis causas**:
- Site fora do ar
- Estrutura do site mudou
- Bloqueio de crawler

#### ❌ "Erro de conexão"
**Soluções**:
- Verifique conexão internet
- Confirme se robustcar.com.br está acessível
- Tente novamente em alguns minutos

## 💡 Vantagens do Firecrawl

### 🚀 **Automação Total**
- Extração automática sem intervenção manual
- Atualização em tempo real do estoque
- Sincronização com o banco de dados

### 📸 **Fotos Autênticas**
- Imagens reais dos veículos da Robust Car
- Múltiplas fotos por veículo
- Qualidade original preservada

### 🔄 **Sempre Atualizado**
- Pode ser executado periodicamente
- Captura novos veículos automaticamente
- Remove veículos vendidos

## 📝 Logs e Monitoramento

### Logs Detalhados
```
🔍 Iniciando extração do site Robust Car...
📄 Encontradas 23 páginas
🚗 Processando: Chevrolet Spin Premier 2025
✅ Veículo extraído: CHEVROLET SPIN
✅ Atualizado: CHEVROLET SPIN (5 fotos)
🎉 Processo concluído! Atualizados: 12, Criados: 3
```

## 🔐 Segurança e Ética

### ✅ Uso Autorizado
- Autorização expressa do proprietário da Robust Car
- Uso apenas para fins comerciais legítimos
- Respeito aos termos de uso do site

### 🛡️ Boas Práticas
- Rate limiting automático
- Sem sobrecarga do servidor
- Crawling respeitoso

## 📈 Próximos Passos

1. **Configurar**: Adicione a API key do Firecrawl
2. **Testar**: Execute uma extração inicial
3. **Automatizar**: Configure execução periódica
4. **Monitorar**: Acompanhe logs e resultados

---

💬 **Dúvidas?** Entre em contato com a equipe de desenvolvimento! 