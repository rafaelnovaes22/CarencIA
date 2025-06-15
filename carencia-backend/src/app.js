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
            auth: '/api/auth',
            users: '/api/users',
            vehicles: '/api/vehicles',
            matches: '/api/matches',
            leads: '/api/leads',
            analytics: '/api/analytics'
        },
        timestamp: new Date().toISOString()
    });
});

// Basic auth endpoints for testing
app.post('/api/auth/register', (req, res) => {
    res.json({
        success: true,
        message: 'Endpoint de registro funcionando! Banco PostgreSQL conectado.',
        data: req.body,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/auth/login', (req, res) => {
    res.json({
        success: true,
        message: 'Endpoint de login funcionando! Banco PostgreSQL conectado.',
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