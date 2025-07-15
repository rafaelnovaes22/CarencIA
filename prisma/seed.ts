import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...')

    // Criar concessionárias padrão
    const robustCar = await prisma.concessionaria.upsert({
        where: { slug: 'robust_car_concessionaria' },
        update: {},
        create: {
            nome: 'Robust Car',
            slug: 'robust_car_concessionaria',
            cidade: 'São Paulo',
            estado: 'SP',
            telefone: '(11) 99999-9999',
            email: 'leads@robustcar.com.br',
            website: 'https://robustcar.com.br',
            scraping_ativo: true,
            scraping_config: {
                base_url: 'https://robustcar.com.br',
                busca_path: '/busca',
                selector_links: 'a[href*="/carros/"]',
                selector_titulo: 'h1',
                selector_preco: '.preco',
                intervalo_scraping: 3600 // 1 hora
            },
            recebe_leads: true,
            webhook_url: null // Para ser configurado depois
        }
    })

    console.log('✅ Concessionária criada:', robustCar.nome)

    // Criar campanhas padrão
    const campanhaDefault = await prisma.campanha.upsert({
        where: { nome: 'Default Website' },
        update: {},
        create: {
            nome: 'Default Website',
            descricao: 'Campanha padrão para leads do website',
            utm_source: 'website',
            utm_medium: 'organic',
            utm_campaign: 'default',
            ativo: true
        }
    })

    const campanhaFacebook = await prisma.campanha.upsert({
        where: { nome: 'Facebook Ads' },
        update: {},
        create: {
            nome: 'Facebook Ads',
            descricao: 'Campanhas do Facebook e Instagram',
            utm_source: 'facebook',
            utm_medium: 'paid',
            utm_campaign: 'facebook_ads',
            ativo: true
        }
    })

    const campanhaGoogle = await prisma.campanha.upsert({
        where: { nome: 'Google Ads' },
        update: {},
        create: {
            nome: 'Google Ads',
            descricao: 'Campanhas do Google Ads',
            utm_source: 'google',
            utm_medium: 'paid',
            utm_campaign: 'google_ads',
            ativo: true
        }
    })

    console.log('✅ Campanhas criadas:')
    console.log('  -', campanhaDefault.nome)
    console.log('  -', campanhaFacebook.nome)
    console.log('  -', campanhaGoogle.nome)

    // Criar configurações padrão
    const configuracoes = [
        {
            chave: 'site_nome',
            valor: 'CarencIA',
            tipo: 'string',
            descricao: 'Nome do site'
        },
        {
            chave: 'lead_timeout_minutos',
            valor: '5',
            tipo: 'number',
            descricao: 'Tempo limite para resposta de leads (em minutos)'
        },
        {
            chave: 'scraping_intervalo_horas',
            valor: '6',
            tipo: 'number',
            descricao: 'Intervalo entre scraping automático (em horas)'
        },
        {
            chave: 'webhook_timeout_segundos',
            valor: '10',
            tipo: 'number',
            descricao: 'Timeout para webhooks (em segundos)'
        },
        {
            chave: 'leads_auto_distribuicao',
            valor: 'true',
            tipo: 'boolean',
            descricao: 'Ativar distribuição automática de leads'
        }
    ]

    for (const config of configuracoes) {
        await prisma.configuracao.upsert({
            where: { chave: config.chave },
            update: {},
            create: config
        })
    }

    console.log('✅ Configurações criadas:', configuracoes.length)

    // Criar alguns veículos de exemplo se não existirem
    const veiculosExistentes = await prisma.veiculo.count()

    if (veiculosExistentes === 0) {
        console.log('📦 Criando veículos de exemplo...')

        const veiculosExemplo = [
            {
                marca: 'HONDA',
                modelo: 'CIVIC',
                versao: 'EXL 2.0',
                ano: 2023,
                combustivel: 'FLEX',
                cambio: 'AUTOMATICO',
                cor: 'BRANCO',
                km: 15000,
                preco: 139990,
                fotos: [
                    'https://via.placeholder.com/800x600/333/fff?text=Honda+Civic+1',
                    'https://via.placeholder.com/800x600/666/fff?text=Honda+Civic+2'
                ],
                descricao: 'Honda Civic EXL 2.0 em excelente estado. Revisões em dia.',
                opcionais: ['Ar condicionado', 'Direção hidráulica', 'Vidros elétricos'],
                fonte_scraping: 'robust_car',
                url_origem: 'https://robustcar.com.br/honda-civic-exl',
                data_scraping: new Date(),
                concessionaria_id: robustCar.id
            },
            {
                marca: 'TOYOTA',
                modelo: 'COROLLA',
                versao: 'XEI 2.0',
                ano: 2022,
                combustivel: 'FLEX',
                cambio: 'AUTOMATICO',
                cor: 'PRATA',
                km: 25000,
                preco: 119990,
                fotos: [
                    'https://via.placeholder.com/800x600/333/fff?text=Toyota+Corolla+1',
                    'https://via.placeholder.com/800x600/666/fff?text=Toyota+Corolla+2'
                ],
                descricao: 'Toyota Corolla XEI 2.0 automático. Muito econômico.',
                opcionais: ['Ar condicionado', 'Direção elétrica', 'Central multimídia'],
                fonte_scraping: 'robust_car',
                url_origem: 'https://robustcar.com.br/toyota-corolla-xei',
                data_scraping: new Date(),
                concessionaria_id: robustCar.id
            },
            {
                marca: 'CHEVROLET',
                modelo: 'ONIX',
                versao: 'LT 1.0',
                ano: 2021,
                combustivel: 'FLEX',
                cambio: 'MANUAL',
                cor: 'AZUL',
                km: 35000,
                preco: 65990,
                fotos: [
                    'https://via.placeholder.com/800x600/333/fff?text=Chevrolet+Onix+1',
                    'https://via.placeholder.com/800x600/666/fff?text=Chevrolet+Onix+2'
                ],
                descricao: 'Chevrolet Onix LT 1.0 manual. Ideal para o dia a dia.',
                opcionais: ['Ar condicionado', 'Direção hidráulica', 'Rádio'],
                fonte_scraping: 'robust_car',
                url_origem: 'https://robustcar.com.br/chevrolet-onix-lt',
                data_scraping: new Date(),
                concessionaria_id: robustCar.id
            }
        ]

        for (const veiculo of veiculosExemplo) {
            await prisma.veiculo.create({
                data: veiculo
            })
        }

        console.log('✅ Veículos de exemplo criados:', veiculosExemplo.length)
    }

    console.log('🎉 Seed concluído com sucesso!')
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 