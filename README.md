# Mini-Projeto Fullstack (Parte III) - Frontend Integrado

Este repositório contém o código-fonte da aplicação **Frontend** desenvolvida para a Parte III do Mini-Projeto Fullstack.

A aplicação é uma SPA (Single Page Application) construída em **React** que consome a API REST (desenvolvida nas etapas anteriores). Ela implementa um sistema completo de autenticação por JWT, telas públicas (Login/Cadastro) e uma área privada (Dashboard) para gerenciamento de tarefas (ou "items").

---

### 1. Vídeo de Demonstração (Até 3 min)

O vídeo abaixo demonstra todas as funcionalidades obrigatórias da aplicação, incluindo testes locais e em produção, fluxos de autenticação, feedbacks de erro/sucesso e o logout.

* **[Link para o seu Vídeo de Demonstração]**

### 2. Links da Aplicação (Frontend em Produção)

O mesmo código-fonte do frontend foi implantado duas vezes no Vercel, cada um apontando para um backend diferente:

* **🔗 Frontend (MongoDB):** **[https://express-jwt-backend.vercel.app/]**
* **🔗 Frontend (PostgreSQL):** **[https://express-jwt-backend-postgresql.vercel.app/]**

### 3. Links dos Repositórios (Código-Fonte)

* **Repositório Frontend (Este):** **[https://github.com/marialuizaqueiroz/frontend-mini-projeto-fullstack]**
* **Repositório Backend (MongoDB):** **[https://github.com/marialuizaqueiroz/express-jwt-backend-mongodb]**
* **Repositório Backend (PostgreSQL):** **[https://github.com/marialuizaqueiroz/express-jwt-backend-postgresql]**

---

## ✅ Funcionalidades Implementadas

Abaixo está um checklist de todas as funcionalidades obrigatórias da tarefa que foram implementadas:

### Telas Públicas
* [✅] **Tela de Cadastro:** Formulário com nome, e-mail e senha (`POST /register`).
* [✅] **Tela de Login:** Formulário com e-mail e senha (`POST /login`).
* [✅] **Armazenamento de Token:** O token JWT é salvo no `LocalStorage` após o login.
* [✅] **Redirecionamento:** O usuário é enviado para a área logada após o login.

### Telas Protegidas (Área Logada)
* [✅] **Rotas Protegidas:** A área logada só é acessível por usuários autenticados.
* [✅] **CRUD de Items:** Requisições (GET, POST, PUT, DELETE) para os endpoints da API, enviando o Token JWT no header `Authorization`.
* [✅] **Botão de Logout:** Remove o token do `LocalStorage` e redireciona para a tela de login.

### Requisitos Adicionais
* [✅] **Feedback Visual (Toasts):** Mensagens amigáveis de sucesso e erro são exibidas para todas as ações (`react-hot-toast`).
* [✅] **Feedback de Carregamento (Loading):** Indicadores de "loading" são exibidos durante as requisições HTTP.
* [✅] **Tratamento de Token Expirado:** Se a API retorna um erro `401 Unauthorized` (token inválido/expirado), o usuário é automaticamente deslogado e redirecionado para a tela de login.
* [✅] **Responsividade:** A aplicação é funcional em todos os tipos de dispositivos.

---

## 🛠️ Tecnologias Utilizadas

* **[React.js]** - Biblioteca principal para a UI.
* **[Vite]** - Ferramenta de build e servidor de desenvolvimento.
* **[TypeScript]** - Para tipagem estática do código.
* **[React Router DOM]** - Para gerenciamento de rotas (Login, Cadastro, Dashboard).
* **[Axios]** - Cliente HTTP para fazer requisições à API (incluindo *interceptors* para o Token).
* **[React Hot Toast]** - Para as notificações (toasts) de feedback.
* **[LocalStorage]** - Para persistência do token JWT no navegador.
* **[Vercel]** - Para deploy e hospedagem do frontend.

---

## 🚀 Como Executar Localmente

**Pré-requisitos:**
* Você deve ter o [Node.js](https://nodejs.org/en/) (v18+) instalado.
* Você deve ter o **Backend (API)** rodando localmente (ex: na porta `3000`).

**Passos:**

1.  **Clone este repositório:**
    ```bash
    git clone [LINK-DESTE-REPOSITORIO]
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd [NOME-DA-PASTA-DO-PROJETO]
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env.local` na raiz do projeto.
    * Adicione a variável de ambiente que aponta para sua API local. (O prefixo `VITE_` é obrigatório para o Vite).

    ```ini
    # .env.local
    VITE_API_BASE_URL=http://localhost:3000
    ```
    *(Altere `3000` para a porta em que seu backend está rodando)*

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

6.  Pronto! Abra [http://localhost:5173](http://localhost:5173) (ou a porta indicada no seu terminal) no seu navegador.

---

## ⚙️ Variáveis de Ambiente (Produção)

Para o deploy no Vercel, a seguinte variável de ambiente foi configurada na interface do projeto:

* `VITE_API_BASE_URL`: Aponta para a URL de produção do backend correspondente (MongoDB ou PostgreSQL).

---

## 🧑‍💻 Autor

Feito por **Maria Luiza Queiroz Rocha Lima e SIlva**

* **LinkedIn:** [https://www.linkedin.com/in/maria-luiza-queiroz-rocha-lima-e-silva/]
* **GitHub:** [https://github.com/marialuizaqueiroz]