/* ================================================================
LEITOR DE VOZ + MODO PCD + LER CAMPO
O que faz: 1. Controla o "Modo PCD" (liga/desliga a barra e os botões de campo).
           2. Lê o texto da folha A4 em voz alta (pt-BR), pulando os colchetes.
           3. Expõe a função global para ler o nome dos campos.
Depende de: window.speechSynthesis, DOM de documento.html.
================================================================ */
document.addEventListener('DOMContentLoaded', () => {

    const barra = document.getElementById('barra-leitor');
    if (!barra) return;

    const synth = window.speechSynthesis;
    if (!synth) { barra.hidden = true; return; }

    // --- ELEMENTOS ---
    const elTexto = document.getElementById('texto-minuta-container');
    const btnOuvir = document.getElementById('btn-ouvir');
    const btnPausar = document.getElementById('btn-pausar');
    const btnParar = document.getElementById('btn-parar');
    const controles = document.getElementById('controles-leitor');
    const selectVelocidade = document.getElementById('select-velocidade');
    const elStatus = document.getElementById('status-leitor');
    const btnEditar = document.getElementById('btn-editar');
    const elFormulario = document.getElementById('formulario-dinamico');
    const btnModoPcd = document.getElementById('btn-modo-pcd');
    const CHAVE_MODO_PCD = 'ajuda-modo-pcd';
    let modoPcdAtivo = localStorage.getItem(CHAVE_MODO_PCD) === 'true';
    let estado = 'parado';
    let vozPtBR = null;

    // --- 1. MODO PCD ---
    function aplicarModoPcd() {
        if (modoPcdAtivo) {
            if (btnModoPcd) btnModoPcd.setAttribute('aria-pressed', 'true');
            document.body.classList.add('modo-pcd-ativo');
            if (elTexto && elTexto.textContent.trim().length > 10) barra.hidden = false;
        } else {
            if (btnModoPcd) btnModoPcd.setAttribute('aria-pressed', 'false');
            document.body.classList.remove('modo-pcd-ativo');
            barra.hidden = true;
            if (estado !== 'parado') pararLeitura();
        }
    }
    if (btnModoPcd) {
        btnModoPcd.addEventListener('click', () => {
            modoPcdAtivo = !modoPcdAtivo;
            localStorage.setItem(CHAVE_MODO_PCD, modoPcdAtivo);
            aplicarModoPcd();
            if (elStatus) elStatus.textContent = modoPcdAtivo ? 'Modo PCD ativado.' : 'Modo PCD desativado.';
        });
    }

    // --- 2. VOZ ---
    function carregarVozes() {
        const vozes = synth.getVoices();
        vozPtBR = vozes.find(v => v.lang.includes('pt-BR')) || vozes[0] || null;
    }
    carregarVozes();
    if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = carregarVozes;

    // --- 3. LEITURA DO DOCUMENTO ---
    function iniciarLeitura() {
        if (!elTexto) return;
        const textoOriginal = elTexto.textContent;
        const textoLimpo = textoOriginal.replace(/\[.*?\]/g, ' ').replace(/\s+/g, ' ').trim();
        if (textoLimpo.length < 10) { if(elStatus) elStatus.textContent = 'Aguarde o documento carregar...'; return; }
        synth.cancel();
        const fala = new SpeechSynthesisUtterance(textoLimpo);
        fala.lang = 'pt-BR';
        fala.rate = parseFloat(selectVelocidade.value) || 1;
        if (vozPtBR) fala.voice = vozPtBR;
        fala.onstart = () => { estado = 'lendo'; atualizarInterface(); if(elStatus) elStatus.textContent = 'Lendo documento...'; };
        fala.onend = () => { estado = 'parado'; atualizarInterface(); if(elStatus) elStatus.textContent = 'Leitura concluída.'; };
        fala.onerror = () => { estado = 'parado'; atualizarInterface(); if(elStatus) elStatus.textContent = 'Erro na leitura.'; };
        synth.speak(fala);
    }
    function alternarPausa() {
        if (estado === 'lendo') { synth.pause(); estado = 'pausado'; atualizarInterface(); }
        else if (estado === 'pausado') { synth.resume(); estado = 'lendo'; atualizarInterface(); }
    }
    function pararLeitura() { synth.cancel(); estado = 'parado'; atualizarInterface(); if(elStatus) elStatus.textContent = 'Leitura interrompida.'; }

    function atualizarInterface() {
        if (estado === 'parado') { if(controles) controles.hidden = true; if(btnOuvir) { btnOuvir.disabled = false; btnOuvir.style.opacity = '1'; } }
        else { if(controles) controles.hidden = false; if(btnOuvir) { btnOuvir.disabled = true; btnOuvir.style.opacity = '0.5'; } }
        const rotuloPausar = document.getElementById('rotulo-pausar');
        if (rotuloPausar) rotuloPausar.textContent = (estado === 'pausado') ? 'Retomar' : 'Pausar';
    }

    if (btnOuvir) btnOuvir.addEventListener('click', iniciarLeitura);
    if (btnPausar) btnPausar.addEventListener('click', alternarPausa);
    if (btnParar) btnParar.addEventListener('click', pararLeitura);
    if (btnEditar) btnEditar.addEventListener('click', () => { if (estado !== 'parado') pararLeitura(); });
    if (elFormulario) elFormulario.addEventListener('input', () => { if (estado !== 'parado') pararLeitura(); });

    // --- 4. OBSERVADOR DO TEXTO ---
    function tentarAtivarBarra() {
        if (modoPcdAtivo && elTexto && elTexto.textContent.trim().length > 10) { barra.hidden = false; return true; }
        return false;
    }
    if (!tentarAtivarBarra() && elTexto) {
        const observador = new MutationObserver(() => { if (tentarAtivarBarra()) observador.disconnect(); });
        observador.observe(elTexto, { childList: true, characterData: true, subtree: true });
        setTimeout(() => observador.disconnect(), 15000);
    }

    // --- 5. FUNÇÃO GLOBAL PARA LER CAMPOS ---
    window.AjudaLeitor = {
        lerCampo: (texto) => {
            if (!texto || !synth) return;
            try { synth.cancel(); } catch (e) {}
            const fala = new SpeechSynthesisUtterance(texto);
            fala.lang = 'pt-BR';
            fala.rate = parseFloat(selectVelocidade.value) || 1;
            if (vozPtBR) fala.voice = vozPtBR;
            synth.speak(fala);
        }
    };

    aplicarModoPcd();
    atualizarInterface();
});