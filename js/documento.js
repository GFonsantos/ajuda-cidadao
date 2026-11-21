/* ================================================================
   DOCUMENTO — MOTOR DE PREENCHIMENTO DINÂMICO E IMPRESSÃO
   
   O que faz: 1. Lê o ID da URL e busca a minuta no JSON.
              2. Encontra todos os campos [ENTRE COLCHETES] no texto.
              3. Gera os inputs do formulário automaticamente.
              4. Substitui no texto em tempo real conforme digita.
              5. Controla a navegação de passos no mobile (Form -> Doc).
   Depende de: data/acervo-minutas.json, DOM de documento.html.
   Mexe em: DOM (#formulario-dinamico, #texto-minuta, .area-formulario).
   ================================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idMinuta = urlParams.get('id');

  const elTitulo = document.getElementById('titulo-documento');
  const elResumo = document.getElementById('resumo-documento');
  const elFormulario = document.getElementById('formulario-dinamico');
  const elTextoMinuta = document.getElementById('texto-minuta');

  // --- CONTROLE DE NAVEGAÇÃO MOBILE (FORMULÁRIO <-> DOCUMENTO) ---
  const btnConferir = document.getElementById('btn-conferir');
  const btnEditar = document.getElementById('btn-editar');
  const areaFormulario = document.querySelector('.area-formulario');
  const areaDocumento = document.querySelector('.area-documento');

  if (btnConferir && btnEditar && areaFormulario && areaDocumento) {
    btnConferir.addEventListener('click', () => {
      areaFormulario.classList.add('oculto');
      areaDocumento.classList.add('visivel');
      window.scrollTo(0, 0); // Rola para o topo ao abrir o documento
    });

    btnEditar.addEventListener('click', () => {
      areaDocumento.classList.remove('visivel');
      areaFormulario.classList.remove('oculto');
      window.scrollTo(0, 0); // Rola para o topo ao voltar para o form
    });
  }
  // ---------------------------------------------------------------

  if (!idMinuta) {
    elTitulo.textContent = 'Nenhum documento selecionado';
    elTextoMinuta.textContent = 'Por favor, volte à biblioteca e escolha um modelo.';
    elFormulario.innerHTML = '';
    return;
  }

  try {
    const resposta = await fetch('data/acervo-minutas.json');
    const dados = await resposta.json();
    const minuta = dados.minutas.find(m => m.id === idMinuta);

    if (!minuta) {
      throw new Error('Minuta não encontrada');
    }

    // 1. Preenche o cabeçalho
    elTitulo.textContent = minuta.titulo;
    elResumo.textContent = minuta.resumo;

    // 2. Extrai os campos entre colchetes do texto original
    const regexCampos = /\[(.*?)\]/g;
    const camposEncontrados = minuta.texto_minuta.match(regexCampos) || [];
    const camposUnicos = [...new Set(camposEncontrados)];
    const nomesCampos = camposUnicos.map(campo => campo.replace(/\[|\]/g, ''));

    // 3. Cria o formulário dinamicamente
    elFormulario.innerHTML = ''; 
    if (nomesCampos.length === 0) {
      elFormulario.innerHTML = '<p>Este documento não possui campos para preencher. Basta imprimir.</p>';
    } else {
      nomesCampos.forEach((nome) => {
        const grupo = document.createElement('div');
        grupo.className = 'campo-grupo';
        
        const label = document.createElement('label');
        label.textContent = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
        
        const nomeUpper = nome.toUpperCase();

        // Se o campo pedir descrição ou texto longo, usamos textarea
        const isTextoLongo = nomeUpper.includes('DESCREVER') || nomeUpper.includes('PROBLEMA') || nomeUpper.includes('MOTIVO') || nomeUpper.includes('RELATO');
        
        let input;
        if (isTextoLongo) {
            input = document.createElement('textarea');
            input.rows = 4;
        } else {
            input = document.createElement('input');
            input.type = 'text';
        }
        
        input.dataset.placeholder = `[${nome}]`; 
        input.placeholder = `Digite aqui...`;

        // --- APLICAR MÁSCARAS E FORMATAÇÃO ---
        if (nomeUpper.includes('CPF') && nomeUpper.includes('CNPJ')) {
            Mascaras.aplicar(input, 'cpfcnpj');
        } else if (nomeUpper.includes('CPF')) {
            Mascaras.aplicar(input, 'cpf');
        } else if (nomeUpper.includes('CNPJ')) {
            Mascaras.aplicar(input, 'cnpj');
        } else if (nomeUpper.includes('CEP')) {
            Mascaras.aplicar(input, 'cep');
        } else if (nomeUpper.includes('DATA') || nomeUpper.includes('NASCIMENTO')) {
            Mascaras.aplicar(input, 'data');
        } else if (nomeUpper.includes('TELEFONE') || nomeUpper.includes('CELULAR') || nomeUpper.includes('FONE') || nomeUpper.includes('WHATSAPP')) {
            Mascaras.aplicar(input, 'telefone');
        } else if (nomeUpper.includes('ENDEREÇO') || nomeUpper.includes('ENDERECO') || nomeUpper.includes('RUA') || nomeUpper.includes('BAIRRO') || nomeUpper.includes('CIDADE') || nomeUpper.includes('COMPLEMENTO')) {
            Mascaras.aplicar(input, 'nome');
        } else if (nomeUpper.includes('E-MAIL') || nomeUpper.includes('EMAIL')) {
            // E-mails não recebem máscara
        } else if (isTextoLongo) {
            // Textos longos não recebem máscara
        } else if (nomeUpper.includes('NOME')) {
            Mascaras.aplicar(input, 'nome');
        } else {
            Mascaras.aplicar(input, 'maiuscula');
        }

        // Evento que atualiza o texto em tempo real
        input.addEventListener('input', atualizarTextoDocumento);

        grupo.appendChild(label);
        grupo.appendChild(input);
        elFormulario.appendChild(grupo);
      });
    }

    // 4. Função que substitui os dados no texto
    function atualizarTextoDocumento() {
      let textoAtualizado = minuta.texto_minuta;
      
      const inputs = elFormulario.querySelectorAll('input, textarea');

      inputs.forEach(input => {
        const valor = input.value.trim();
        const placeholder = input.dataset.placeholder;
        const textoSubstituto = valor !== '' ? valor : placeholder;
        
        textoAtualizado = textoAtualizado.split(placeholder).join(textoSubstituto);
      });

      elTextoMinuta.textContent = textoAtualizado;
    }

    // Renderiza o texto inicial pela primeira vez
    atualizarTextoDocumento();

  } catch (erro) {
    console.error('Erro ao carregar documento:', erro);
    elTitulo.textContent = 'Erro';
    elTextoMinuta.textContent = 'Não foi possível carregar o documento. Tente voltar à biblioteca.';
  }
});