import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. EFEITO DE INICIALIZAÇÃO: Agora busca na SESSÃO (sessionStorage)
    useEffect(() => {
        const recoveredUser = sessionStorage.getItem('usuario_token');

        if (recoveredUser) {
            setUser(recoveredUser);
            axios.defaults.headers.Authorization = `Bearer ${recoveredUser}`;
        }

        setLoading(false);
    }, []);

    // 2. FUNÇÃO DE LOGIN: Salva apenas na SESSÃO
    const login = async (apiKey) => {
        try {
            const response = await axios.post('http://localhost:3000/sensors/login', { apiKey });
            const { token } = response.data;

            // 💡 Mudança aqui: sessionStorage em vez de localStorage
            sessionStorage.setItem('usuario_token', token);

            axios.defaults.headers.Authorization = `Bearer ${token}`;
            setUser(token);
            return { sucess: true };
        } catch (error) {
            console.error("Erro no login:", error);
            return { sucess: false, message: "Chave Inválida!" };
        }
    };

    // 3. FUNÇÃO DE LOGOUT: Limpa a sessão
    const logout = () => {
        sessionStorage.removeItem('usuario_token');
        axios.defaults.headers.Authorization = null;
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ authenticated: !!user, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};