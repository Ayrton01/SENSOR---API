const express = require('express');
const app = express();
app.use(express.json());

// Importamos as configurações centralizadas
const services = require('../../core/config/services');
const PORTA = new URL(services.SISTEMA_LEGADO.URL).port;

// Rota que receberá os alertas de anomalia
app.post('/api/alerts', (req, res) => {
    const { sensorId, tipoSensor, setor, local, valor, limiteMin, limiteMax, dataMedicao } = req.body;

    console.log('\n-------------------------------------------');
    console.log('📢 [SISTEMA LEGADO] ALERTA RECEBIDO!');
    console.log(`⚠️  ANOMALIA NO SETOR: ${setor}`);
    console.log(`📍 LOCAL: ${local} | TIPO: ${tipoSensor}`);
    console.log(`📉 VALOR CAPTURADO: ${valor}`);
    console.log(`📏 LIMITES PERMITIDOS: ${limiteMin} a ${limiteMax}`);
    console.log(`⏰ INSTANTE: ${dataMedicao}`);
    console.log('-------------------------------------------\n');

    return res.status(200).json({ status: 'Alerta processado pelo legado' });
});

app.listen(PORTA, () => {
    console.log(`✅ Mock do Sistema Legado rodando em http://localhost:${PORTA}`);
});