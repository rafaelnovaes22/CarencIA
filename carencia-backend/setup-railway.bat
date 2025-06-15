@echo off
echo 🚂 Configurando Railway PostgreSQL para CarencIA...
echo.

echo ✅ 1. Gerando cliente Prisma...
call npx prisma generate

echo.
echo ✅ 2. Executando migrações...
call npx prisma migrate dev --name init

echo.
echo ✅ 3. Testando conexão...
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log('✅ Conectado ao Railway PostgreSQL!'); process.exit(0); }).catch(err => { console.error('❌ Erro:', err.message); process.exit(1); });"

echo.
echo 🎉 Configuração concluída!
echo 📊 Para abrir Prisma Studio: npx prisma studio
echo 🚀 Para iniciar API: node src/app.js
echo.
pause 