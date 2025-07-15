# 🐘 Configuração PostgreSQL - CarencIA

## 📋 Pré-requisitos

### 1. Instalar PostgreSQL

**Windows:**
- Baixe o instalador oficial: https://www.postgresql.org/download/windows/
- Execute o instalador e siga as instruções
- Anote a senha do usuário `postgres`

**macOS:**
```bash
# Usando Homebrew
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Criar banco de dados

Conecte-se ao PostgreSQL e crie o banco:

```sql
-- Conectar como usuário postgres
psql -U postgres

-- Criar banco de dados
CREATE DATABASE carencia_db;

-- Criar usuário específico (opcional)
CREATE USER carencia_user WITH ENCRYPTED PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE carencia_db TO carencia_user;

-- Sair do psql
\q
```

## ⚙️ Configuração do Projeto

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# PostgreSQL Configuration
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/carencia_db?schema=public"

# OU usando usuário específico:
# DATABASE_URL="postgresql://carencia_user:senha_segura@localhost:5432/carencia_db?schema=public"

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@carencia.com.br

# WhatsApp Configuration
WHATSAPP_NUMBER=5511940763330

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=your_facebook_pixel_id

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Robust Car Specific
ROBUST_CAR_PHONE=(11) 2667-6852
ROBUST_CAR_WHATSAPP=(11) 94076-3330
ROBUST_CAR_EMAIL=contato@robustcar.com.br
ROBUST_CAR_ADDRESS=Av. Marechal Tito, 3240, Jardim Silva Teles - São Paulo/SP
```

### 2. Executar Migrações

```bash
# Gerar as tabelas no banco
npm run db:push

# OU criar uma migração
npm run db:migrate
```

### 3. Popular o Banco de Dados

```bash
# Executar seed com dados da Robust Car
npm run db:seed
```

### 4. Verificar Instalação

```bash
# Abrir Prisma Studio para visualizar dados
npm run db:studio
```

## 🔧 Scripts Disponíveis

- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:push` - Aplica schema ao banco (desenvolvimento)
- `npm run db:migrate` - Cria nova migração (produção)
- `npm run db:seed` - Popula banco com dados iniciais
- `npm run db:studio` - Interface visual do banco
- `npm run db:reset` - Reseta banco e executa seed

## 🚀 Desenvolvimento

### Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em: http://localhost:3000

### Estrutura do banco de dados

O sistema cria automaticamente as seguintes tabelas:

- **leads** - Potenciais clientes
- **veiculos** - Catálogo de veículos
- **campanhas** - Campanhas de marketing
- **interacoes** - Histórico de comunicações
- **simulacoes** - Simulações de financiamento
- **agendamentos** - Test drives e visitas
- **eventos** - Tracking e analytics
- **configuracoes** - Configurações do sistema

## 🐛 Solução de Problemas

### Erro de conexão com PostgreSQL

**Problema:** `Error: P1001: Can't reach database server`

**Soluções:**
1. Verifique se o PostgreSQL está rodando:
   ```bash
   # Windows
   services.msc (procure por PostgreSQL)
   
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verifique a DATABASE_URL no `.env`
3. Teste a conexão manual:
   ```bash
   psql "postgresql://postgres:senha@localhost:5432/carencia_db"
   ```

### Erro de permissões

**Problema:** `Error: P3014: The database does not exist`

**Solução:**
```sql
-- Conectar como superusuário
psql -U postgres

-- Criar banco se não existir
CREATE DATABASE carencia_db;
```

### Schema desatualizado

**Problema:** Tabelas não existem após mudanças

**Solução:**
```bash
# Resetar e recriar tudo
npm run db:reset

# OU apenas push das mudanças
npm run db:push
```

### Erro no seed

**Problema:** Dados duplicados ou erro de constraint

**Solução:**
```bash
# Limpar dados e reexecutar
npm run db:reset
```

## 📊 Dados de Exemplo

O seed automaticamente cria:

- ✅ **19 veículos** da Robust Car
- ✅ **5 campanhas** de marketing
- ✅ **13 configurações** da empresa
- ✅ **3 eventos** de exemplo

## 🔐 Segurança

### Produção

Para ambiente de produção:

1. **Use migrações ao invés de db:push:**
   ```bash
   npm run db:migrate
   ```

2. **Configure conexões SSL:**
   ```bash
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
   ```

3. **Use variáveis de ambiente seguras**
4. **Configure backup automático**
5. **Limite acessos por IP**

### Backup

```bash
# Backup do banco
pg_dump -h localhost -U postgres carencia_db > backup.sql

# Restore
psql -h localhost -U postgres carencia_db < backup.sql
```

## 📚 Recursos Úteis

- [Documentação Prisma](https://www.prisma.io/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Prisma Studio](https://www.prisma.io/studio)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl-best-practices.html)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `npm run dev`
2. Teste a conexão com o banco
3. Verifique as variáveis de ambiente
4. Consulte a documentação do Prisma
5. Execute `npm run db:studio` para verificar dados

---

**💡 Dica:** Use o Prisma Studio (`npm run db:studio`) para visualizar e editar dados diretamente no navegador! 