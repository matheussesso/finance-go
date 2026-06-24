# FinanceGo 🚀

Um sistema moderno de controle de Finanças Pessoais construído com **Go (Golang)** no Backend e **React + Vite** no Frontend.

## Estrutura do Projeto

- `/backend`: API RESTful construída em Go com Clean Architecture (Handlers, Services, Repositories).
- `/frontend`: Interface reativa em React, estilizada com TailwindCSS.
- `/docs`: Documentação detalhada da arquitetura, schemas de banco e guias para desenvolvedores.
- `docker-compose.yml`: Infraestrutura do banco de dados MariaDB.

---

## Como Executar e Testar a Aplicação

Para rodar a aplicação simulando um ambiente real de produção, nós unificamos o **Banco de Dados (MariaDB)** e a **API Backend (Go)** no Docker. Siga os passos abaixo:

### Passo 1: Subir o Backend e Banco de Dados
Na raiz do projeto, execute o comando mágico do Docker Compose:
```bash
docker compose up -d --build
```
*(Ele vai baixar o banco de dados e compilar a imagem minúscula e ultrarrápida do Go na hora. A API ficará disponível na porta 8080).*

### Passo 2: Iniciar o Frontend (React)
Abra o seu terminal (apenas 1 é necessário agora!), entre na pasta do frontend e inicie a interface localmente:
```bash
cd frontend
npm run dev
```
O console mostrará uma URL (geralmente `http://localhost:5173`). Abra no navegador.

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
