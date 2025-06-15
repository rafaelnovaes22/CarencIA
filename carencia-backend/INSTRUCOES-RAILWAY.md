# 🚂 Instruções Railway PostgreSQL

## 1. Atualizar .env

Edite o arquivo `.env` e substitua a linha DATABASE_URL:

```env
DATABASE_URL="SUA_DATABASE_URL_DO_RAILWAY_AQUI"
```

## 2. Executar Setup Automático

```bash
# Opção A: Script automático
setup-railway.bat

# Opção B: Comandos manuais
npx prisma generate
npx prisma migrate dev --name init
```

## 3. Testar API Completa

```bash
# Iniciar backend
node src/app.js

# Em outro terminal, testar registro:
curl -X POST http://localhost:3001/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"teste@carencia.com\",\"password\":\"MinhaSenh@123\",\"fullName\":\"Teste\",\"userType\":\"BUYER\"}"
```

## 4. Verificar Banco

```bash
# Abrir Prisma Studio
npx prisma studio
```

## ✅ Checklist

- [ ] DATABASE_URL copiada do Railway
- [ ] Arquivo .env atualizado
- [ ] `npx prisma generate` executado
- [ ] `npx prisma migrate dev` executado
- [ ] Conexão testada com sucesso
- [ ] API funcionando
- [ ] Registro de usuário testado

## 🎯 Próximos Passos

Após configurar o banco:
1. Testar autenticação completa
2. Conectar frontend com backend
3. Testar CRUD de veículos
4. Deploy da aplicação 