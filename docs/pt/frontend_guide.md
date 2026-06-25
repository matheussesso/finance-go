# Guia de Estrutura do Frontend (React + Tailwind)

A interface reativa foi desenvolvida utilizando **Vite** para empacotamento rápido e **React** para componentes lógicos, rodando de forma estável no NGINX via Docker.

## Layout e UX
Adotamos uma abordagem moderna de **Dashboard Unificado**.
- **Calendário e Lista Juntos:** O usuário não precisa mais transitar entre visualizações. O calendário atua como um Sidebar/Widget (na coluna direita), e a lista de `Blocos` na área principal (esquerda), aproveitando de forma limpa as colunas do Tailwind CSS.
- **Micro-interações:** Toda a UI possui transições com `transition-colors`, `hover:bg` e efeitos rápidos (ex: opacidade no botão "Novo Item" dentro do calendário).

## Modais para Entrada de Dados
Substituímos formulários estáticos na tela principal por **Modais**:
- Arquitetura de `Portal` em React ou estado condicional, garantindo que as ações de *Criação de Bloco* ou *Adição de Item* se sobreponham na tela com fundo de desfoque (`backdrop-blur`).
- Foram implementados componentes focados: `BlockFormModal` e `ItemFormModal`.

## Documentação
- **Padrões JSDoc:** Todos os arquivos `.js` e `.jsx` devem incluir **comentários JSDoc** compreensivos em inglês. Esses comentários explicam o que cada componente ou arquivo faz, seus parâmetros e tipos de retorno.

## Componentização Lógica
Para manter o design escalável, o projeto usa:
- `/src/components`: Componentes reutilizáveis focados e independentes como `Modal`, `BlockFormModal`, `ItemFormModal`, `CalendarView`.
- `/src/pages`: Views principais agregadoras (ex: `Login.jsx`, `Dashboard.jsx`).
- `/src/services`: Funções de `axios` com interceptors centralizados (injetando o Bearer token JWT e tratando requests para a API).

## Estilização (TailwindCSS)
Toda a estilização utiliza classes utilitárias no próprio JSX. O foco do design:
- Uso do Tailwind de forma semântica e limpa (`rounded-md`, `border-gray-200`, `shadow-sm`).
- **Dark Mode**: Todo componente da plataforma possui suporte para o prefixo `dark:`.
- Cores dinâmicas injetadas diretamente na classe de acordo com lógicas (ex: `bg-emerald-100` vs `bg-rose-100`).

## Gerenciamento de Estado
Para esse aplicativo as finanças não necessitam (inicialmente) de bibliotecas robustas de gerência como Redux:
- Uso pesado de `useState` e `useEffect` para carregar a lista base do Planejamento ativo (Plannings e seus Blocos correspondentes).
- Uso de **Context API (`AuthContext`)** para checar a sessão do usuário e guardar o JWT Token entre todas as telas.
- Requisições feitas via camada de serviço recarregam a UI e fecham modais de forma reativa.
