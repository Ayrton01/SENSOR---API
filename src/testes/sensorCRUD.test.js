import request from 'supertest';
import app from '../server';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Gerenciamento de Equipamentos - CRUD de Sensores', () => {
    let token;
    let sensorId;

    // Antes de tudo, precisamos do crachá (Token)
    beforeAll(async () => {
        const login = await request(app)
            .post('/sensors/login')
            .send({ apiKey: 'sensor-api-secret-2026' });
        token = login.body.token;
    });

    it('Deve cadastrar um novo sensor (CREATE)', async () => {
        const resposta = await request(app)
            .post('/sensors')
            .set('Authorization', `Bearer ${token}`)
            .send({
                tipo: 'Temperatura',
                setor: 'Fundição',
                local: 'Linha de Produção A',
                limiteMinimo: 0,
                limiteMaximo: 90
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body).toHaveProperty('id');
        sensorId = resposta.body.id; // Guardamos para o próximo passo
    });

    it('Deve listar os sensores cadastrados (READ)', async () => {
        const resposta = await request(app)
            .get('/sensors')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
        // Verifica se o sensor que criamos está na lista
        const achouSensor = resposta.body.some(s => s.id === sensorId);
        expect(achouSensor).toBe(true);
    });

    it('Deve atualizar um sensor existente (UPDATE)', async () => {
        const resposta = await request(app)
            .put(`/sensors/${sensorId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                tipo: 'Temperatura', // Mantemos os campos obrigatórios
                setor: 'Fundição',
                local: 'Linha de Produção B (Atualizado)',
                limiteMinimo: 0,
                limiteMaximo: 95
            });

        expect(resposta.status).toBe(200);
        // Verifica se o campo foi atualizado no retorno
        expect(resposta.body).toHaveProperty('local', 'Linha de Produção B (Atualizado)');
    });

    it('Deve excluir um sensor (DELETE)', async () => {
        const resposta = await request(app)
            .delete(`/sensors/${sensorId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).toBe(200);

        // Confirmação: Tenta buscar a lista e garantir que o ID não está mais lá
        const check = await request(app).get('/sensors').set('Authorization', `Bearer ${token}`);
        const achouSensor = check.body.some(s => s.id === sensorId);
        expect(achouSensor).toBe(false);
    });
});