# CarencIA Backend API

Backend API para a CarencIA - Plataforma Inteligente de Matching Automotivo usando IA para conectar compradores de carros com concessionárias através da análise de dados de redes sociais.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Linguagem tipada
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Railway** - Deploy e hospedagem

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd carencia-backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados**
```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# (Opcional) Popular com dados de exemplo
npm run db:seed
```

## 🚀 Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Scripts Disponíveis
```bash
npm run dev          # Executar em modo desenvolvimento
npm run build        # Compilar TypeScript
npm start           # Executar versão compilada
npm run db:generate # Gerar cliente Prisma
npm run db:push     # Push schema para banco
npm run db:migrate  # Executar migrações
npm run db:studio   # Abrir Prisma Studio
npm run db:seed     # Popular banco com dados
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Renovar token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário logado

### Usuários
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `DELETE /api/users/account` - Deletar conta
- `GET /api/users/buyer/profile` - Perfil do comprador
- `PUT /api/users/buyer/profile` - Atualizar perfil do comprador
- `GET /api/users/dealership/profile` - Perfil da concessionária
- `PUT /api/users/dealership/profile` - Atualizar perfil da concessionária

### Veículos
- `GET /api/vehicles` - Listar veículos
- `GET /api/vehicles/search` - Buscar veículos
- `GET /api/vehicles/:id` - Obter veículo
- `POST /api/vehicles` - Criar veículo (concessionárias)
- `PUT /api/vehicles/:id` - Atualizar veículo
- `DELETE /api/vehicles/:id` - Deletar veículo

### Matches
- `GET /api/matches` - Listar matches (compradores)
- `GET /api/matches/:id` - Obter match específico

### Leads
- `GET /api/leads` - Listar leads
- `GET /api/leads/:id` - Obter lead específico

### Analytics
- `GET /api/analytics` - Dados de analytics

### Health Check
- `GET /health` - Status da API
- `GET /api/health` - Health check detalhado

## 🗄️ Estrutura do Banco

### Principais Entidades

- **User** - Usuários do sistema (compradores e concessionárias)
- **Buyer** - Perfil específico de compradores
- **Dealership** - Perfil específico de concessionárias
- **Vehicle** - Veículos cadastrados
- **Match** - Matches entre compradores e veículos
- **Lead** - Leads gerados
- **SocialProfileData** - Dados de perfis sociais
- **Analytics** - Dados de analytics

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação:

1. **Registro/Login** - Retorna access token e refresh token
2. **Access Token** - Válido por 7 dias, usado nas requisições
3. **Refresh Token** - Válido por 30 dias, usado para renovar access token

### Headers de Autenticação
```
Authorization: Bearer <access_token>
```

## 🛡️ Segurança

- **Helmet** - Headers de segurança
- **CORS** - Controle de origem
- **Rate Limiting** - Limite de requisições
- **bcryptjs** - Hash de senhas
- **JWT** - Tokens seguros
- **Validação** - express-validator

## 🌍 Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# OAuth (Opcional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Email (Opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Deploy

### Railway (Recomendado)

1. **Conecte seu repositório ao Railway**
2. **Configure as variáveis de ambiente**
3. **Deploy automático**

### Outras Plataformas

- **Heroku** - Suporte nativo
- **Vercel** - Para APIs serverless
- **DigitalOcean** - App Platform
- **AWS** - EC2 ou Lambda

## 📊 Monitoramento

- **Health Checks** - `/health` e `/api/health`
- **Logs** - Morgan + console logs
- **Error Handling** - Middleware centralizado
- **Request Tracking** - Request ID único

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test

# Coverage
npm run test:coverage
```

## 📝 Desenvolvimento

### Estrutura de Pastas
```
src/
├── controllers/     # Controladores
├── middleware/      # Middlewares
├── routes/         # Rotas
├── services/       # Serviços
├── utils/          # Utilitários
├── types/          # Tipos TypeScript
└── server.ts       # Servidor principal
```

### Padrões de Código

- **TypeScript** - Tipagem estrita
- **ESLint** - Linting
- **Prettier** - Formatação
- **Async/Await** - Promises
- **Error Handling** - Try/catch + middleware

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: suporte@carencia.com.br
- **GitHub Issues**: Para bugs e feature requests
- **Documentação**: [docs.carencia.com.br](https://docs.carencia.com.br)

---

**CarencIA** - Conectando pessoas aos carros dos seus sonhos através da inteligência artificial. 🚗✨ 