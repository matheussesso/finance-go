<h1 align="center">FinanceGo </h1>

<p align="center">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white" alt="MariaDB" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
</p>

> Um sistema moderno, rápido e escalável para controle de Finanças Pessoais, idealizado para gerenciar **Planejamentos Mensais** e **Blocos Financeiros**. 
> O diferencial deste projeto é sua forte arquitetura baseada em **Clean Architecture (Go)** aliada a uma interface SPA de alto nível construída com **React** e **TailwindCSS**.

<p align="center">
  <b> Idiomas:</b> 
  <a href="README.md">Português</a> | 
  <a href="../../README.md">English</a> | 
  <a href="../es/README.md">Español</a>
</p>

---

## Screenshots
*(Substitua estas imagens pelo link das imagens após subir o repositório no GitHub)*

> `[ Insira um screenshot do Dashboard aqui ]`
>
> `[ Insira um screenshot do fluxo de Modal / Calendário aqui ]`

---

## Estrutura do Projeto

A stack é dividida rigorosamente entre Frontend e Backend, orquestrada via Docker.

- `/src/backend`: API RESTful construída em **Go (Golang)**. Segue o padrão MVC estendido (Clean Architecture, Repositories, Services e Handlers).
- `/src/frontend`: Interface reativa em **React** + **Vite**. Componentizada com UI limpa, Dark/Light mode nativo (Tailwind) e client-side routing.
- `/docs`: Documentação avançada (Schemas do Banco, Endpoints, Guias de transição PHP -> Go).
- `docker-compose.yml`: Infraestrutura All-in-One (MariaDB, API e Frontend NGINX).

---

## Como Executar e Testar a Aplicação

Para rodar a aplicação simulando um ambiente real de produção (Multi-stage builds), nós unificamos **toda a Stack** no Docker. Siga os passos abaixo:

### Passo Único: Subir Toda a Arquitetura
Na raiz do projeto, certifique-se que você tenha o Docker instalado e rodando. Execute o comando mágico do Docker Compose:

```bash
docker compose up -d --build
```
> O Docker fará o download do MariaDB, compilará o binário minúsculo e ultrarrápido do Go para o backend, e fará o build do React para ser servido via NGINX. Tudo de uma vez!

### Acessar no Navegador
Pronto! Com apenas um comando, tudo está no ar. Abra no seu navegador a URL do Frontend:
 **[http://localhost:5173](http://localhost:5173)**

*(Nota: Internamente, o backend da API está rodando exposto na porta `8080` e o banco MariaDB na porta `3306`.)*

---

## Features Principais

1. **Gestão de Planejamentos Múltiplos:** Crie e navegue por planejamentos diferentes com base no Mês/Ano.
2. **Dashboard Unificado e Interativo:** O calendário e a lista de blocos (Entradas/Saídas) convivem na mesma tela, exibindo o balanço global automaticamente.
3. **Sistema de Modais Elegantes:** Criação rápida de Blocos Financeiros (ex: *Contas Fixas, Lazer, Salário*) e Itens dentro dos blocos.
4. **Segurança por JWT:** Autenticação robusta para proteger seus dados via headers `Bearer`.
5. **Dark Mode Suportado:** O design responde perfeitamente entre os modos Claro e Escuro.
6. **Suporte Multilíngue (i18n):** Total compatibilidade com Inglês, Espanhol e Português, facilmente alterável via interface.

---

## Documentação Adicional (Dev)

Se você é desenvolvedor e deseja entender melhor a arquitetura ou o banco de dados, explore os arquivos da pasta `/docs`:
- [Guia Rápido: Go para Devs PHP (Laravel/Codeigniter)](docs/pt/go_for_php_developers.md)
- [Arquitetura do Sistema e Docker](architecture.md)
- [Documentação de Endpoints da API](api_endpoints.md)
- [Diagrama e Schema do Banco de Dados](database_schema.md)
- [Guia do Frontend](frontend_guide.md)

---

## Como Contribuir

1. Faça o **Fork** do repositório.
2. Crie uma branch para a sua feature: `git checkout -b minha-feature`.
3. Faça o commit de suas alterações: `git commit -m 'feat: Adiciona nova funcionalidade X'`.
4. Faça o push para a branch: `git push origin minha-feature`.
5. Abra um **Pull Request**.

---

## Licença
Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
