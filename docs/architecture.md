# Arquitetura do Sistema

A aplicação de Finanças Pessoais foi desenhada separando o Frontend (React) do Backend (API REST Go), permitindo escalabilidade e manutenção independente de cada camada.

## Backend (Go API)
Utilizamos uma arquitetura inspirada em **Clean Architecture** e conceitos de Domain-Driven Design (DDD), adaptada para Go. Isso garante que a lógica de negócios não dependa de frameworks web ou bancos de dados específicos.

A estrutura de pacotes é:
- `cmd/api`: Ponto de entrada da aplicação. Inicializa configurações, banco de dados e servidor HTTP.
- `internal/domain`: Entidades core do negócio (User, Block, Item) e contratos de interfaces (Repositories). Nenhuma dependência externa reside aqui.
- `internal/repository`: Implementação de persistência de dados. Onde o GORM atua.
- `internal/service`: Contém toda a regra de negócio e cálculos financeiros.
- `internal/handler`: Os Controladores HTTP. Recebem requisições JSON, interagem com os `Services` e respondem em JSON padronizado.

## Frontend (React + Vite)
- Interface reativa SPA (Single Page Application).
- Comunicação direta via chamadas HTTP (Fetch) para a API.
- Estilização premium e utilitária focada em Tailwind CSS.
- Gerenciamento de estado localizado (via Context API/Hooks) para manipulação dos blocos financeiros em tempo real.
