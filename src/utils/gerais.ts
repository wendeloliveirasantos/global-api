export function calcularIdade(dataNascimento: string) {
    const hoje = new Date();
    const dataNascimentoDate = new Date(dataNascimento);
    let idade = hoje.getFullYear() - dataNascimentoDate.getFullYear();
    const mesAtual = hoje.getMonth() + 1;
    const diaAtual = hoje.getDate();
    const mesNascimento = dataNascimentoDate.getMonth() + 1;
    const diaNascimento = dataNascimentoDate.getDate();
  
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
    }
  
    return idade;
}

export function obterCodigoOperadoraUniversal(operadora: string) {
    switch (operadora.toLowerCase()) {
      case 'amex':
        return 1;
      case 'visa':
        return 2;
      case 'mastercard':
        return 3;
      default:
        return null;
    }
}

export function obterCodigoOperadoraAssistCard(operadora: string) {
    switch (operadora.toLowerCase()) {
      case 'amex':
        return 3;
      case 'visa':
        return 1;
      case 'mastercard':
        return 2;
      default:
        return null;
    }
}

export function obterOperadoraCartao(numeroCartao: string): string {
    const visaRegex = /^4\d{12}(?:\d{3})?$/;
    const mastercardRegex = /^5[1-5]\d{14}$/;
    const amexRegex = /^3[47]\d{13}$/;
    const discoverRegex = /^6(?:011|5\d{2})\d{12}$/;
    const dinersClubRegex = /^3(?:0[0-5]|[68]\d)\d{11}$/;
    const jcbRegex = /^(?:2131|1800|35\d{3})\d{11}$/;

    if (visaRegex.test(numeroCartao)) {
        return 'visa';
    } else if (mastercardRegex.test(numeroCartao)) {
        return 'mastercard';
    } else if (amexRegex.test(numeroCartao)) {
        return 'amex';
    } else if (discoverRegex.test(numeroCartao)) {
        return 'discover';
    } else if (dinersClubRegex.test(numeroCartao)) {
        return 'dinersclub';
    } else if (jcbRegex.test(numeroCartao)) {
        return 'jcb';
    } else {
        return null;
    }
}