// Em src/pages/Register.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Para o link "Já tem conta?"
import toast from 'react-hot-toast'; // Para as mensagens de erro/sucesso

// 1. Lê a URL da nossa API do ficheiro .env.local
const API_URL = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
  // 2. Estados para guardar os dados do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Estado de Loading (para desativar o botão durante o pedido)
  const [isLoading, setIsLoading] = useState(false);

  // 4. Hook para navegar para a página de login após o sucesso
  const navigate = useNavigate();

  // 5. Função que é chamada quando o formulário é submetido
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o recarregamento da página
    setIsLoading(true); // Ativa o estado de loading
    
    // Mostra o toast de "a carregar"
    const loadingToastId = toast.loading('A criar a sua conta...');

    try {
      // 6. Fazer a chamada FETCH para o nosso backend
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      // 7. Lidar com a RESPOSTA
      if (!response.ok) {
        // Se a API retornar um erro (4xx, 5xx), lança uma exceção
        throw new Error(data.message || 'Falha ao registar. Tente novamente.');
      }

      // 8. Lidar com o SUCESSO
      toast.dismiss(loadingToastId); // Remove o toast de loading
      toast.success('Conta criada com sucesso! Pode agora fazer login.');
      
      // Redireciona o utilizador para a página de login
      navigate('/login');

    } catch (error: any) {
      // 9. Lidar com o ERRO
      toast.dismiss(loadingToastId); // Remove o toast de loading
      
      // Mostra o toast de erro (ex: "E-mail já existe")
      toast.error(error.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false); // Reativa o botão, quer dê sucesso ou erro
    }
  };

  // 10. O JSX (HTML com Tailwind)
  // Este layout já é "mobile-first" e responsivo (30% da nota)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">

      {/* NOVO TÍTULO ADICIONADO AQUI */}
      <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
        Minha Lista de Tarefas
      </h1>

      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Criar Conta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nome */}
          <div>
            <label 
              htmlFor="name" 
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

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
              autoComplete="new-password"
              required
              minLength={6} // Validação de 6 caracteres (como no backend)
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
              {isLoading ? 'A criar...' : 'Registrar'}
            </button>
          </div>
        </form>

        {/* Link para a página de Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Faça login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;