# README — Pasta data/

## O que tem aqui

- `acervo-minutas.json`: banco de dados estático do site, com todas as minutas disponíveis. É o "cérebro" do conteúdo do Ajuda Cidadão.

## Estrutura de cada minuta

| Campo | Obrigatório | O que é |
|---|---|---|
| `id` | Sim | Identificador único usado na URL (`documento.html?id=...`). Use apenas letras minúsculas, números e hífen. |
| `categoria` | Sim | Nome exato da categoria (usado nos filtros da Biblioteca). |
| `titulo` | Sim | Título do documento exibido no card e na página. |
| `resumo` | Sim | Explicação curta em linguagem simples ("para que serve"). |
| `onde_entregar` | Sim | Local físico ou digital para protocolar. |
| `documentos_anexos` | Sim | Lista de documentos que o cidadão precisa levar. |
| `arquivo_pdf` | Não | Caminho para PDF estático (placeholder por enquanto). |
| `arquivo_docx` | Não | Caminho para DOCX estático (placeholder por enquanto). |
| `texto_minuta` | Sim | Texto jurídico completo. Campos a preencher DEVEM estar entre colchetes. |

## Categorias atuais

- Saúde Pública
- Direitos do Consumidor
- Infraestrutura do Bairro
- Educação e Creches
- Habitação e Isenções
- Serviços Essenciais (nova — usada pela minuta `servicos-religacao-corte-indevido`)

## Regra de ouro dos colchetes

Qualquer texto entre `[COLCHETES]` no campo `texto_minuta` vira automaticamente um campo de formulário no site (motor em `js/documento.js`). Use sempre um nome claro e único. Exemplos: `[SEU NOME COMPLETO]`, `[NÚMERO DO CPF]`.

- Se o mesmo colchete aparecer duas vezes no texto, o motor cria **um único** input e substitui em todos os lugares.
- Evite colchetes com instruções condicionais ("se já pagou, inclua..."). Prefira um único campo com a instrução clara dentro dele.
- Cada colchete deve corresponder a uma informação que o cidadão realmente tem em mãos.

## Como adicionar uma nova minuta

1. Abra `acervo-minutas.json`.
2. Adicione um novo objeto dentro do array `"minutas"`, seguindo a estrutura acima.
3. Preencha todos os campos.
4. Use colchetes no `texto_minuta` para os campos que o cidadão deve preencher.
5. Salve o arquivo.
6. Teste no site (com Live Server ou GitHub Pages — abrir o HTML com duplo clique não funciona por causa do `fetch()`).

## Observações

- Os campos `arquivo_pdf` e `arquivo_docx` são placeholders. Por enquanto, o site gera o documento via impressão do navegador (`@media print`). No futuro, podem apontar para PDFs/DOCX estáticos na pasta `assets/`.
- Não use comentários no JSON (não é permitido pela sintaxe). Use este README para documentar.
- Toda minuta nova deve passar pelo ritual de teste da seção 11 do Alfa: preencher, imprimir e verificar se a folha A4 sai limpa.