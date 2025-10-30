// Em src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 1. Importa o "cérebro"

// Este componente atua como um "portão" de segurança
const ProtectedRoute = () => {
  // 2. Pergunta ao "cérebro" se o utilizador está logado
  const { isLoggedIn } = useAuth();

  // 3. Verifica a resposta
  if (!isLoggedIn) {
    // 4. Se NÃO estiver logado:
    // Redireciona (expulsa) o utilizador para a página de login.
    // O 'replace' impede que o utilizador use o botão "voltar" do navegador
    // para aceder à página protegida.
    return <Navigate to="/login" replace />;
  }

  // 5. Se ESTIVER logado:
  // O <Outlet /> é um "espaço reservado" que diz ao router:
  // "Pode renderizar qualquer página que esteja aninhada dentro de mim
  // (neste caso, o Dashboard)."
  return <Outlet />;
};

export default ProtectedRoute;