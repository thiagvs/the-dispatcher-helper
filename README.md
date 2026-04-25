# ✈️ The Dispatcher Helper - 2026

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

O **The Dispatcher Helper** é uma ferramenta especializada desenvolvida para auxiliar despachantes operacionais de voo (DOVs) e equipes de solo no cálculo preciso de distribuição de carga e bagagem em aeronaves comerciais.

## 🚀 Funcionalidades Principais

* **Cálculo Automatizado por Aeronave**: Algoritmos específicos para as frotas:
    * **Boeing 737-800**: Balanceamento 50/50 entre H2 e H3 com suporte a H1 Heavy.
    * **Airbus A319/A320/A321**: Regras customizadas de porões (H1 a H5) respeitando limites de peso e quantidade de peças.
* **Gestão de Cargas Especiais**: Interface intuitiva para adicionar itens como **WCMP** (Cadeiras de rodas), **AVIH** (Animais no porão) e **WCLB**, permitindo a escolha dinâmica do porão de destino.
* **Sistema de "Subtrair e Distribuir"**: Lógica avançada que desconta o peso de cargas especiais dos limites do porão antes de distribuir as bagagens comuns, garantindo que nenhum limite de segurança seja ultrapassado.
* **Conferência em Tempo Real (Final Check)**: Validador automático que compara a soma das peças e pesos alocados com os dados brutos inseridos, exibindo um status visual de aprovação (✅).
* **Interface Mobile-First**: Design otimizado para uso em tablets e smartphones, com menu de navegação fixo e footer inteligente.

## 🛠️ Tecnologias Utilizadas

* **Frontend**: React.js com TypeScript para tipagem robusta.
* **Estilização**: Tailwind CSS para um layout moderno e dark mode nativo.
* **Navegação**: React Router para transição suave entre abas (Carregamento, Dicas, Contatos, Direitos).
* **Componentes**: Material UI (MUI) para elementos de navegação complexos.

## 📐 Lógica de Cálculo de Peso

O projeto utiliza uma hierarquia de cálculos para evitar erros de arredondamento:
1.  **Peso Médio**: Calculado com base na bagagem líquida.
2.  **Alocação por Prioridade**: Preenchimento sequencial de porões conforme a regra da companhia.
3.  **Fiel da Balança**: O último porão da sequência absorve a diferença matemática, garantindo que o Peso Bruto Total bata 100% com o inserido.

## 📱 Layout

O projeto conta com um layout adaptativo:
* **Header**: Identificação do voo e aeronave.
* **Main**: Área de scroll contendo as tabelas de distribuição e campos de input.
* **Navigator**: Menu inferior fixo para acesso rápido às funcionalidades.
