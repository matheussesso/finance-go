# Guia de Estrutura do Frontend (React + Tailwind)

A interface reativa será desenvolvida utilizando **Vite** para empacotamento rápido e **React** para componentes lógicos.

## Componentização
Para manter o design escalável:
- `/src/components`: Componentes reutilizáveis como `Button`, `Input`, `CardBlock`, `ItemRow`.
- `/src/pages`: Views principais inteiras (ex: `Login.jsx`, `Dashboard.jsx`).
- `/src/services`: Funções de `fetch` isoladas para a chamada limpa à API Go.

## Estilização (TailwindCSS)
Toda a estilização utiliza classes utilitárias. O foco do design:
- Uso do Tailwind de forma semântica e limpa.
- **Micro-animações**: Hover e transições usando utilitários nativos como `transition-all duration-300 hover:scale-105`.
- Cores de marca em `/tailwind.config.js`.

## Gerenciamento de Estado
Para esse aplicativo as finanças não necessitam (inicialmente) de bibliotecas robustas de gerência como Redux:
- Uso de `useState` para inputs isolados.
- Uso de Context API (`AuthContext`) para guardar o JWT Token entre telas.
- Uso do bloco principal de estado da tela Dashboard contendo um Array de `Blocks` recarregados via a API após alterações.
