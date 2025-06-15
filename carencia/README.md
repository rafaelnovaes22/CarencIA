# CarencIA - Plataforma Inteligente de Matching Automotivo

CarencIA é uma plataforma que usa IA para conectar compradores de veículos com concessionárias através de análise de dados sociais e preferências.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18+ com TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Railway + PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + OAuth (Google, Facebook, Instagram)
- **State Management**: React Query
- **Routing**: React Router
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner

## 📋 Funcionalidades Principais

### ✅ Implementadas
- [x] Landing page responsiva com conteúdo completo
- [x] Sistema de autenticação (email/senha + OAuth)
- [x] Registro com seleção de tipo de usuário
- [x] Dashboard para compradores e concessionárias
- [x] Página de onboarding
- [x] Sistema de consentimento LGPD para dados sociais
- [x] Integração com PostgreSQL via Prisma
- [x] Design responsivo e moderno
- [x] Componentes UI reutilizáveis
- [x] Schema completo do banco de dados

### 🔄 Em Desenvolvimento
- [ ] Backend API com Node.js/Express
- [ ] OAuth com Facebook, Google e Instagram
- [ ] Coleta e análise de dados sociais
- [ ] Sistema de matching inteligente
- [ ] Gestão de veículos (CRUD)
- [ ] Sistema de leads qualificados
- [ ] Analytics e relatórios
- [ ] Upload de imagens
- [ ] Notificações em tempo real

## 🛠️ Setup do Projeto

### 1. Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Railway
- PostgreSQL (via Railway)

### 2. Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd carencia

# Instale as dependências
npm install
```

### 3. Configuração do Railway + PostgreSQL

#### 3.1 Criar Projeto no Railway
1. Acesse [Railway.app](https://railway.app/)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Selecione "Provision PostgreSQL"
5. Copie a `DATABASE_URL` gerada

#### 3.2 Configurar Banco de Dados
```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar migrações (quando o backend estiver pronto)
npx prisma db push

# Visualizar banco (opcional)
npx prisma studio
```

### 4. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database Configuration (Railway PostgreSQL)
DATABASE_URL="postgresql://username:password@hostname:port/database"

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# API Configuration
VITE_API_URL=http://localhost:3000/api
FRONTEND_URL=http://localhost:5173

# Social Media OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret

# Railway Configuration
RAILWAY_STATIC_URL=your_railway_app_url
RAILWAY_GIT_COMMIT_SHA=auto_generated

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173
```

### 5. Executar o Projeto

```bash
# Desenvolvimento (Frontend)
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Prisma commands
npx prisma generate    # Gerar cliente
npx prisma db push     # Aplicar schema
npx prisma studio      # Interface visual
```

## 🏗️ Estrutura do Projeto

```
carencia/
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes UI base
│   │   ├── auth/                  # Componentes de autenticação
│   │   ├── dashboard/             # Componentes dos dashboards
│   │   ├── vehicles/              # Gestão de veículos
│   │   ├── leads/                 # Gestão de leads
│   │   ├── social-data/           # Coleta de dados sociais
│   │   └── onboarding/            # Processo de onboarding
│   ├── hooks/                     # Custom hooks
│   ├── pages/                     # Páginas principais
│   ├── lib/                       # Utilitários, tipos e API
│   └── App.tsx                    # Componente principal
├── prisma/
│   └── schema.prisma              # Schema do banco PostgreSQL
├── public/                        # Arquivos estáticos
└── package.json                   # Dependências
```

## 🗄️ Banco de Dados (PostgreSQL + Prisma)

### Schema Principal

O projeto usa Prisma como ORM com PostgreSQL. O schema inclui:

- **Users**: Usuários base (compradores e concessionárias)
- **Buyers**: Perfis específicos de compradores
- **Dealerships**: Perfis específicos de concessionárias
- **Vehicles**: Catálogo de veículos
- **Matches**: Sistema de matching IA
- **Leads**: Leads qualificados
- **SocialProfileData**: Dados das redes sociais
- **SocialPosts**: Posts coletados
- **LifestyleAnalysis**: Análise de estilo de vida
- **ConsentLogs**: Logs de consentimento LGPD
- **UserSessions**: Sessões de usuário
- **Analytics**: Métricas e estatísticas

### Comandos Prisma Úteis

```bash
# Gerar cliente após mudanças no schema
npx prisma generate

# Aplicar mudanças no banco
npx prisma db push

# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Reset do banco (cuidado!)
npx prisma migrate reset

# Visualizar dados
npx prisma studio

# Seed do banco (quando implementado)
npx prisma db seed
```

## 🎨 Design System

### Cores
- **Primária**: Azul moderno (#2563eb)
- **Secundária**: Verde confiança (#10b981)
- **Accent**: Roxo inovação (#8b5cf6)
- **Neutros**: Grays (#f8fafc, #64748b)

### Tipografia
- **Headings**: Poppins (bold, moderno)
- **Body**: Inter (clean, legível)

## 🔐 Configuração OAuth

### Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Ative a Google+ API
4. Crie credenciais OAuth 2.0
5. Configure URLs de redirecionamento:
   - `http://localhost:3000/api/auth/google/callback` (dev)
   - `https://your-app.railway.app/api/auth/google/callback` (prod)

### Facebook OAuth
1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Crie um novo app
3. Configure Facebook Login
4. Adicione domínios válidos
5. Configure URLs de redirecionamento

### Instagram OAuth
1. Use o mesmo app do Facebook
2. Adicione Instagram Basic Display
3. Configure redirecionamentos
4. Solicite permissões necessárias

## 🚀 Deploy

### Railway (Recomendado)

#### Frontend
```bash
# Conectar repositório ao Railway
railway login
railway link
railway up

# Ou deploy direto
railway deploy
```

#### Backend (quando implementado)
```bash
# Criar serviço separado para API
railway add
railway deploy
```

### Outras Opções

#### Vercel (Frontend)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify (Frontend)
```bash
npm run build
# Upload da pasta dist/
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview da build

# Banco de dados
npx prisma generate      # Gerar cliente Prisma
npx prisma db push       # Aplicar schema
npx prisma studio        # Interface visual
npx prisma migrate dev   # Criar migração

# Qualidade de código
npm run lint             # Linting
npm run type-check       # Verificação TypeScript
```

## 📊 API Endpoints (Planejados)

```
# Autenticação
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh

# OAuth
GET  /api/auth/google/url
POST /api/auth/google/callback
GET  /api/auth/facebook/url
POST /api/auth/facebook/callback

# Usuários
GET  /api/users/:id
PUT  /api/users/:id
GET  /api/users/:id/buyer
PUT  /api/users/:id/buyer

# Veículos
GET  /api/vehicles
POST /api/vehicles
GET  /api/vehicles/:id
PUT  /api/vehicles/:id
DELETE /api/vehicles/:id

# Matches
GET  /api/matches/buyer/:id
POST /api/matches/generate/:id
POST /api/matches/:id/view

# Leads
GET  /api/leads
POST /api/leads
PUT  /api/leads/:id
PATCH /api/leads/:id/status

# Social Data
POST /api/social-data/connect
GET  /api/social-data/platforms
POST /api/social-data/sync

# Analytics
GET  /api/analytics/buyer/:id
GET  /api/analytics/dealership/:id
GET  /api/analytics/global
```

## 🧪 Testes (Planejados)

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@carencia.com.br ou abra uma issue no GitHub.

---

**CarencIA** - Transformamos desejo em direção com inteligência. 🚗✨

### 🎯 Próximos Passos

1. **Implementar Backend API** com Node.js/Express
2. **Configurar OAuth** real com as plataformas
3. **Implementar sistema de matching** com IA
4. **Criar CRUD de veículos** completo
5. **Desenvolver analytics** em tempo real
6. **Adicionar testes** automatizados
7. **Configurar CI/CD** com Railway
