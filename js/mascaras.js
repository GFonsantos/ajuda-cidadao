/* ================================================================
   MÁSCARAS — FORMATAÇÃO DE INPUTS EM TEMPO REAL
   
   O que faz: Aplica máscaras (CPF, CNPJ, CEP, Data, Telefone) e formatação
              de Nome/Maiúscula enquanto o usuário digita.
   Depende de: Nada (vanilla JS).
   Mexe em: Inputs do formulário dinâmico em documento.html.
   ================================================================ */

const Mascaras = {
  
  apenasNumeros: (valor) => valor.replace(/\D/g, ''),

  cpf: (valor) => {
    return Mascaras.apenasNumeros(valor)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14); 
  },

  cnpj: (valor) => {
    return Mascaras.apenasNumeros(valor)
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  },

  cep: (valor) => {
    return Mascaras.apenasNumeros(valor)
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  },

  telefone: (valor) => {
    let v = Mascaras.apenasNumeros(valor).substring(0, 11); 
    
    if (v.length === 0) return '';
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 6) return `(${v.substring(0,2)}) ${v.substring(2)}`;
    if (v.length <= 10) {
      return `(${v.substring(0,2)}) ${v.substring(2,6)}-${v.substring(6)}`;
    }
    return `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
  },

  data: (valor) => {
    return Mascaras.apenasNumeros(valor)
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
      .substring(0, 10);
  },

  maiuscula: (valor) => {
    return valor.toUpperCase();
  },

    nome: (valor) => {
    const preposicoes = ['de', 'da', 'do', 'das', 'dos', 'e'];
    return valor
      .toLowerCase()
      .split(' ')
      .map(palavra => {
        if (palavra.length === 0) return palavra;
        if (preposicoes.includes(palavra)) return palavra;
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
      })
      .join(' ');
  },

  validarCPF: (cpf) => {
      cpf = Mascaras.apenasNumeros(cpf);
      if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    
      let soma = 0;
      let resto;
    
      for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
      resto = (soma * 10) % 11;
      if ((resto === 10) || (resto === 11)) resto = 0;
      if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
      soma = 0;
      for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
      resto = (soma * 10) % 11;
      if ((resto === 10) || (resto === 11)) resto = 0;
      if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
      return true;
    },

    validarData: (data) => {
      const partes = data.split('/');
      if (partes.length !== 3) return false;
    
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10);
      const ano = parseInt(partes[2], 10);
    
      // Validações básicas
      if (ano < 1900 || ano > 2100) return false;
      if (mes < 1 || mes > 12) return false;
      if (dia < 1 || dia > 31) return false;
    
      // Dias por mês
      const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
      // Ano bissexto
      const bissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
      if (bissexto) diasPorMes[1] = 29;
    
      if (dia > diasPorMes[mes - 1]) return false;
    
      return true;
    },

    aplicar: (input, tipo) => {


    input.addEventListener('input', (e) => {
      let valor = e.target.value;

      switch (tipo) {
        case 'cpf':
          e.target.value = Mascaras.cpf(valor);
          break;
        case 'cnpj':
          e.target.value = Mascaras.cnpj(valor);
          break;
        case 'cpfcnpj':
          if (Mascaras.apenasNumeros(valor).length > 11) {
            e.target.value = Mascaras.cnpj(valor);
          } else {
            e.target.value = Mascaras.cpf(valor);
          }
          break;
        case 'cep':
          e.target.value = Mascaras.cep(valor);
          break;
        case 'telefone':
          e.target.value = Mascaras.telefone(valor);
          break;
        case 'data':
          e.target.value = Mascaras.data(valor);
          break;
        case 'maiuscula':
          e.target.value = Mascaras.maiuscula(valor);
          break;
        case 'nome':
          break; 
      }
    });

    if (tipo === 'nome') {
      input.addEventListener('blur', (e) => {
        const valorFormatado = Mascaras.nome(e.target.value.trim());
        if (e.target.value !== valorFormatado) {
          e.target.value = valorFormatado;
          e.target.dispatchEvent(new Event('input')); 
        }
      });
    }
  }
};