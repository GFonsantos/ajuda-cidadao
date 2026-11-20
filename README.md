# 🏛️ Ajuda Cidadão

**Biblioteca Aberta de Modelos, Minutas e Orientação em Linguagem Simples**

O **Ajuda Cidadão** é um projeto acadêmico de extensão universitária focado em inclusão digital e acesso à justiça. O site oferece uma plataforma web estática e de acesso aberto onde qualquer cidadão pode encontrar, preencher e imprimir documentos formais (requerimentos, ofícios, contestações, contratos) sem precisar de intermediários ou entender de "juridiquês".

## 🎯 O Problema que Resolvemos

Muitos cidadãos deixam de ter seus direitos atendidos porque não sabem como redigir um documento formal para protocolar em órgãos públicos ou empresas. O Ajuda Cidadão elimina essa barreira ao fornecer modelos prontos e um sistema inteligente que monta o documento para o usuário em tempo real.

## ✨ Principais Recursos

- **Motor de Formulário Dinâmico:** O JavaScript lê os campos `[ENTRE COLCHETES]` do arquivo JSON e constrói o formulário automaticamente. Não é preciso programar uma tela para cada documento novo.
- **Máscaras Inteligentes:** Formatação em tempo real de CPF, CNPJ, Datas, Telefones e CEP, além de conversão automática para CAIXA ALTA em documentos oficiais.
- **Impressão Limpa (A4):** Regras de `@media print` que escondem o site (menus, formulários e botões) e formatam o documento final perfeito para ser impresso ou salvo em PDF.
- **Mega Menu Categorizado:** Navegação full-width expansível para suportar o crescimento do acervo.
- **Acessibilidade Universal (WCAG 2.1):** Botões nativos de aumento de fonte, alto contraste, navegação por teclado e semântica HTML5 compatível com leitores de tela.

## 🛡️ Nossos Pilares

1. **Privacy-by-Design (Privacidade por Princípio):** O site não possui banco de dados, login ou cookies de rastreamento. Nenhum dado sensível do usuário trafega pela rede. O cidadão preenche os dados e o documento é gerado localmente no próprio aparelho (client-side).
2. **Linguagem Simples:** Todos os documentos são acompanhados de explicações claras sobre "para que serve", "quem tem direito" e "onde entregar".
3. **Arquitetura Leve (Jamstack):** Construído com HTML, CSS, JavaScript puro (Vanilla) e JSON estático. Carregamento ultrarrápido mesmo em conexões 3G, com custo zero de hospedagem.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica.
- **CSS3:** Design responsivo (Mobile-First), variáveis, CSS Grid, Flexbox e regras de impressão.
- **JavaScript (Vanilla):** Manipulação de DOM, Regex para criação de formulários, Intersection Observer para animações e lógica de filtragem.
- **JSON:** Banco de dados estático.

## 📁 Estrutura do Projeto

O projeto segue o padrão de arquitetura atômica, separando responsabilidades por arquivo para facilitar a manutenção:

```text
ajuda-cidadao/
│
├── index.html                  # Página 1: Home e Busca Rápida
├── biblioteca.html             # Página 2: Catálogo com Filtros
├── documento.html              # Página 3: Formulário Inteligente e Impressão
├── guia-protocolo.html         # Página 4: Manual de Como Protocolar
├── sobre.html                  # Página 5: Manifesto Acadêmico e Privacidade
├── Alfa.txt                    # Documentação mestre de continuidade do projeto
├── README.md                   # Este arquivo
│
├── /css
│   ├── variaveis.css           # Tokens de cores e tipografia
│   ├── base.css                # Reset e acessibilidade (.sr-only)
│   ├── layout.css              # Estrutura de grid e header/footer
│   ├── componentes.css         # Botões, inputs, cards e Mega Menu
│   ├── home.css                # Estilos da Home e animações
│   ├── biblioteca.css          # Estilos do Catálogo
│   ├── documento.css           # Layout do formulário e regras de impressão
│   └── guia-sobre.css          # Estilos das páginas textuais
│
├── /js
│   ├── app.js                  # Controle de acessibilidade (A+, A-, Contraste)
│   ├── menu.js                 # Controle do Mega Menu e link ativo
│   ├── home.js                 # Redirecionamento da busca
│   ├── biblioteca.js           # Filtros e renderização do catálogo
│   ├── mascaras.js             # Formatação de inputs em tempo real
│   ├── documento.js            # Motor de preenchimento (Regex e injeção)
│   └── animacoes.js            # Scroll Reveal (Intersection Observer)
│
├── /data
│   └── acervo-minutas.json     # Base estática com o texto e metadados
│
└── /assets
    ├── /icons                  # Logotipo e ícones
    └── /modelos-pdf            # (Opcional) PDFs estáticos