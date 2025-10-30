// Em src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'

// 1. Importações do "Mapa" (Router)
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// 2. Importação das "Mensagens" (Toasts)
import { Toaster } from 'react-hot-toast'

// 3. Importação do "Cérebro" (Auth)
import { AuthProvider } from './contexts/AuthContext'
// Em src/main.tsx

// ... (outras importações)

// 4. Importação das nossas "Páginas" (sem .tsx)
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardPage from './pages/Dashboard'
import NotFoundPage from './pages/NotFound'

// 5. Importação do "Porteiro" (Segurança) (sem .tsx)
import ProtectedRoute from './components/ProtectedRoute'

// 6. Importação do nosso CSS principal (que já contém o Tailwind)
import './styles/index.css' // (Verifique este caminho, o seu pode ser './index.css')

// 7. Montagem da Aplicação
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* O "Cérebro" (AuthProvider) tem de "embrulhar" tudo,
        para que todas as páginas tenham acesso ao estado de login. */}
    <AuthProvider>
      {/* O "Mapa" (BrowserRouter) gere a navegação */}
      <BrowserRouter>
        {/* O "Sistema de Mensagens" (Toaster) fica aqui,
            pronto para mostrar pop-ups em qualquer página. */}
        <Toaster position="top-right" />

        {/* A "Área de Conteúdo" (Routes) define qual página mostrar */}
        <Routes>

          {/* --- ROTAS PÚBLICAS --- */}
          {/* Qualquer um pode visitar estas páginas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- ROTAS PRIVADAS (PROTEGIDAS) --- */}
          {/* O "Porteiro" (ProtectedRoute) fica aqui a guardar. */}
          <Route element={<ProtectedRoute />}>
            {/* Só se pode aceder a estas páginas SE estiver logado.
                O <ProtectedRoute> verifica isto. */}
            <Route path="/" element={<DashboardPage />} />
            {/* Se tivesse uma página "Perfil", ela viria aqui dentro também */}
          </Route>

          {/* --- ROTA DE "NÃO ENCONTRADO" --- */}
          {/* Se o utilizador digitar uma URL que não existe */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)