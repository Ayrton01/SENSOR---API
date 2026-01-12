import request from 'supertest';
import app from '../server';
import { describe, it, expect } from 'vitest';

describe('Fluxo Operacional Completo - Planta Manaus', () => {

    it('Deve logar, criar sensor e enviar leitura com sucesso', async () => {
        // 1. LOGIN
        const login = await request(app)
            .post('/sensors/login')
            .send({ apiKey: 'sensor-api-secret-2026' });
        
        const token = login.body.token;

        // 2. CRIAR SENSOR (Necessário para não dar erro de "Sensor não existe")
        const sensorRes = await request(app)
            .post('/sensors')
            .set('Authorization', `Bearer ${token}`)
            .send({
                tipo: 'Temperatura',
                setor: 'Testes',
                local: 'Laboratório',
                limiteMinimo: 0,
                limiteMaximo: 100
            });
            
        expect(sensorRes.status).toBe(201); // Garante que o sensor foi criado
        const sensorId = sensorRes.body.id;

        // 3. ENVIAR LEITURA (Usando o ID do sensor recém-criado)
        const leitura = await request(app)
            .post('/readings') 
            .set('Authorization', `Bearer ${token}`)
            .send({
                sensorId: sensorId, 
                valor: 45.5
            });

        if (leitura.status === 400) {
            console.log("Erro na leitura:", leitura.body);
        }

        // Se a rota ainda não existir ou der erro, o teste nos avisará
        expect([200, 201]).toContain(leitura.status);
    });
});