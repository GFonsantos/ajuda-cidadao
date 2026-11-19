/* ================================================================
   APP — CONTROLE DE ACESSIBILIDADE
   
   O que faz: Gerencia o aumento/diminuição da fonte e o modo de alto
              contraste. Salva as preferências no localStorage (local-first).
   Depende de: Nada (vanilla JS).
   Mexe em: DOM de todas as páginas, localStorage ('ajuda-tamanho-fonte', 'ajuda-contraste').
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos da barra
  const btnAumentar = document.getElementById('btn-aumentar-fonte');
  const btnDiminuir = document.getElementById('btn-diminuir-fonte');
  const btnContraste = document.getElementById('btn-alto-contraste');
  const htmlElement = document.documentElement;

  // Chaves do localStorage
  const CHAVE_FONTE = 'ajuda-tamanho-fonte';
  const CHAVE_CONTRASTE = 'ajuda-contraste';

  // --- Lógica da Fonte ---
  let tamanhoAtual = parseInt(localStorage.getItem(CHAVE_FONTE)) || 16;

  function aplicarFonte() {
    // Limita entre 12px e 24px para não quebrar o layout
    if (tamanhoAtual < 12) tamanhoAtual = 12;
    if (tamanhoAtual > 24) tamanhoAtual = 24;
    htmlElement.style.fontSize = `${tamanhoAtual}px`;
    localStorage.setItem(CHAVE_FONTE, tamanhoAtual);
  }

  // Aplica a fonte salva ao carregar a página
  aplicarFonte();

  if (btnAumentar && btnDiminuir) {
    btnAumentar.addEventListener('click', () => {
      tamanhoAtual += 2;
      aplicarFonte();
    });

    btnDiminuir.addEventListener('click', () => {
      tamanhoAtual -= 2;
      aplicarFonte();
    });
  }

  // --- Lógica do Alto Contraste ---
  function aplicarContraste() {
    const modoContraste = localStorage.getItem(CHAVE_CONTRASTE) === 'true';
    if (modoContraste) {
      document.body.classList.add('alto-contraste');
    } else {
      document.body.classList.remove('alto-contraste');
    }
  }

  // Aplica o contraste salvo ao carregar a página
  aplicarContraste();

  if (btnContraste) {
    btnContraste.addEventListener('click', () => {
      const modoAtual = localStorage.getItem(CHAVE_CONTRASTE) === 'true';
      localStorage.setItem(CHAVE_CONTRASTE, !modoAtual);
      aplicarContraste();
    });
  }
});