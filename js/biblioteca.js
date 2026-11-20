/* ================================================================
   BIBLIOTECA — LÓGICA DE FILTRO E RENDERIZAÇÃO
   
   O que faz: Carrega o acervo-minutas.json, renderiza os cartões,
              aplica filtros por categoria e busca por palavra-chave.
              Lê os parâmetros da URL (?q= e ?cat=) para integração
              com a Home.
   Depende de: data/acervo-minutas.json, DOM de biblioteca.html.
   Mexe em: DOM (#lista-resultados, #campo-busca, #botoes-filtro).
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const listaResultados = document.getElementById('lista-resultados');
  const campoBusca = document.getElementById('campo-busca');
  const botoesFiltro = document.querySelectorAll('.filtro-btn');

  let todasAsMinutas = [];
  let termoBusca = '';
  let categoriaAtiva = 'todos';

  // 1. Carregar os dados do JSON
  async function carregarDados() {
    try {
      const resposta = await fetch('data/acervo-minutas.json');
      const dados = await resposta.json();
      todasAsMinutas = dados.minutas;

      // Lê os parâmetros da URL (vindos da Home)
      const urlParams = new URLSearchParams(window.location.search);
      const qParam = urlParams.get('q');
      const catParam = urlParams.get('cat');

      if (qParam) {
        termoBusca = qParam.toLowerCase();
        campoBusca.value = qParam;
      }
      if (catParam) {
        // Mapeia a URL curta para o nome exato da categoria no JSON
        const mapaCat = {
          'saude': 'Saúde Pública',
          'consumidor': 'Direitos do Consumidor',
          'bairro': 'Infraestrutura do Bairro',
          'educacao': 'Educação e Creches',
          'habitacao': 'Habitação e Isenções'
        };
        if (mapaCat[catParam]) {
          categoriaAtiva = mapaCat[catParam];
          // Atualiza o botão visualmente
          botoesFiltro.forEach(btn => {
            btn.classList.toggle('ativo', btn.dataset.cat === categoriaAtiva);
          });
        }
      }

      renderizarMinutas();
    } catch (erro) {
      console.error('Erro ao carregar o acervo:', erro);
      listaResultados.innerHTML = '<p class="carregando">Ocorreu um erro ao carregar os modelos. Tente recarregar a página.</p>';
    }
  }

  // 2. Renderizar os cartões na tela
  function renderizarMinutas() {
    listaResultados.innerHTML = ''; // Limpa a área

    // Filtra a lista com base na categoria e no termo de busca
    const minutasFiltradas = todasAsMinutas.filter(minuta => {
      const matchCategoria = categoriaAtiva === 'todos' || minuta.categoria === categoriaAtiva;
      const matchTermo = minuta.titulo.toLowerCase().includes(termoBusca) || 
                         minuta.resumo.toLowerCase().includes(termoBusca) ||
                         minuta.categoria.toLowerCase().includes(termoBusca);
      return matchCategoria && matchTermo;
    });

    // Se não encontrar nada, avisa o usuário
    if (minutasFiltradas.length === 0) {
      listaResultados.innerHTML = '<p class="carregando">Nenhum modelo encontrado para esta busca. Tente outros termos.</p>';
      return;
    }

    // Cria o HTML de cada card
    minutasFiltradas.forEach(minuta => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <span class="card-tag">${minuta.categoria}</span>
        <h3>${minuta.titulo}</h3>
        <p>${minuta.resumo}</p>
        <a href="documento.html?id=${minuta.id}" class="btn-card">Abrir e Baixar Modelo</a>
      `;
      listaResultados.appendChild(card);
    });
  }

  // 3. Evento de digitação na busca (filtra em tempo real)
  campoBusca.addEventListener('input', (e) => {
    termoBusca = e.target.value.toLowerCase();
    renderizarMinutas();
  });

  // 4. Evento de clique nos botões de categoria
  botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
      // Remove a classe "ativo" de todos e adiciona no clicado
      botoesFiltro.forEach(b => b.classList.remove('ativo'));
      botao.classList.add('ativo');

      // Atualiza a categoria ativa e renderiza
      categoriaAtiva = botao.dataset.cat;
      renderizarMinutas();
    });
  });

  // Inicia a mágica
  carregarDados();
});