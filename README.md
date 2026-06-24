# FinanceGo 🚀

Um sistema moderno de controle de Finanças Pessoais construído com **Go (Golang)** no Backend e **React + Vite** no Frontend.

## Estrutura do Projeto

- `/backend`: API RESTful construída em Go com Clean Architecture (Handlers, Services, Repositories).
- `/frontend`: Interface reativa em React, estilizada com TailwindCSS.
- `/docs`: Documentação detalhada da arquitetura, schemas de banco e guias para desenvolvedores.
- `docker-compose.yml`: Infraestrutura do banco de dados MariaDB.

---

## Como Executar e Testar a Aplicação

Para ver a aplicação funcionando por completo na sua máquina, você precisará de três terminais rodando simultaneamente (um para o banco de dados, um para a API e um para o Frontend).

### Passo 1: Subir o Banco de Dados (MariaDB)
Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute o comando para iniciar o banco em segundo plano:
```bash
docker compose up -d
```
*(Certifique-se de que o Docker esteja aberto e rodando no seu computador).*

### Passo 2: Iniciar a API Backend (Go)
Abra um novo terminal, entre na pasta do backend e inicie o servidor:
```bash
cd backend
go run cmd/api/main.go
```
Você verá uma mensagem no console dizendo: `🚀 Servidor Go rodando na porta :8080`.
Neste exato momento, o Go se conectará ao MariaDB e criará todas as tabelas (User, Block, Item) automaticamente (AutoMigrate).

### Passo 3: Iniciar o Frontend (React)
Abra um terceiro terminal, entre na pasta do frontend e inicie a interface:
```bash
cd frontend
npm run dev
```
O console mostrará uma URL (geralmente `http://localhost:5173`). 

---

## Como Testar a Plataforma

1. Clique na URL gerada pelo frontend (ex: `http://localhost:5173`) e abra no seu navegador.
2. Na tela inicial de **Login**, clique em *"Ainda não tem conta? Registre-se"*.
3. Insira seu Nome, E-mail e crie uma senha para registrar um usuário. O login será feito automaticamente logo em seguida.
4. No **Dashboard**, experimente:
   - Criar novos "Blocos" (ex: *Contas de Casa*, *Dívidas Banco*).
   - Adicionar "Itens" dentro de cada bloco informando valor e descrição.
   - Apagar itens e observar o valor **Total** ser recalculado automaticamente.

### Dica para Entender o Backend (Go)
Se quiser visualizar a lógica por trás da API, confira o guia explicativo feito sob medida para programadores PHP na pasta `docs/go_for_php_developers.md`. Lá você verá como as famosas *Classes* e *Controllers* do Laravel foram traduzidas para o Golang!
