const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'CarencIA API - Plataforma Inteligente de Matching Automotivo',
        version: '1.0.0',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

app.get('/api', (req, res) => {
    res.json({
        message: 'CarencIA API v1.0.0',
        endpoints: {
            auth: '/api/auth (em desenvolvimento)',
            users: '/api/users (em desenvolvimento)',
            vehicles: '/api/vehicles (em desenvolvimento)',
            matches: '/api/matches (em desenvolvimento)',
            leads: '/api/leads (em desenvolvimento)',
            analytics: '/api/analytics (em desenvolvimento)'
        },
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.originalUrl} não existe`,
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 CarencIA API rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Base: http://localhost:${PORT}/api`);
    console.log(`🏠 Home: http://localhost:${PORT}/`);
});

module.exports = app; 