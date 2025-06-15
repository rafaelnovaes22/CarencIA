# 🚗 CarencIA - Plataforma Inteligente de Matching Automotivo

> Conectando pessoas aos carros dos seus sonhos através da inteligência artificial

## 🎯 **Sobre o Projeto**

A **CarencIA** é uma plataforma inovadora que usa IA para conectar compradores de carros com concessionárias através da análise de dados de redes sociais, criando matches personalizados baseados no estilo de vida e preferências dos usuários.

## 🚀 **Tecnologias**

### **Frontend**
- **React 18+** com TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Radix UI + shadcn/ui** - Componentes
- **React Query** - Gerenciamento de estado
- **React Router** - Navegação
- **Lucide React** - Ícones

### **Backend**
- **Node.js** com Express
- **TypeScript** - Linguagem tipada
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Railway** - Deploy e hospedagem

## 📁 **Estrutura do Projeto**

```
CarencIA/
├── carencia/                 # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilitários e configurações
│   │   └── types/           # Tipos TypeScript
│   ├── public/              # Arquivos estáticos
│   └── package.json
│
├── carencia-backend/         # Backend API
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── middleware/      # Middlewares
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços de negócio
│   │   └── utils/          # Utilitários
│   ├── prisma/             # Schema e migrações
│   └── package.json
│
└── README.md               # Este arquivo
```

## 🛠️ **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- PostgreSQL (Railway/Neon/Supabase)

### **1. Clonar Repositório**
```bash
git clone <repository-url>
cd CarencIA
```

### **2. Configurar Frontend**
```bash
cd carencia
npm install
npm run dev
```

### **3. Configurar Backend**
```bash
cd carencia-backend
npm install

# Configurar banco de dados
cp env.example .env
# Editar .env com sua DATABASE_URL

# Executar migrações
npx prisma generate
npx prisma migrate dev --name init

# Iniciar servidor
npm run dev
```

## 🌐 **URLs de Desenvolvimento**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

## 📚 **Funcionalidades Implementadas**

### ✅ **Autenticação**
- Registro e login de usuários
- JWT com refresh tokens
- Dois tipos de usuário: Compradores e Concessionárias
- Middleware de proteção de rotas

### ✅ **Gestão de Usuários**
- Perfis personalizados para compradores
- Gestão de concessionárias
- Atualização de dados
- Exclusão de conta

### ✅ **Sistema de Veículos**
- CRUD completo de veículos
- Busca avançada com filtros
- Paginação
- Upload de imagens (preparado)

### ✅ **Interface Completa**
- Landing page responsiva
- Dashboards especializados
- Formulários de onboarding
- Sistema de navegação

### 🔄 **Em Desenvolvimento**
- Sistema de matching com IA
- Análise de dados sociais
- Sistema de leads
- Notificações em tempo real
- OAuth (Google, Facebook)

## 🗄️ **Banco de Dados**

### **Schema Principal**
- **Users** - Usuários do sistema
- **Buyers** - Perfis de compradores
- **Dealerships** - Concessionárias
- **Vehicles** - Veículos cadastrados
- **Matches** - Matches entre compradores e veículos
- **Leads** - Leads gerados
- **SocialProfileData** - Dados de redes sociais
- **Analytics** - Métricas da plataforma

## 🚀 **Deploy**

### **Frontend (Vercel/Netlify)**
```bash
cd carencia
npm run build
# Deploy automático via Git
```

### **Backend (Railway)**
```bash
cd carencia-backend
# Conectar repositório ao Railway
# Configurar variáveis de ambiente
# Deploy automático
```

## 🧪 **Testes**

```bash
# Frontend
cd carencia
npm run test

# Backend
cd carencia-backend
npm run test
```

## 📊 **API Endpoints**

### **Autenticação**
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Renovar token
- `GET /api/auth/me` - Dados do usuário

### **Usuários**
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/buyer/profile` - Perfil do comprador
- `GET /api/users/dealership/profile` - Perfil da concessionária

### **Veículos**
- `GET /api/vehicles` - Listar veículos
- `GET /api/vehicles/search` - Buscar veículos
- `POST /api/vehicles` - Criar veículo
- `PUT /api/vehicles/:id` - Atualizar veículo

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 **Contato**

- **Email**: contato@carencia.com.br
- **GitHub**: [CarencIA Repository](https://github.com/user/carencia)
- **Demo**: [carencia.vercel.app](https://carencia.vercel.app)

---

**CarencIA** - Transformando a experiência de compra de carros através da inteligência artificial. 🚗✨

## 🎯 **Status do Projeto**

- ✅ **Frontend**: Completo e funcional
- ✅ **Backend**: API completa implementada
- ✅ **Banco**: Schema pronto para PostgreSQL
- ⏳ **Deploy**: Preparado para Railway
- 🔄 **IA**: Em desenvolvimento

**Versão atual**: 1.0.0 - MVP Completo 