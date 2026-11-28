/* ================================================================
LEITOR DE VOZ — LEITURA EM VOZ ALTA DA MINUTA (Web Speech API)
O que faz: 1. Lê o texto da folha A4 em voz alta (pt-BR).
2. Controla Ouvir / Pausar / Retomar / Parar e a velocidade.
3. Divide o texto em blocos curtos (contorna o limite de
   duração do speechSynthesis no Chrome).
4. Para a leitura ao clicar em Editar, ao alterar qualquer
   campo do formulário, ao imprimir ou ao sair da página.
5. Se o navegador não suportar, a barra fica oculta e o site
   segue funcionando normalmente (fallback silencioso).
Depende de: window.speechSynthesis, DOM de documento.html (#texto-minuta).
Mexe em: DOM (#barra-leitor, #btn-ouvir, #btn-pausar, #btn-parar,
#select-velocidade, #status-leitor, #progresso-leitor).
localStorage: 'ajuda-leitor-velocidade' (só a velocidade, nenhum dado pessoal).
================================================================ */
document.addEventListener('DOMContentLoaded', () => {

    const barra = document.getElementById('barra-leitor');
    if (!barra) return;

    // --- FALLBACK: navegador sem suporte fica com a barra oculta ---
    const synth = window.speechSynthesis;
    if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') {
        barra.hidden = true;
        return;
    }

    const elTexto = document.getElementById('texto-minuta');
    const btnOuvir = document.getElementById('btn-ouvir');
    const btnPausar = document.getElementById('btn-pausar');
    const btnParar = document.getElementById('btn-parar');
    const controles = document.getElementById('controles-leitor');
    const selectVelocidade = document.getElementById('select-velocidade');
    const elStatus = document.getElementById('status-leitor');
    const elProgresso = document.getElementById('progresso-leitor');
    const rotuloPausar = document.getElementById('rotulo-pausar');
    const btnEditar = document.getElementById('btn-editar');
    const elFormulario = document.getElementById('formulario-dinamico');

    const CHAVE_VELOCIDADE = 'ajuda-leitor-velocidade';
    const TAMANHO_BLOCO = 200; // caracteres por utterance

    let partes = [];
    let indice = 0;
    let estado = 'parado'; // 'parado' | 'lendo' | 'pausado'
    let pausadoPeloUsuario = false;
    let sessao = 0;        // invalida callbacks de leituras canceladas
    let vozPtBR = null;
    let velocidade = parseFloat(localStorage.getItem(CHAVE_VELOCIDADE)) || 1;

    // A barra só aparece depois que o texto da minuta existir
    barra.hidden = true;
    selectVelocidade.value = String(velocidade);
    if (!selectVelocidade.value) {
        velocidade = 1;
        selectVelocidade.value = '1';
    }

    // --- VOZ EM PORTUGUÊS DO BRASIL ---
    function escolherVoz() {
        const vozes = synth.getVoices();
        if (!vozes || vozes.length === 0) return null;
        return vozes.find(v => /^pt[-_]BR/i.test(v.lang)) ||
               vozes.find(v => /^pt/i.test(v.lang)) ||
               null;
    }
    vozPtBR = escolherVoz();
    if (typeof synth.addEventListener === 'function') {
        synth.addEventListener('voiceschanged', () => { vozPtBR = escolherVoz(); });
    } else {
        synth.onvoiceschanged = () => { vozPtBR = escolherVoz(); };
    }

    // --- DIVIDE O TEXTO EM BLOCOS CURTOS ---
    function dividirEmBlocos(texto) {
        const limpo = texto.replace(/\s+/g, ' ').trim();
        if (!limpo) return [];

        // Quebra por frase, mantendo a pontuação
        const frases = limpo.match(/[^.!?;]+[.!?;]*\s*/g) || [limpo];
        const blocos = [];
        let atual = '';

        frases.forEach(frase => {
            if (frase.length > TAMANHO_BLOCO) {
                // Frase muito longa: corta por vírgula ou espaço
                if (atual) { blocos.push(atual.trim()); atual = ''; }
                let resto = frase.trim();
                while (resto.length > TAMANHO_BLOCO) {
                    let corte = resto.lastIndexOf(',', TAMANHO_BLOCO);
                    if (corte < 80) corte = resto.lastIndexOf(' ', TAMANHO_BLOCO);
                    if (corte < 1) corte = TAMANHO_BLOCO;
                    blocos.push(resto.slice(0, corte + 1).trim());
                    resto = resto.slice(corte + 1);
                }
                if (resto.trim()) atual = resto;
                return;
            }
            if ((atual + frase).length > TAMANHO_BLOCO) {
                blocos.push(atual.trim());
                atual = frase;
            } else {
                atual += frase;
            }
        });

        if (atual.trim()) blocos.push(atual.trim());
        return blocos;
    }

    // --- INTERFACE ---
    function atualizarInterface() {
        const ativo = estado !== 'parado';
        controles.hidden = !ativo;
        btnOuvir.disabled = ativo;

        if (estado === 'pausado') {
            btnPausar.setAttribute('aria-pressed', 'true');
            btnPausar.setAttribute('aria-label', 'Retomar a leitura do documento');
            rotuloPausar.textContent = 'Retomar';
        } else {
            btnPausar.setAttribute('aria-pressed', 'false');
            btnPausar.setAttribute('aria-label', 'Pausar a leitura do documento');
            rotuloPausar.textContent = 'Pausar';
        }

        if (ativo) {
            elProgresso.textContent = `Parte ${Math.min(indice + 1, partes.length)} de ${partes.length}`;
        } else {
            elProgresso.textContent = '';
        }
    }

    function anunciar(mensagem) {
        elStatus.textContent = mensagem;
    }

    // --- NÚCLEO DA LEITURA ---
    function falarBloco() {
        if (estado === 'parado') return;

        if (indice >= partes.length) {
            finalizar('Leitura concluída.');
            return;
        }

        const minhaSessao = sessao;
        const fala = new SpeechSynthesisUtterance(partes[indice]);
        fala.lang = 'pt-BR';
        fala.rate = velocidade;
        fala.pitch = 1;
        if (vozPtBR) fala.voice = vozPtBR;

        fala.onend = () => {
            if (minhaSessao !== sessao || estado === 'parado') return;
            indice++;
            atualizarInterface();
            falarBloco();
        };

        fala.onerror = (evento) => {
            if (minhaSessao !== sessao) return;
            if (evento.error === 'interrupted' || evento.error === 'canceled') return;
            console.error('Erro na leitura em voz alta:', evento.error);
            finalizar('A leitura foi interrompida pelo navegador.');
        };

        synth.speak(fala);
    }

    function iniciarLeitura() {
        const texto = elTexto ? elTexto.textContent : '';
        partes = dividirEmBlocos(texto);

        if (partes.length === 0) {
            anunciar('Ainda não há texto para ler. Escolha um modelo na biblioteca.');
            return;
        }

        pararInterno();
        sessao++;
        indice = 0;
        estado = 'lendo';
        pausadoPeloUsuario = false;
        atualizarInterface();
        anunciar('Lendo o documento em voz alta.');
        falarBloco();
    }

    function alternarPausa() {
        if (estado === 'lendo') {
            synth.pause();
            estado = 'pausado';
            pausadoPeloUsuario = true;
            atualizarInterface();
            anunciar('Leitura pausada.');
        } else if (estado === 'pausado') {
            synth.resume();
            estado = 'lendo';
            pausadoPeloUsuario = false;
            atualizarInterface();
            anunciar('Leitura retomada.');
        }
    }

    // Cancela sem mexer na interface (uso interno)
    function pararInterno() {
        sessao++;
        try { synth.cancel(); } catch (e) { /* silencioso */ }
    }

    function finalizar(mensagem) {
        pararInterno();
        estado = 'parado';
        pausadoPeloUsuario = false;
        indice = 0;
        partes = [];
        atualizarInterface();
        if (mensagem) anunciar(mensagem);
    }

    function parar(mensagem, devolverFoco) {
        if (estado === 'parado') {
            if (mensagem) anunciar(mensagem);
            return;
        }
        finalizar(mensagem || 'Leitura interrompida.');
        if (devolverFoco) btnOuvir.focus();
    }

    // --- EVENTOS DA BARRA ---
    btnOuvir.addEventListener('click', iniciarLeitura);
    btnPausar.addEventListener('click', alternarPausa);
    btnParar.addEventListener('click', () => parar('Leitura interrompida.', true));

    selectVelocidade.addEventListener('change', () => {
        velocidade = parseFloat(selectVelocidade.value) || 1;
        localStorage.setItem(CHAVE_VELOCIDADE, velocidade);

        if (estado !== 'parado') {
            // Troca a velocidade reiniciando o bloco atual, sem perder a posição
            const estavaPausado = estado === 'pausado';
            pararInterno();
            estado = 'lendo';
            pausadoPeloUsuario = false;
            falarBloco();
            if (estavaPausado) {
                synth.pause();
                estado = 'pausado';
                pausadoPeloUsuario = true;
            }
            atualizarInterface();
        }
        anunciar(`Velocidade da leitura: ${selectVelocidade.options[selectVelocidade.selectedIndex].text}.`);
    });

    // --- PARADAS AUTOMÁTICAS ---
    // 1. Clicou em "Editar" (mobile): volta ao formulário, para de ler
    if (btnEditar) {
        btnEditar.addEventListener('click', () => parar('Leitura interrompida para edição.'));
    }

    // 2. Digitou qualquer campo: o texto mudou, a leitura antiga não vale mais
    if (elFormulario) {
        elFormulario.addEventListener('input', () => {
            if (estado !== 'parado') parar('O texto foi alterado. Leitura interrompida.');
        });
    }

    // 3. Vai imprimir: silêncio para não competir com o leitor de tela
    window.addEventListener('beforeprint', () => parar('Leitura interrompida para impressão.'));

    // 4. Saiu da página ou trocou de minuta
    window.addEventListener('pagehide', () => parar());
    window.addEventListener('beforeunload', () => parar());

    // 5. Aba em segundo plano: o Chrome às vezes "pausa sozinho".
    //    Se não foi o usuário, retomamos para não travar a fila.
    setInterval(() => {
        if (estado === 'lendo' && !pausadoPeloUsuario && synth.paused) {
            synth.resume();
        }
    }, 5000);

    // --- MOSTRA A BARRA QUANDO O TEXTO DA MINUTA ESTIVER PRONTO ---
    // O documento.js é assíncrono (fetch), então observamos o #texto-minuta.
    function tentarAtivar() {
        const texto = elTexto ? elTexto.textContent.trim() : '';
        const pareceMinuta = texto.length > 80;
        if (pareceMinuta) {
            barra.hidden = false;
            return true;
        }
        return false;
    }

    if (!tentarAtivar() && elTexto) {
        const observador = new MutationObserver(() => {
            if (tentarAtivar()) observador.disconnect();
        });
        observador.observe(elTexto, { childList: true, characterData: true, subtree: true });
        // Rede de segurança: se nada chegar em 15s, para de observar
        setTimeout(() => observador.disconnect(), 15000);
    }

    atualizarInterface();
});