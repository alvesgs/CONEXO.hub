/**
 * Utilitários de Data e Horário para a Agenda Co.Nexo SENAC
 */

export interface InfoDataAgenda {
  dia: string;
  mes: string;
  mesAbrev: string;
  ano: string;
  diaSemana: string;
  diaSemanaAbrev: string;
  textoCompleto: string;
  textoCurto: string;
}

export const formatarDataAgenda = (dataString: string): InfoDataAgenda => {
  if (!dataString) {
    return {
      dia: '--',
      mes: '--',
      mesAbrev: '--',
      ano: '----',
      diaSemana: '--',
      diaSemanaAbrev: '--',
      textoCompleto: 'Data não informada',
      textoCurto: '--'
    };
  }

  const [ano, mes, dia] = dataString.split('-').map(Number);
  const dataObj = new Date(ano, mes - 1, dia, 12, 0, 0);

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const mesesAbrev = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const diasSemanaAbrev = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const diaNumStr = String(dia).padStart(2, '0');
  const mesNome = meses[mes - 1] || '';
  const mesAbrev = mesesAbrev[mes - 1] || '';
  const diaSemana = diasSemana[dataObj.getDay()] || '';
  const diaSemanaAbrev = diasSemanaAbrev[dataObj.getDay()] || '';

  return {
    dia: diaNumStr,
    mes: mesNome,
    mesAbrev,
    ano: String(ano),
    diaSemana,
    diaSemanaAbrev,
    textoCompleto: `${diaNumStr} de ${mesNome} de ${ano} (${diaSemana})`,
    textoCurto: `${diaNumStr} de ${mesAbrev}`
  };
};

/**
 * Calcula o prazo de cancelamento pelo sistema (regra das 24 horas)
 * @param data Data do encontro (YYYY-MM-DD)
 * @param horarioInicio Horário de início (HH:mm)
 */
export const calcularPrazoCancelamento = (data: string, horarioInicio: string) => {
  const agora = new Date();
  const dataEncontro = new Date(`${data}T${horarioInicio}:00`);

  const diffMs = dataEncontro.getTime() - agora.getTime();
  const diffHoras = diffMs / (1000 * 60 * 60);

  // Fora do prazo: se faltar menos de 24 horas para o encontro (ou se já tiver passado)
  const foraDoPrazo = diffHoras < 24;
  const horasRestantes = Math.max(0, Math.round(diffHoras));

  return {
    foraDoPrazo,
    horasRestantes,
    diffHoras
  };
};
