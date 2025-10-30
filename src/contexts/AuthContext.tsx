// Em src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define a "forma" do nosso contexto (o que ele irá guardar)
interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// 2. Cria o Contexto
// Este é o "contentor" que os nossos componentes irão ler
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Define a URL da nossa API (lendo do ficheiro .env.local)
// Usaremos isto nas nossas páginas de Login/Registo, não aqui.
// Apenas como referência:
// const API_URL = import.meta.env.VITE_API_URL;

// 4. Cria o "Provedor" (Provider)
// Este é o componente que irá "embrulhar" a nossa aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estado para guardar o token
  const [token, setToken] = useState<string | null>(null);

  // Estado derivado: o utilizador está logado SE o token não for nulo
  const isLoggedIn = !!token;

  // 5. Efeito para LER o token do LocalStorage quando a app carrega
  useEffect(() => {
    // Tenta ler o token do localStorage
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []); // O array vazio [] significa que isto só executa UMA VEZ, quando a app arranca

  // 6. Função de Login
  // Esta função será chamada pela nossa PÁGINA de Login
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('jwtToken', newToken); // Salva no localStorage
  };

  // 7. Função de Logout
  // Esta função será chamada pelo nosso BOTÃO de logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwtToken'); // Remove do localStorage
  };

  // 8. Disponibiliza os valores para os componentes "filhos"
  const value = {
    isLoggedIn,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 9. "Hook" Personalizado (Obrigatório!)
// Isto facilita o uso do nosso contexto nas páginas
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};