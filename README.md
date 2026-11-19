# 🏛️ Ajuda Cidadão

**Biblioteca Aberta de Modelos, Minutas e Orientação em Linguagem Simples**

O **Ajuda Cidadão** é um projeto acadêmico de extensão universitária focado em inclusão digital e acesso à justiça. O site oferece uma plataforma web estática e de acesso aberto onde qualquer cidadão pode encontrar, preencher e imprimir documentos formais (requerimentos, ofícios, contestações) sem precisar de intermediários ou entender de "juridiquês".

## 🎯 O Problema que Resolvemos

Muitos cidadãos deixam de ter seus direitos atendidos porque não sabem como redigir um documento formal para protocolar em órgãos públicos ou empresas. O Ajuda Cidadão elimina essa barreira ao fornecer modelos prontos e um sistema inteligente que preenche o documento para o usuário.

## 🛡️ Nossos Pilares

1. **Privacy-by-Design (Privacidade por Princípio):** O site não possui banco de dados, login ou cookies de rastreamento. Nenhum dado sensível do usuário trafega pela rede. O cidadão preenche os dados e o documento é gerado localmente no próprio aparelho (client-side).
2. **Linguagem Simples:** Todos os documentos são acompanhados de explicações claras sobre "para que serve", "quem tem direito" e "onde entregar".
3. **Arquitetura Leve (Jamstack):** Construído com HTML, CSS, JavaScript puro e JSON estático. Carregamento ultrarrápido mesmo em conexões 3G, com custo zero de hospedagem.
4. **Acessibilidade Universal (WCAG 2.1):** Botões nativos de aumento de fonte, alto contraste, navegação por teclado e semântica HTML5 compatível com leitores de tela.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica.
- **CSS3:** Design responsivo (Mobile-First), variáveis de ambiente, CSS Grid, Flexbox e regras de `@media print` para impressão limpa.
- **JavaScript (Vanilla):** Motor de formulário dinâmico, aplicação de máscaras em tempo real (CPF, CNPJ, Datas, Telefones), manipulação de DOM e lógica de filtragem.
- **JSON:** Banco de dados estático para armazenamento das minutas.
- **GitHub:** Versionamento de código.

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
│
├── /css
│   ├── variaveis.css           # Tokens de cores e tipografia
│   ├── base.css                # Reset e acessibilidade
│   ├── layout.css              # Estrutura de grid e header/footer
│   ├── componentes.css         # Botões, inputs e cards
│   ├── home.css                # Estilos específicos da Home
│   ├── biblioteca.css          # Estilos do Catálogo
│   ├── documento.css           # Layout do formulário e regras de impressão
│   └── guia-sobre.css          # Estilos das páginas textuais
│
├── /js
│   ├── app.js                  # Controle de acessibilidade (A+, A-, Contraste)
│   ├── home.js                 # Redirecionamento da busca
│   ├── biblioteca.js           # Filtros e renderização do catálogo
│   ├── mascaras.js             # Formatação de inputs em tempo real
│   └── documento.js            # Motor de preenchimento e injeção de dados
│
├── /data
│   └── acervo-minutas.json     # Base estática com o texto e metadados
│
└── /assets
    ├── /icons                  # Ícones em SVG e logotipo
    └── /modelos-pdf            # (Opcional) PDFs estáticos