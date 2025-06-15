import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

// Função para conectar ao banco
export async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log('✅ Conectado ao banco PostgreSQL via Prisma');

        // Test query to ensure connection is working
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Conexão com banco testada com sucesso');
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
        return {
            status: 'healthy',
            timestamp: new Date(),
            connection: 'active'
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date(),
            connection: 'failed'
        };
    }
}

// Função para executar transações
export async function executeTransaction<T>(
    callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
    return await prisma.$transaction(callback);
}

// Função para limpar dados de teste (apenas em desenvolvimento)
export async function clearTestData() {
    if (process.env.NODE_ENV !== 'development') {
        throw new Error('clearTestData só pode ser executado em desenvolvimento');
    }

    try {
        // Ordem importante devido às foreign keys
        await prisma.socialPost.deleteMany();
        await prisma.lifestyleAnalysis.deleteMany();
        await prisma.socialProfileData.deleteMany();
        await prisma.consentLog.deleteMany();
        await prisma.userSession.deleteMany();
        await prisma.match.deleteMany();
        await prisma.lead.deleteMany();
        await prisma.vehicle.deleteMany();
        await prisma.buyer.deleteMany();
        await prisma.dealership.deleteMany();
        await prisma.user.deleteMany();
        await prisma.analytics.deleteMany();

        console.log('✅ Dados de teste limpos com sucesso');
    } catch (error) {
        console.error('❌ Erro ao limpar dados de teste:', error);
        throw error;
    }
}

export default prisma; 