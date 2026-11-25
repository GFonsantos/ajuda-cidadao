/* ================================================================
   DIRETÓRIO — FUNÇÃO DE COPIAR NÚMERO
   
   O que faz: Copia o número do telefone para a área de transferência
              quando o usuário clica em "Copiar número". Útil no desktop,
              onde o link tel: pode não abrir o discador.
   Depende de: Navegador com navigator.clipboard (HTTPS ou localhost).
   Mexe em: Botões .btn-copiar e elemento #status-copia.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('status-copia');

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-copiar');
    if (!btn) return;

    const numero = btn.dataset.numero;
    if (!numero) return;

    try {
      await navigator.clipboard.writeText(numero);

      const textoOriginal = btn.textContent;
      btn.textContent = 'Copiado!';
      btn.classList.add('copiado');

      if (statusEl) {
        statusEl.textContent = `Número ${numero} copiado para a área de transferência.`;
      }

      setTimeout(() => {
        btn.textContent = textoOriginal;
        btn.classList.remove('copiado');
      }, 2000);
    } catch (erro) {
      console.error('Erro ao copiar:', erro);
      if (statusEl) {
        statusEl.textContent = `Não foi possível copiar automaticamente. O número é ${numero}.`;
      }
    }
  });
});