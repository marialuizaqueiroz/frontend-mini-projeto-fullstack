// Em src/pages/Login.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// 1. Importa o "Cérebro" (AuthContext)
import { useAuth } from '../contexts/AuthContext';

// 2. Lê a URL da API do .env.local
const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  // 3. Estados para o formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 4. Hooks para navegar e para aceder ao "Cérebro"
  const navigate = useNavigate();
  const { login } = useAuth(); // <--- AQUI! Estamos a usar o nosso Cérebro

  // 5. Função de submissão do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToastId = toast.loading('A verificar as suas credenciais...');

    try {
      // 6. Fazer a chamada FETCH para o /login
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Ex: "Usuário não encontrado" ou "Senha inválida"
        throw new Error(data.message || 'Falha no login');
      }

      // 7. SUCESSO!
      toast.dismiss(loadingToastId);
      toast.success('Login bem-sucedido!');

      // 8. Esta é a parte mais importante:
      // Chamamos a função 'login' do nosso "Cérebro"
      // e passamos-lhe o token que a API nos deu.
      // O "Cérebro" irá guardar este token no estado e no LocalStorage.
      login(data.token);

      // 9. Redireciona o utilizador para a página inicial (Dashboard)
      navigate('/');

    } catch (error: any) {
      // 10. ERRO!
      toast.dismiss(loadingToastId);
      toast.error(error.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  // 11. O JSX (HTML com Tailwind) - muito similar ao Registo
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      
      {/* NOVO TÍTULO ADICIONADO AQUI */}
      <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
        Minha Lista de Tarefas
      </h1>

      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Entrar na sua Conta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo E-mail */}
          <div>
            <label 
              htmlFor="email" 
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label 
              htmlFor="password" 
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          {/* Botão de Submissão */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isLoading ? 'A entrar...' : 'Entrar'}
            </button>
          </div>
        </form>

        {/* Link para a página de Registo */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Crie uma agora
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;