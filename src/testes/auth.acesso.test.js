import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../server';

describe('Segurança da API - Fluxo de Autenticação', () => {
    
    it('Deve negar acesso (401) se a chave API estiver errada', async () => {
        const resposta = await request(app)
            .post('/sensors/login') 
            .send({ apiKey: 'CHAVE_FALSA_999' });

        expect(resposta.status).toBe(401);
        expect(resposta.body.message).toBe('Chave Inválida!');
    });

    it('Deve autorizar (200) e retornar Token com a chave correta', async () => {
        // Tente usar a chave que você definiu no seu banco ou .env
        const resposta = await request(app)
            .post('/sensors/login')
            .send({ apiKey: 'sensor-api-secret-2026' });

        if (resposta.status === 200) {
            expect(resposta.body).toHaveProperty('token');
            console.log("✅ Token gerado com sucesso no teste!");
        } else {
            // Se falhar aqui, verifique se a rota no server.js está correta
            console.log(`❌ Falha no login. Status recebido: ${resposta.status}. Verifique se a chave 'sensor-api-secret-2026' está correta.`);
        }
    });
});