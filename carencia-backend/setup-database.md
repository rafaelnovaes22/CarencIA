# 🗄️ Configuração do Banco PostgreSQL

## Após obter a DATABASE_URL do Railway:

### 1. Atualizar .env
```bash
# Edite o arquivo .env e substitua a DATABASE_URL pela sua do Railway
DATABASE_URL="postgresql://user:pass@host:port/db"
```

### 2. Gerar Cliente Prisma
```bash
npx prisma generate
```

### 3. Executar Migrações
```bash
npx prisma migrate dev --name init
```

### 4. (Opcional) Abrir Prisma Studio
```bash
npx prisma studio
```

### 5. Testar Conexão
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => {
  console.log('✅ Conectado ao banco!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
"
```

## URLs dos Serviços Gratuitos:

- **Railway**: https://railway.app
- **Neon**: https://neon.tech  
- **Supabase**: https://supabase.com

## Exemplo de DATABASE_URL:

### Railway:
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

### Neon:
```
postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Supabase:
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
``` 