import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient({
    log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

// Função para conectar ao banco
export async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log('✅ Conectado ao banco PostgreSQL via Prisma');
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
        throw error;
    }
}

// Função para desconectar do banco
export async function disconnectDatabase() {
    try {
        await prisma.$disconnect();
        console.log('✅ Desconectado do banco PostgreSQL');
    } catch (error) {
        console.error('❌ Erro ao desconectar do banco:', error);
    }
}

// Função para verificar saúde do banco
export async function checkDatabaseHealth() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
        return { status: 'unhealthy', error: error, timestamp: new Date() };
    }
}

export default prisma; 