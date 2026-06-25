# Arquitetura do Sistema e Infraestrutura

A aplicação FinanceGo foi desenhada separando rigorosamente o Frontend (React) do Backend (API REST Go). Isso garante alta escalabilidade, testes independentes e um workflow de manutenção limpo. Tudo é orquestrado de maneira transparente utilizando **Docker**.

## 🚀 Infraestrutura (Docker All-in-One)
Todo o projeto é projetado para rodar em produção e desenvolvimento usando contêineres:

1. **MariaDB (`mariadb`)**: Banco de dados relacional. Persiste os dados de maneira segura através de volumes do Docker.
2. **Backend API (`api-go-backend`)**: Roda nossa imagem ultra-leve e compilada em Go nativo na porta 8080.
3. **Frontend SPA (`api-go-frontend`)**: Interface encapsulada no **NGINX**, garantindo performance máxima para o carregamento estático.

## ⚙️ Backend (Go API)
Utilizamos uma arquitetura inspirada em **Clean Architecture** e conceitos de Domain-Driven Design (DDD), adaptada para Go. Isso garante que a lógica de negócios não dependa de frameworks web ou bancos de dados específicos.

**Estrutura de pacotes:**
- `cmd/api`: Ponto de entrada da aplicação. Inicializa configurações, conecta ao banco e sobe o servidor HTTP.
- `internal/domain`: Entidades "core" do negócio (`User`, `Planning`, `Block`, `Item`) e contratos de interfaces (`Repositories`). Nenhuma dependência externa entra aqui.
- `internal/repository`: A implementação concreta da persistência de dados. É aqui que o ORM (GORM) atua mapeando o código para SQL.
- `internal/service`: Contém toda a regra de negócio, cálculos financeiros, e tratamentos de autorização.
- `internal/handler`: A camada web (Controllers HTTP). Recebe a requisição (JSON), traduz para o `Service` processar, e responde utilizando um padrão JSON fixo.

**Build Multi-stage do Backend:** O `Dockerfile` dele usa a imagem do Golang apenas para "compilar" o código. Depois copia o binário (`.exe` de linux) final para uma imagem `alpine` minúscula. O código fonte **nunca** vai para a produção, apenas a máquina já compilada!

## 🎨 Frontend (React + Vite)
- Interface reativa SPA (Single Page Application).
- Comunicação direta via chamadas HTTP assíncronas (Axios/Fetch) para a API Go.
- Estilização premium e utilitária focada em **Tailwind CSS**.
- Gerenciamento de estado localizado (via Context API/Hooks) para manipulação dos blocos financeiros e calendário em tempo real.

**Build Multi-stage do Frontend:** O `Dockerfile` usa o Node.js apenas no primeiro estágio para rodar o comando `npm run build` e empacotar o React. O código HTML, CSS e JS gerado (`/dist`) é então passado para a imagem final do **NGINX**. Com isso não rodamos Node em produção para o React, apenas um servidor web estático super rápido, ouvindo na porta 80 e roteado para a `5173` do Host.
