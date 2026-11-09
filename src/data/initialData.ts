import { Aluno, Consultor, Agendamento, EntradaDiarioDeBordo, DuvidaMentorado, MaterialApoio } from '../types';

export const INITIAL_CONSULTORES: Consultor[] = [
  {
    id: 'c1',
    nome: 'Aline Silva',
    email: 'aline.consultora@senac.br',
    turnoPadrao: 'Tarde (13h-17h)',
    salaPadrao: 'Sala 204 - Bloco Empreendedorismo',
    especialidade: 'Finanças Básicas e Precificação de Alimentos'
  },
  {
    id: 'c2',
    nome: 'Regis Santos',
    email: 'regis.coordenacao@senac.br',
    turnoPadrao: 'Manhã (08h-12h)',
    salaPadrao: 'Coordenação Co.Nexo - Sala 101',
    especialidade: 'Modelagem de Negócios e Estratégia'
  }
];

export const INITIAL_ALUNOS: Aluno[] = [
  {
    id: 'a1',
    nome: 'Arthur Santana',
    whatsapp: '11987654321',
    email: 'arthur.quentinhas@email.com',
    negocio: 'Marmitaria do Arthur (Venda de Quentinhas)',
    ramo: 'Alimentação / Gastronomia',
    statusPrograma: 'Em Trilha (Encontro 1)',
    statusMei: 'Informal / Sem CNPJ',
    totalFaltas: 0,
    totalReagendamentos: 0,
    totalCancelamentos: 0,
    dataCadastro: '2026-10-01',
    encontrosRealizados: 1,
    historicoNotas: 'Entrevista de diagnóstico realizada com Aline. Negócio informal, anotações de fiado em papelão, mistura despesas pessoais com o caixa do almoço.'
  },
  {
    id: 'a2',
    nome: 'Juliana Costa',
    whatsapp: '11977778888',
    email: 'juliana.doces@email.com',
    negocio: 'Ju Doces Artesanais (Bolo de Pote)',
    ramo: 'Confeitaria',
    statusPrograma: 'Em Trilha (Encontro 3)',
    statusMei: 'Em Análise / Documentação',
    totalFaltas: 0,
    totalReagendamentos: 1,
    totalCancelamentos: 0,
    dataCadastro: '2026-09-15',
    encontrosRealizados: 3,
    historicoNotas: 'Precificação ajustada no Encontro 2. Já abriu conta jurídica digital e está reunindo documentos para o MEI.'
  },
  {
    id: 'a3',
    nome: 'Carlos Eduardo Santos',
    whatsapp: '11966665555',
    email: 'cadu.barber@email.com',
    negocio: 'Cadu Cortes Masculinos',
    ramo: 'Beleza & Estética',
    statusPrograma: 'Concluído',
    statusMei: 'Informal / Sem CNPJ',
    totalFaltas: 1,
    totalReagendamentos: 1,
    totalCancelamentos: 1,
    dataCadastro: '2026-08-10',
    dataConclusao: '2026-09-20',
    dataFollowUp30d: '2026-10-20',
    dataFollowUp60d: '2026-11-20',
    encontrosRealizados: 5,
    historicoNotas: 'Ciclo completo de 5 encontros finalizado! Necessita contato de follow-up (30 dias) para validar formalização do MEI e evitar o limbo.'
  },
  {
    id: 'a4',
    nome: 'Vanessa Souza',
    whatsapp: '11955554444',
    email: 'vanessa.atelie@email.com',
    negocio: 'Ateliê Costura Fina',
    ramo: 'Moda / Confecção',
    statusPrograma: 'Em Trilha (Encontro 2)',
    statusMei: 'Informal / Sem CNPJ',
    totalFaltas: 1,
    totalReagendamentos: 2,
    totalCancelamentos: 0,
    dataCadastro: '2026-09-01',
    encontrosRealizados: 2,
    historicoNotas: 'ALERTA DE DESLIGAMENTO: Aluna já acumula 1 falta e 2 reagendamentos. Mais 1 falta ou reagendamento causará desligamento automático.'
  },
  {
    id: 'a5',
    nome: 'Roberto Lima',
    whatsapp: '11944443333',
    email: 'roberto.marcenaria@email.com',
    negocio: 'Móveis Planejados Lima',
    ramo: 'Marcenaria / Artesanato',
    statusPrograma: 'Desligado',
    statusMei: 'Informal / Sem CNPJ',
    totalFaltas: 2,
    totalReagendamentos: 1,
    totalCancelamentos: 1,
    dataCadastro: '2026-08-25',
    encontrosRealizados: 1,
    historicoNotas: 'Desligado automaticamente pelo sistema após registrar a segunda falta injustificada sem aviso prévio de 24h.'
  },
  {
    id: 'a6',
    nome: 'Mariana Dias',
    whatsapp: '11933332222',
    email: 'mariana.design@email.com',
    negocio: 'Dias Comunicação Visual',
    ramo: 'Serviços / Gráfica Rápida',
    statusPrograma: 'MEI Formalizado',
    statusMei: 'MEI Aberto e Ativo',
    totalFaltas: 0,
    totalReagendamentos: 0,
    totalCancelamentos: 0,
    dataCadastro: '2026-07-20',
    dataConclusao: '2026-09-05',
    encontrosRealizados: 5,
    historicoNotas: 'Caso de Sucesso! Formalizou MEI após o acompanhamento de 30 dias com suporte da equipe Co.Nexo.'
  }
];

// Data de hoje e próximos dias para visualização (Novembro 2026)
export const INITIAL_AGENDAMENTOS: Agendamento[] = [
  {
    id: 'ag1',
    alunoId: 'a1', // Arthur Santana
    consultorId: 'c1', // Aline
    tipo: 'mentoria_2h',
    data: '2026-11-09',
    horarioInicio: '15:00',
    horarioFim: '17:00',
    sala: 'Sala 204 - Bloco Empreendedorismo',
    status: 'agendado',
    lembreteEnviado24h: false,
    observacoes: 'Encontro 1: Separação de contas física e jurídica e introdução ao controle de compras da feira.'
  },
  {
    id: 'ag2',
    alunoId: 'a2', // Juliana Costa
    consultorId: 'c1', // Aline
    tipo: 'diagnostico_1h',
    data: '2026-11-09',
    horarioInicio: '13:00',
    horarioFim: '14:00',
    sala: 'Sala 204 - Bloco Empreendedorismo',
    status: 'confirmado',
    lembreteEnviado24h: true,
    dataEnvioLembrete: '2026-11-08 10:00',
    observacoes: 'Entrevista de alinhamento financeiro complementar.'
  },
  {
    id: 'ag3',
    alunoId: 'a4', // Vanessa Souza
    consultorId: 'c1', // Aline
    tipo: 'diagnostico_1h',
    data: '2026-11-09',
    horarioInicio: '14:00',
    horarioFim: '15:00',
    sala: 'Sala 204 - Bloco Empreendedorismo',
    status: 'confirmado',
    lembreteEnviado24h: true,
    dataEnvioLembrete: '2026-11-08 10:30',
    observacoes: 'Casamento perfeito de grade: 13h-14h + 14h-15h + 15h-17h preenchendo o turno de 4 horas sem ociosidade.'
  },
  {
    id: 'ag4',
    alunoId: 'a4',
    consultorId: 'c1',
    tipo: 'diagnostico_1h',
    data: '2026-11-12',
    horarioInicio: '13:00',
    horarioFim: '14:00',
    sala: 'Sala 204 - Bloco Empreendedorismo',
    status: 'agendado',
    lembreteEnviado24h: false,
    observacoes: 'ATENÇÃO MAX: Slot isolado de 1h! Necessário casar uma segunda entrevista de 1h das 14h às 15h para não ociar a consultora Aline.'
  },
  {
    id: 'ag5',
    alunoId: 'a3', // Henrique Souza
    consultorId: 'c1',
    tipo: 'mentoria_2h',
    data: '2026-11-13',
    horarioInicio: '14:00',
    horarioFim: '16:00',
    sala: 'Sala 204 - Bloco Empreendedorismo',
    status: 'confirmado',
    lembreteEnviado24h: true,
    observacoes: 'Mentoria 2: Validação de fluxo de caixa da barbearia.'
  }
];

export const INITIAL_DIARIOS: EntradaDiarioDeBordo[] = [
  {
    id: 'd1',
    alunoId: 'a1',
    consultorId: 'c1',
    agendamentoId: 'ag0_prev',
    numeroEncontro: 0, // Diagnóstico Inicial
    data: '2026-11-02',
    diagnosticoResumo: 'Arthur vende quentinhas de rua sozinho. Não sabe o lucro líquido real porque usa o dinheiro das vendas para pagar o mercado no mesmo dia. Tem R$ 400 em fiados anotados em pedaços de papelão.',
    orientacoesPrestadas: 'Explicado o conceito de pró-labore e separação de caixas. Mostrado como o fiado sem controle consome o capital de giro.',
    tarefaProximoEncontro: '1. Guardar todos os comprovantes de compras da feira durante 7 dias em um envelope. 2. Parar de anotar fiado em papelão e listar clientes devedores numa folha pautada.',
    tarefaStatusAnterior: 'pendente',
    statusFormalizacaoMei: 'Informal / Sem CNPJ',
    proximosPassos: 'Iniciar o Encontro 1 de Mentoria com a montagem da planilha simples de custos dos ingredientes das marmitas.',
    criadoEm: '2026-11-02 11:30'
  }
];

export const INITIAL_DUVIDAS: DuvidaMentorado[] = [
  {
    id: 'duv1',
    alunoId: 'a1',
    consultorId: 'c1',
    pergunta: 'Professora Aline, o dinheiro que uso para colocar gasolina na moto da entrega deve entrar no custo da marmita ou no meu gasto pessoal?',
    resposta: 'Olá Arthur! Esse custo é 100% operacional do seu negócio (logística/entrega). Guarde os comprovantes do posto no mesmo envelope das compras da feira que combinamos!',
    status: 'respondida',
    criadaEm: '2026-10-10 14:20',
    respondidaEm: '2026-10-10 16:45'
  }
];

export const INITIAL_MATERIAIS: MaterialApoio[] = [
  {
    id: 'm1',
    titulo: 'Modelo de Controle de Caixa Diário Simplificado',
    categoria: 'Gestão Financeira',
    descricao: 'Modelo prático para registrar entradas do dia e saídas de compras sem misturar com o dinheiro de casa.',
    linkOuTexto: 'https://senac.br/recursos/co-nexo/fluxo-de-caixa-iniciante.pdf',
    adicionadoPor: 'Aline Silva',
    criadoEm: '2026-10-02'
  },
  {
    id: 'm2',
    titulo: 'Guia do Passo a Passo para Abertura Gratuita do MEI',
    categoria: 'Formalização MEI',
    descricao: 'Como emitir o CNPJ pelo Portal do Empreendedor oficial do Governo Federal sem cair em golpes pagos.',
    linkOuTexto: 'https://gov.br/empresas-e-negocios/pt-br/empreendedor',
    adicionadoPor: 'Regis Santos',
    criadoEm: '2026-09-28'
  },
  {
    id: 'm3',
    titulo: 'Calculadora de Preço de Venda para Refeições e Quentinhas',
    categoria: 'Gestão Financeira',
    descricao: 'Descubra quanto custa a embalagem, arroz, feijão, proteína e seu lucro por marmita.',
    linkOuTexto: 'https://senac.br/recursos/co-nexo/calculadora-marmita.xlsx',
    adicionadoPor: 'Aline Silva',
    criadoEm: '2026-10-05'
  }
];
