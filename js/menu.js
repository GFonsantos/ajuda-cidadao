/* ================================================================
   MENU — CONTROLE DO MEGA MENU E ATIVAÇÃO AUTOMÁTICA DE PÁGINA
   
   O que faz: 1. Abre e fecha o Mega Menu de categorias.
              2. Descobre qual página o usuário está acessando e 
                 aplica a classe 'ativo' no link correspondente.
   Depende de: Nada (vanilla JS).
   Mexe em: Elementos .menu-mega-btn, .mega-menu e .menu-link.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. LÓGICA DO MEGA MENU
  const megaBtn = document.querySelector('.menu-mega-btn');
  const megaMenu = document.getElementById('mega-menu');

  if (megaBtn && megaMenu) {
    // Abre/Fecha ao clicar
    megaBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const estaAberto = megaBtn.getAttribute('aria-expanded') === 'true';
      megaBtn.setAttribute('aria-expanded', !estaAberto);
      megaMenu.classList.toggle('mostrar');
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!megaBtn.contains(e.target) && !megaMenu.contains(e.target)) {
        megaBtn.setAttribute('aria-expanded', 'false');
        megaMenu.classList.remove('mostrar');
      }
    });

    // Fecha ao apertar Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        megaBtn.setAttribute('aria-expanded', 'false');
        megaMenu.classList.remove('mostrar');
      }
    });
  }

  // 2. LÓGICA DE ATIVAÇÃO AUTOMÁTICA DO MENU
  // Pega o caminho da URL atual (ex: /biblioteca.html)
  const pathAtual = window.location.pathname.split('/').pop() || 'index.html';
  const linksMenu = document.querySelectorAll('.menu-link');

  linksMenu.forEach(link => {
    const hrefLink = link.getAttribute('href');
    // Se o link for igual ao arquivo atual, ativa
    if (pathAtual === hrefLink) {
      link.classList.add('ativo');
    } else {
      link.classList.remove('ativo');
    }
  });
});