-- Seed data para CarencIA - Robust Car
-- Dados baseados no estoque real do site robustcar.com.br

-- Inserir veículos do estoque da Robust Car
INSERT INTO veiculos (
    marca, modelo, versao, ano, combustivel, cambio, cor, km, preco, 
    fotos, descricao, opcionais, disponivel, destaque
) VALUES

-- Veículos 2025
('CHEVROLET', 'SPIN', 'PREMIER 1.8 8V ECONO.FLEX 5P AUT', 2025, 'FLEX', 'AUTOMATICO', 'PRATA', 10111, 139990.00, 
 ARRAY['https://example.com/spin1.jpg', 'https://example.com/spin2.jpg'], 
 'Chevrolet Spin Premier 2025 - Perfeita para família, com 7 lugares e baixa quilometragem',
 ARRAY['Ar Condicionado', 'Direção Hidráulica', 'Vidros Elétricos', 'Trava Elétrica', 'Airbags'], 
 true, true),

-- Veículos 2024
('HYUNDAI', 'HB20S', '1.0 M COMFORT', 2024, 'FLEX', 'MANUAL', 'AZUL', 72317, 79990.00,
 ARRAY['https://example.com/hb20s1.jpg', 'https://example.com/hb20s2.jpg'],
 'Hyundai HB20S 2024 - Sedan compacto e econômico',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia'],
 true, true),

('FIAT', 'CRONOS', 'DRIVE 1.0 6V FLEX', 2024, 'FLEX', 'MANUAL', 'BRANCO', 44271, 84990.00,
 ARRAY['https://example.com/cronos1.jpg', 'https://example.com/cronos2.jpg'],
 'Fiat Cronos Drive 2024 - Sedan moderno e confiável',
 ARRAY['Ar Condicionado', 'Direção Hidráulica', 'Vidros Elétricos', 'Trava Elétrica'],
 true, true),

('VOLKSWAGEN', 'POLO', 'TRACK MA', 2024, 'FLEX', 'MANUAL', 'BRANCO', 48920, 80990.00,
 ARRAY['https://example.com/polo1.jpg', 'https://example.com/polo2.jpg'],
 'Volkswagen Polo Track 2024 - Hatch premium com tecnologia',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia'],
 true, false),

('CHEVROLET', 'ONIX PLUS', '10TAT PR2', 2024, 'FLEX', 'AUTOMATICO', 'PRETO', 30284, 86990.00,
 ARRAY['https://example.com/onix1.jpg', 'https://example.com/onix2.jpg'],
 'Chevrolet Onix Plus 2024 - Sedan automático com baixa quilometragem',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia', 'Câmbio Automático'],
 true, true),

('RENAULT', 'DUSTER', 'INT16 CVT', 2024, 'FLEX', 'CVT', 'PRETO', 13137, 85990.00,
 ARRAY['https://example.com/duster1.jpg', 'https://example.com/duster2.jpg'],
 'Renault Duster 2024 - SUV robusto com câmbio CVT',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia', 'Câmbio CVT'],
 true, true),

('VOLKSWAGEN', 'T-CROSS', 'TSI', 2024, 'FLEX', 'AUTOMATICO', 'PRATA', 50059, 114990.00,
 ARRAY['https://example.com/tcross1.jpg', 'https://example.com/tcross2.jpg'],
 'Volkswagen T-Cross TSI 2024 - SUV compacto premium',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia', 'Câmbio Automático'],
 true, true),

('VOLKSWAGEN', 'POLO', '1.0 170 TSI COMFORTLINE AUTOMÁTICO', 2024, 'FLEX', 'AUTOMATICO', 'PRATA', 19927, 98990.00,
 ARRAY['https://example.com/polo_tsi1.jpg', 'https://example.com/polo_tsi2.jpg'],
 'Volkswagen Polo TSI 2024 - Hatch premium automático',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia', 'Câmbio Automático'],
 true, false),

-- Veículos 2023
('RENAULT', 'KWID', 'OUTSID 10MT', 2023, 'FLEX', 'MANUAL', 'BRANCO', 35432, 59990.00,
 ARRAY['https://example.com/kwid1.jpg', 'https://example.com/kwid2.jpg'],
 'Renault Kwid 2023 - Compacto econômico ideal para cidade',
 ARRAY['Ar Condicionado', 'Direção Hidráulica', 'Vidros Elétricos'],
 true, false),

('NISSAN', 'FRONTIER', 'ATTACK 2.3 BITURBO 4X4 AUT', 2023, 'DIESEL', 'AUTOMATICO', 'VERMELHO', 64826, 196990.00,
 ARRAY['https://example.com/frontier1.jpg', 'https://example.com/frontier2.jpg'],
 'Nissan Frontier Attack 2023 - Picape diesel 4x4 automática',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia', 'Tração 4x4'],
 true, true),

('HYUNDAI', 'HB20', '1.0 12V 4P FLEX SENSE', 2023, 'FLEX', 'MANUAL', 'CINZA', 82292, 63990.00,
 ARRAY['https://example.com/hb20_1.jpg', 'https://example.com/hb20_2.jpg'],
 'Hyundai HB20 Sense 2023 - Hatch compacto e econômico',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos'],
 true, false),

('HYUNDAI', 'HB20', '1.0 SENSE', 2023, 'FLEX', 'MANUAL', 'BRANCO', 116488, 61990.00,
 ARRAY['https://example.com/hb20_sense1.jpg', 'https://example.com/hb20_sense2.jpg'],
 'Hyundai HB20 Sense 2023 - Compacto confiável',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos'],
 true, false),

-- Veículos 2022
('CAOA CHERY', 'TIGGO 8', 'TXS 1.6 TURBO TGDI AUT', 2022, 'FLEX', 'AUTOMATICO', 'PRATA', 66465, 117990.00,
 ARRAY['https://example.com/tiggo1.jpg', 'https://example.com/tiggo2.jpg'],
 'Chery Tiggo 8 TXS 2022 - SUV 7 lugares turbo automático',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia', 'Câmbio Automático', '7 Lugares'],
 true, true),

('KIA', 'STONIC', 'SX 1.0 TB AUT. (HÍBRIDO)', 2022, 'HIBRIDO', 'AUTOMATICO', 'AZUL', 30134, 94990.00,
 ARRAY['https://example.com/stonic1.jpg', 'https://example.com/stonic2.jpg'],
 'Kia Stonic SX 2022 - SUV híbrido automático',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia', 'Câmbio Automático', 'Motor Híbrido'],
 true, true),

('FIAT', 'STRADA', 'FREEDOM 13CS', 2022, 'FLEX', 'MANUAL', 'BRANCO', 33120, 80990.00,
 ARRAY['https://example.com/strada1.jpg', 'https://example.com/strada2.jpg'],
 'Fiat Strada Freedom 2022 - Picape compacta cabine simples',
 ARRAY['Ar Condicionado', 'Direção Hidráulica', 'Vidros Elétricos'],
 true, false),

-- Veículos 2021
('CHEVROLET', 'TRACKER', '1.2 TURBO 12V FLEX AUT.', 2021, 'FLEX', 'AUTOMATICO', 'VERMELHO', 77130, 88990.00,
 ARRAY['https://example.com/tracker1.jpg', 'https://example.com/tracker2.jpg'],
 'Chevrolet Tracker 2021 - SUV turbo automático',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia', 'Câmbio Automático'],
 true, false),

('FORD', 'BRONCO', 'S WILD 2.0', 2021, 'FLEX', 'MANUAL', 'VERMELHO', 35110, 160990.00,
 ARRAY['https://example.com/bronco1.jpg', 'https://example.com/bronco2.jpg'],
 'Ford Bronco S Wild 2021 - SUV aventureiro',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia'],
 true, true),

('YAMAHA', 'NEO', 'AUTOMATIC 125CC', 2021, 'GASOLINA', 'AUTOMATICO', 'PRETO', 28090, 13990.00,
 ARRAY['https://example.com/neo1.jpg', 'https://example.com/neo2.jpg'],
 'Yamaha NEO 2021 - Scooter automática 125cc',
 ARRAY['Partida Elétrica', 'Painel Digital', 'Porta Objetos'],
 true, false),

('CHEVROLET', 'TRACKER', 'LT 1.0 TURBO 12V FLEX AUT.', 2021, 'FLEX', 'AUTOMATICO', 'BRANCO', 71034, 96990.00,
 ARRAY['https://example.com/tracker_lt1.jpg', 'https://example.com/tracker_lt2.jpg'],
 'Chevrolet Tracker LT 2021 - SUV turbo automático branco',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia', 'Câmbio Automático'],
 true, false),

('CHEVROLET', 'ONIX PLUS', '10TMT LTZ', 2021, 'FLEX', 'AUTOMATICO', 'PRETO', 1, 74990.00,
 ARRAY['https://example.com/onix_ltz1.jpg', 'https://example.com/onix_ltz2.jpg'],
 'Chevrolet Onix Plus LTZ 2021 - Sedan automático seminovo',
 ARRAY['Ar Condicionado', 'Direção Elétrica', 'Vidros Elétricos', 'Central Multimídia', 'Câmbio Automático'],
 true, true);

-- Atualizar alguns como destaque para homepage
UPDATE veiculos SET destaque = true WHERE marca IN ('CHEVROLET', 'HYUNDAI', 'VOLKSWAGEN') AND ano >= 2024;

-- Inserir configurações específicas da Robust Car
INSERT INTO configuracoes (chave, valor, descricao) VALUES
('site_titulo', 'CarencIA - Robust Car', 'Título do site'),
('site_descricao', 'Encontre o carro dos seus sonhos na Robust Car - Veículos seminovos com qualidade e garantia', 'Descrição do site'),
('meta_keywords', 'carros seminovos, veículos usados, São Paulo, Robust Car, financiamento', 'Palavras-chave SEO'),
('whatsapp_numero', '5511940763330', 'Número WhatsApp no formato internacional'),
('whatsapp_mensagem', 'Olá! Gostaria de mais informações sobre os veículos disponíveis.', 'Mensagem padrão WhatsApp'),
('email_contato', 'contato@robustcar.com.br', 'E-mail de contato principal'),
('google_analytics_id', 'GA_MEASUREMENT_ID', 'ID do Google Analytics'),
('facebook_pixel_id', 'FB_PIXEL_ID', 'ID do Facebook Pixel'),
('endereco_completo', 'Av. Marechal Tito, 3240, Jardim Silva Teles - São Paulo/SP', 'Endereço completo'),
('cep', '08270-000', 'CEP da loja'),
('latitude', '-23.5505', 'Latitude para mapa'),
('longitude', '-46.6333', 'Longitude para mapa'),
('instagram_url', 'https://instagram.com/robustcar', 'URL do Instagram'),
('facebook_url', 'https://facebook.com/robustcar', 'URL do Facebook'),
('youtube_url', 'https://youtube.com/robustcar', 'URL do YouTube');

-- Inserir algumas campanhas de exemplo
INSERT INTO campanhas (nome, descricao, utm_source, utm_medium, utm_campaign) VALUES
('Google Ads - Seminovos', 'Campanha Google Ads para veículos seminovos', 'google', 'cpc', 'seminovos'),
('Facebook Ads - SUV', 'Campanha Facebook focada em SUVs', 'facebook', 'social', 'suv'),
('Instagram Ads - Compactos', 'Campanha Instagram para carros compactos', 'instagram', 'social', 'compactos'),
('WhatsApp Direto', 'Leads vindos diretamente do WhatsApp', 'whatsapp', 'direto', 'whatsapp'),
('Indicação', 'Leads vindos por indicação de clientes', 'indicacao', 'referral', 'indicacao');

-- Inserir alguns eventos de exemplo (opcional)
INSERT INTO eventos (evento, pagina, parametros) VALUES
('page_view', '/', '{"user_agent": "Mozilla/5.0", "referrer": "google.com"}'),
('form_start', '/contato', '{"form_id": "lead_form"}'),
('cta_click', '/veiculos', '{"cta_text": "Tenho Interesse", "veiculo_id": "uuid"}');

-- Comentários sobre o schema
COMMENT ON TABLE leads IS 'Tabela principal de leads/potenciais clientes';
COMMENT ON TABLE veiculos IS 'Catálogo de veículos disponíveis para venda';
COMMENT ON TABLE interacoes IS 'Histórico de todas as interações com leads';
COMMENT ON TABLE simulacoes IS 'Simulações de financiamento realizadas';
COMMENT ON TABLE agendamentos IS 'Agendamentos de test drive, visitas e avaliações';
COMMENT ON TABLE eventos IS 'Eventos de tracking e analytics';
COMMENT ON TABLE configuracoes IS 'Configurações gerais do sistema';
COMMENT ON TABLE campanhas IS 'Campanhas de marketing para tracking de origem'; 