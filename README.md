# FinanceGo 🚀

Um sistema moderno de controle de Finanças Pessoais construído com **Go (Golang)** no Backend e **React + Vite** no Frontend.

## Estrutura do Projeto

- `/src/backend`: API RESTful construída em Go com Clean Architecture (Handlers, Services, Repositories).
- `/src/frontend`: Interface reativa em React, estilizada com TailwindCSS.
- `/docs`: Documentação detalhada da arquitetura, schemas de banco e guias para desenvolvedores.
- `docker-compose.yml`: Infraestrutura de Produção/Dev simulada contendo Banco, Backend e Frontend.

---

## Como Executar e Testar a Aplicação

Para rodar a aplicação simulando um ambiente real de produção, nós unificamos **toda a Stack** (Banco de Dados, Backend API, e Frontend Web) no Docker. Siga os passos abaixo:

### Passo 1: Subir Toda a Aplicação
Na raiz do projeto, certifique-se que você tenha o Docker rodando e execute o comando mágico do Docker Compose:
```bash
docker compose up -d --build
```
*(Ele vai baixar o banco de dados, compilar a imagem minúscula e ultrarrápida do Go na hora, além de fazer o build do React para rodar no NGINX. Tudo de uma vez só!)*

### Passo 2: Acessar no Navegador
Pronto! Com apenas um comando, tudo está no ar. Não é mais necessário rodar o NPM separadamente. 
Abra no navegador a URL do Frontend:
👉 **[http://localhost:5173](http://localhost:5173)**

*(Nota: O backend da API está rodando exposto na porta `8080` e o banco MariaDB na porta `3306`.)*

---

## Como Testar a Plataforma

1. Na tela inicial de **Login**, clique em *"Ainda não tem conta? Registre-se"*.
2. Insira seu Nome, E-mail e crie uma senha para registrar um usuário. O login será feito automaticamente logo em seguida.
3. No **Dashboard**, experimente:
   - Criar novos "Blocos" (ex: *Contas de Casa*, *Dívidas Banco*).
   - Adicionar "Itens" dentro de cada bloco informando valor e descrição.
   - Apagar itens e observar o valor **Total** ser recalculado automaticamente.
   - Navegar pelo calendário.

### Dica para Entender o Backend (Go)
Se quiser visualizar a lógica por trás da API, confira o guia explicativo feito sob medida para programadores PHP na pasta `docs/go_for_php_developers.md`. Lá você verá como as famosas *Classes* e *Controllers* do Laravel foram traduzidas para o Golang!
