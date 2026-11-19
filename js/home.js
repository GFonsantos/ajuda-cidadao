/* ================================================================
   HOME — LÓGICA DA BUSCA RÁPIDA
   
   O que faz: Captura o termo digitado na index e redireciona para 
              a biblioteca, passando o termo via URL (query string).
   Depende de: Nada.
   Mexe em: DOM do index.html (campo-busca e botão).
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const campoBusca = document.getElementById('campo-busca');
  const btnBuscar = document.querySelector('.busca-container button');

  if (btnBuscar && campoBusca) {
    btnBuscar.addEventListener('click', (e) => {
      e.preventDefault();
      const termo = campoBusca.value.trim();
      
      if (termo) {
        // Redireciona para a biblioteca com o termo na URL
        window.location.href = `biblioteca.html?q=${encodeURIComponent(termo)}`;
      } else {
        // Se estiver vazio, só vai para a biblioteca
        window.location.href = 'biblioteca.html';
      }
    });

    // Permite buscar apertando "Enter"
    campoBusca.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btnBuscar.click();
      }
    });
  }
});