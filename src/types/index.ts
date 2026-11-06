export type Role = 'max' | 'aline' | 'arthur' | 'regis' | null;

export type StatusPrograma = 
  | 'Inscrito'
  | 'Diagnóstico Agendado'
  | 'Em Trilha (Encontro 1)'
  | 'Em Trilha (Encontro 2)'
  | 'Em Trilha (Encontro 3)'
  | 'Em Trilha (Encontro 4)'
  | 'Em Trilha (Encontro 5)'
  | 'Concluído'
  | 'MEI Formalizado'
  | 'Desligado';

export type StatusMEI = 
  | 'Informal / Sem CNPJ'
  | 'Em Análise / Documentação'
  | 'MEI Aberto e Ativo'
  | 'Desistência / Sem Interesse';

export type TipoSessao = 'diagnostico_1h' | 'mentoria_2h';

export type StatusAgendamento = 
  | 'agendado'
  | 'confirmado'
  | 'realizado'
  | 'falta_injustificada'
  | 'cancelado_menos_24h'
  | 'cancelado'
  | 'reagendado';

export interface Aluno {
  id: string;
  nome: string;
  whatsapp: string;
  email: string;
  negocio: string;
  ramo: string;
  statusPrograma: StatusPrograma;
  statusMei: StatusMEI;
  totalFaltas: number;
  totalReagendamentos: number;
  totalCancelamentos: number;
  dataCadastro: string;
  dataConclusao?: string;
  dataFollowUp30d?: string;
  dataFollowUp60d?: string;
  encontrosRealizados: number;
  historicoNotas?: string;
}

export interface Consultor {
  id: string;
  nome: string;
  email: string;
  turnoPadrao: 'Manhã (08h-12h)' | 'Tarde (13h-17h)' | 'Noite (18h-22h)';
  salaPadrao: string;
  especialidade: string;
}

export interface Agendamento {
  id: string;
  alunoId: string;
  consultorId: string;
  tipo: TipoSessao;
  data: string; // YYYY-MM-DD
  horarioInicio: string; // HH:mm
  horarioFim: string; // HH:mm
  sala: string;
  status: StatusAgendamento;
  lembreteEnviado24h: boolean;
  dataEnvioLembrete?: string;
  observacoes?: string;
}

export interface EntradaDiarioDeBordo {
  id: string;
  alunoId: string;
  consultorId: string;
  agendamentoId: string;
  numeroEncontro: number; // 0 = diagnostico, 1..5 = mentorias
  data: string;
  diagnosticoResumo: string;
  orientacoesPrestadas: string;
  tarefaProximoEncontro: string;
  tarefaStatusAnterior: 'pendente' | 'em_andamento' | 'cumprida';
  statusFormalizacaoMei: StatusMEI;
  proximosPassos: string;
  criadoEm: string;
}

export interface DuvidaMentorado {
  id: string;
  alunoId: string;
  consultorId: string;
  pergunta: string;
  resposta?: string;
  status: 'aberta' | 'respondida';
  criadaEm: string;
  respondidaEm?: string;
}

export interface MaterialApoio {
  id: string;
  titulo: string;
  categoria: 'Gestão Financeira' | 'Vendas & Clientes' | 'Formalização MEI' | 'Controles Diários';
  descricao: string;
  linkOuTexto: string;
  adicionadoPor: string;
  criadoEm: string;
}
