import request from 'supertest';
import app from '../server';
import { describe, it, expect } from 'vitest';

describe('Proteção de Rotas - Middleware JWT', () => {

    it('Deve negar acesso (401) à rota de sensores se NÃO houver Token', async () => {
        const resposta = await request(app)
            .get('/sensors'); // Tenta ler os sensores sem o cabeçalho de autorização

        expect(resposta.status).toBe(401);
    });

    it('Deve negar acesso (401/403) se o Token for inválido ou estiver expirado', async () => {
        const resposta = await request(app)
            .get('/sensors')
            .set('Authorization', 'Bearer token_falso_123'); // Manda um crachá de brinquedo

        expect(resposta.status).toBe(401); 
    });
});