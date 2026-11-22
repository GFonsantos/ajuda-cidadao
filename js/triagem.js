/* ================================================================
   TRIAGEM — MOTOR DO ASSISTENTE (WIZARD)
   
   O que faz: Lê o arquivo triagem.json, renderiza as perguntas em formato
              de grade (com ícones) ou lista editorial, guarda o histórico
              de navegação e redireciona para a minuta correta.
   Depende de: data/triagem.json, DOM de index.html
   Mexe em: DOM (#conteudo-triagem)
   ================================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const containerTriagem = document.getElementById('conteudo-triagem');
  if (!containerTriagem) return;

  let dadosTriagem = null;
  let passoAtual = 'inicio';
  let historico = [];

  const icones = {
    loja: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    energia: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    saude: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>',
    prefeitura: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>',
    escudo: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    documento: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
  };

  try {
    const resposta = await fetch('data/triagem.json');
    dadosTriagem = await resposta.json();
    renderizarPasso(passoAtual);
  } catch (erro) {
    console.error('Erro ao carregar a triagem:', erro);
    containerTriagem.innerHTML = '<p>O assistente está indisponível no momento. Use a busca acima.</p>';
  }

  function renderizarPasso(idPasso) {
    const passo = dadosTriagem[idPasso];
    const isGrid = passo.opcoes.some(op => op.icone);
    
    // Altera a classe do container dependendo do tipo de tela
    const divOpcoesClass = isGrid ? 'triagem-grid' : 'triagem-lista';

    containerTriagem.innerHTML = `
      <h3 class="triagem-pergunta" aria-live="polite">${passo.pergunta}</h3>
      <div class="${divOpcoesClass}"></div>
    `;
    
    const containerOpcoes = containerTriagem.querySelector(`.${divOpcoesClass}`);

    passo.opcoes.forEach(opcao => {
      const btn = document.createElement('button');
      
      if (isGrid) {
        btn.className = 'btn-grid';
        btn.innerHTML = `
          <div class="btn-grid-icone">${icones[opcao.icone] || ''}</div>
          <div class="btn-grid-conteudo">
            <h4>${opcao.texto}</h4>
            <p>${opcao.descricao}</p>
          </div>
        `;
      } else {
        // NOVO VISUAL EDITORIAL (Segunda imagem)
        btn.className = 'btn-lista';
        btn.innerHTML = `
          <div class="btn-lista-texto">
            <h4>${opcao.texto}</h4>
            <p>${opcao.descricao}</p>
          </div>
          <div class="btn-lista-seta">→</div>
        `;
      }
      
      btn.addEventListener('click', () => {
        if (opcao.proximo) {
          historico.push(idPasso);
          passoAtual = opcao.proximo;
          renderizarPasso(passoAtual);
        } else if (opcao.documento) {
          window.location.href = `documento.html?id=${opcao.documento}`;
        }
      });
      
      containerOpcoes.appendChild(btn);
    });

    if (historico.length > 0) {
      const btnVoltar = document.createElement('button');
      btnVoltar.className = 'triagem-voltar';
      btnVoltar.textContent = '← Voltar para a pergunta anterior';
      btnVoltar.addEventListener('click', () => {
        passoAtual = historico.pop();
        renderizarPasso(passoAtual);
      });
      containerTriagem.appendChild(btnVoltar);
    }
  }
});