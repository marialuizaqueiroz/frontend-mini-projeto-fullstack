import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import EditTaskModal from '../components/EditTaskModal';

// ... (interface Task não muda)
interface Task {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const DashboardPage = () => {
  // ... (Estados não mudam)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token, logout } = useAuth();

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const apiFetch = useCallback(async (urlEndpoint: string, options: RequestInit = {}) => {
      
      const headers = new Headers(options.headers || {});
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');

      const response = await fetch(`${API_URL}${urlEndpoint}`, { ...options, headers });

      // A VERIFICAÇÃO DE EXPIRAÇÃO (AGORA EM UM SÓ LUGAR!)
      if (response.status === 401) {
          toast.error('A sua sessão expirou. Por favor, faça login novamente.');
          logout(); // Desloga o utilizador
          // Lança um erro especial para parar a execução das outras funções
          throw new Error('Sessão expirada'); 
      }

      if (!response.ok) {
          // Tenta ler a mensagem de erro específica da API
          const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
          throw new Error(errorData.message || 'Ocorreu um erro na API');
      }
      
      // Se a resposta for 204 (No Content), como no DELETE, não há JSON para ler
      if (response.status === 204) {
          return null; 
      }

      return response.json(); // Retorna os dados

  }, [token, logout]); // Depende do token e da função logout

  // ===================================================================
  // 🚀 FASE 2: ATUALIZAR AS NOSSAS FUNÇÕES DE CRUD
  // ===================================================================
  // Agora, as nossas funções de CRUD ficam muito mais limpas.

  // FUNÇÃO "LER" (Read)
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    if (!token) { setIsLoading(false); return; } // Segurança extra

    try {
        // Usamos o nosso novo "ajudante"
        const data: Task[] = await apiFetch('/tasks', { method: 'GET' });
        setTasks(data);
    } catch (error: any) {
        // A apiFetch já tratou o 401, então só mostramos outros erros
        if (error.message !== 'Sessão expirada') {
            toast.error(error.message || 'Erro ao carregar tarefas.');
        }
    } finally {
        setIsLoading(false);
    }
  }, [token, apiFetch]); // Agora depende de apiFetch

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // FUNÇÃO "CRIAR" (Create)
  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error('O título não pode estar vazio.');
      return;
    }
    
    const loadingToastId = toast.loading('A criar tarefa...');
    try {
        // Usamos o nosso novo "ajudante"
        await apiFetch('/tasks', {
            method: 'POST',
            body: JSON.stringify({
                title: newTaskTitle,
                description: '',
            }),
        });

        setNewTaskTitle('');
        toast.dismiss(loadingToastId);
        toast.success('Tarefa criada!');
        await fetchTasks();

    } catch (error: any) {
        toast.dismiss(loadingToastId);
        // O 401 já foi tratado. Mostra outros erros (ex: "Falha ao criar...")
        if (error.message !== 'Sessão expirada') {
            toast.error(error.message || 'Falha ao criar a tarefa.');
        }
    }
  };

  // FUNÇÃO "APAGAR" (Delete)
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Tem a certeza que quer apagar esta tarefa?')) {
      return;
    }

    const loadingToastId = toast.loading('A apagar tarefa...');
    try {
        // Usamos o nosso novo "ajudante"
        await apiFetch(`/tasks/${taskId}`, {
            method: 'DELETE',
        });
        
        toast.dismiss(loadingToastId);
        toast.success('Tarefa apagada!');
        await fetchTasks();

    } catch (error: any) {
        toast.dismiss(loadingToastId);
        if (error.message !== 'Sessão expirada') {
            toast.error(error.message || 'Falha ao apagar a tarefa.');
        }
    }
  };

  // FUNÇÃO "ATUALIZAR" (Update)
  const handleToggleComplete = async (task: Task) => {
    const loadingToastId = toast.loading('A atualizar tarefa...');
    try {
        // Usamos o nosso novo "ajudante"
        await apiFetch(`/tasks/${task.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                completed: !task.completed,
            }),
        });
        
        toast.dismiss(loadingToastId);
        await fetchTasks(); // Atualiza a lista

    } catch (error: any) {
        toast.dismiss(loadingToastId);
        if (error.message !== 'Sessão expirada') {
            toast.error(error.message || 'Falha ao atualizar a tarefa.');
        }
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    data: { title: string; description?: string }
  ) => {
    const loadingToastId = toast.loading('A atualizar tarefa...');
    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: 'PATCH', // Usamos PATCH para atualização parcial (é mais seguro que PUT)
        body: JSON.stringify(data),
      });

      toast.dismiss(loadingToastId);
      toast.success('Tarefa atualizada!');
      
      setEditingTask(null); // Fecha o modal
      await fetchTasks(); // Atualiza a lista de tarefas
      return true; // Sinaliza sucesso
      
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      if (error.message !== 'Sessão expirada') {
        toast.error(error.message || 'Falha ao atualizar a tarefa.');
      }
      return false; // Sinaliza falha
    }
  };
  
  // O JSX (HTML com Tailwind) não muda em nada.
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header (Barra de Navegação) */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto flex max-w-4xl items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-blue-600">Minhas Tarefas</h1>
          <button
            onClick={logout}
            className="rounded bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
          >
            Sair
          </button>
        </nav>
      </header>

      {/* Conteúdo Principal (idêntico ao anterior) */}
      <main className="container mx-auto max-w-4xl p-4">
        
        {/* Formulário de "Criar Tarefa" */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Criar Nova Tarefa</h2>
          <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row sm:space-x-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="O que precisa de ser feito?"
              className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:mb-0"
            />
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Adicionar
            </button>
          </form>
        </div>

        {/* Lista de Tarefas */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">A Fazer</h2>
          {isLoading && <p>A carregar tarefas...</p>}
          
          {!isLoading && tasks.length === 0 && (
            <p className="text-gray-500">Nenhuma tarefa encontrada. Adicione uma!</p>
          )}

          <ul className="space-y-4">
            {tasks.map((task) => (
              <li 
                key={task.id} 
                className="flex flex-col items-start justify-between rounded-md border p-4 sm:flex-row sm:items-center"
              >
                {/* Título e Checkbox (AGORA COM DESCRIÇÃO) */}
  <div className="flex flex-1 items-start">
    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => handleToggleComplete(task)}
      className="mr-3 mt-1 h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
    />
    {/* Div para agrupar título e descrição */}
    <div className="flex-1">
      <span className={`text-lg ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
        {task.title}
      </span>
      
      {/* AQUI ESTÁ A ADIÇÃO:
          Renderiza o parágrafo SÓ SE task.description existir */}
      {task.description && (
        <p className="mt-1 text-sm text-gray-500">
          {task.description}
        </p>
      )}
    </div>
  </div>
  
  {/* Botões de Ação */}
  <div className="mt-4 flex space-x-2 sm:mt-0 sm:ml-4">
    <button
      onClick={() => setEditingTask(task)}
      className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
    >
      Editar
    </button>
    <button
      onClick={() => handleDeleteTask(task.id)}
      className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
    >
      Apagar
    </button>
  </div>
</li>
            ))}
          </ul>
        </div>
      </main>

      {/* RENDERIZA O MODAL DE EDIÇÃO FORA DO 'main' */}
      {/* Ele só será visível quando 'editingTask' não for 'null' */}
      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
};

export default DashboardPage;