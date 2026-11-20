/* ================================================================
   ANIMAÇÕES — SCROLL REVEAL
   
   O que faz: Adiciona a classe 'visivel' nos elementos quando eles
              entram na tela do usuário, disparando a animação CSS.
   Depende de: Nada (vanilla JS).
   Mexe em: Elementos com a classe 'animar-scroll'.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Respeita a preferência do usuário por menos movimento (Acessibilidade)
  const prefereMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefereMenosMovimento) return;

  const elementos = document.querySelectorAll('.animar-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel');
        observer.unobserve(entry.target); // Para de observar depois que apareceu
      }
    });
  }, {
    threshold: 0.1 // Dispara quando 10% do elemento está visível
  });

  elementos.forEach(el => observer.observe(el));
});