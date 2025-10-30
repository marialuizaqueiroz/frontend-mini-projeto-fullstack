// Em src/components/EditTaskModal.tsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// A interface da Task (copiada do Dashboard para ter a tipagem)
interface Task {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: string;
}

interface EditTaskModalProps {
  task: Task | null; // A tarefa a ser editada (ou null se estiver fechado)
  onClose: () => void; // Função para fechar o modal
  onUpdate: (
    taskId: string,
    data: { title: string; description?: string }
  ) => Promise<boolean>; // Função que realmente chama a API
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para popular o formulário quando o modal é aberto
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || ''); // Usa string vazia se a descrição for null
    }
  }, [task]); // Depende da 'task'

  if (!task) {
    return null; // Se não há tarefa, não renderiza nada
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('O título não pode estar vazio.');
      return;
    }
    
    setIsLoading(true);
    const success = await onUpdate(task.id, {
      title,
      description,
    });
    setIsLoading(false);

    if (success) {
      onClose(); // Fecha o modal apenas se a atualização for bem-sucedida
    }
  };

  return (
    // Backdrop (fundo escuro)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Conteúdo do Modal */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">Editar Tarefa</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Campo Título */}
          <div className="mb-4">
            <label htmlFor="edit-title" className="mb-1 block font-medium text-gray-700">
              Título
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo Descrição */}
          <div className="mb-6">
            <label htmlFor="edit-description" className="mb-1 block font-medium text-gray-700">
              Descrição (Opcional)
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Adicione mais detalhes..."
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
            >
              {isLoading ? 'A salvar...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;