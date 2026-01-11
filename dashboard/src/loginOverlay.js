import React, { useState, useContext } from 'react';
import { AuthContext } from './token/AuthContext';
// 🚀 ADICIONE ESTA LINHA ABAIXO:
import './loginOverlay.css';

const LoginOverlay = () => {
    // 1. Garanta que o estado comece VAZIO
    const [chave, setChave] = useState(''); 
    const [erro, setErro] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        const resultado = await login(chave);
        if (!resultado.sucess) {
            setErro(resultado.message);
            // Opcional: Limpar o campo se a senha estiver errada
            setChave(''); 
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-box">
                <h2>🔐 Acesso Restrito</h2>
                <p>Fábrica Industrial Manaus</p>
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="password" 
                        placeholder="Digite a Chave da API"
                        value={chave} // O valor exibido vem do estado acima
                        onChange={(e) => setChave(e.target.value)}
                        autoComplete="new-password" // 🚀 Impede o preenchimento automático do navegador
                    />
                    {erro && <span className="erro-msg">{erro}</span>}
                    <button type="submit">Painel de controle do Acesso</button>
                </form>
            </div>
        </div>
    );
};

export default LoginOverlay;