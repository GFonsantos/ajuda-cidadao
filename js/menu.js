/* ================================================================
   MENU — CONTROLE DO MEGA MENU, HAMBURGER E ATIVAÇÃO AUTOMÁTICA
   
   O que faz: 1. Abre e fecha o Mega Menu de categorias (Desktop).
              2. Abre e fecha o Menu Hamburger (Mobile).
              3. Descobre qual página o usuário está acessando e 
                 aplica a classe 'ativo' no link correspondente.
   Depende de: Nada (vanilla JS).
   Mexe em: Elementos .menu-mega-btn, .mega-menu, .menu-hamburger e .menu-link.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. LÓGICA DO MEGA MENU (DESKTOP)
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

  // 2. LÓGICA DO MENU HAMBURGER (MOBILE)
  const btnHamburger = document.querySelector('.menu-hamburger');
  const menuPrincipal = document.getElementById('menu-principal');

  if (btnHamburger && menuPrincipal) {
    // Abre e fecha ao clicar nos 3 risquinhos
    btnHamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Impede que o clique feche o menu na mesma hora
      
      const isExpanded = btnHamburger.getAttribute('aria-expanded') === 'true';
      btnHamburger.setAttribute('aria-expanded', !isExpanded);
      menuPrincipal.classList.toggle('aberto');
    });

    // Fecha o menu automaticamente quando um link é clicado
    const linksNav = menuPrincipal.querySelectorAll('a');
    linksNav.forEach(link => {
      link.addEventListener('click', () => {
        btnHamburger.setAttribute('aria-expanded', 'false');
        menuPrincipal.classList.remove('aberto');
      });
    });

    // Fecha o menu se o usuário clicar em qualquer outro lugar da tela
    document.addEventListener('click', (e) => {
      if (!menuPrincipal.contains(e.target) && !btnHamburger.contains(e.target)) {
        btnHamburger.setAttribute('aria-expanded', 'false');
        menuPrincipal.classList.remove('aberto');
      }
    });

    // Prevenção: se o usuário girar a tela ou mudar para o PC, o menu reseta
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991) {
        btnHamburger.setAttribute('aria-expanded', 'false');
        menuPrincipal.classList.remove('aberto');
      }
    });
  }

  // 3. LÓGICA DE ATIVAÇÃO AUTOMÁTICA DO MENU
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