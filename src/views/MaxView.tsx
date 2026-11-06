import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Clock, User, Phone, Check, AlertTriangle, 
  Send, UserPlus, Search, RefreshCw, XCircle, ShieldAlert,
  ChevronRight, CalendarPlus, CheckCircle
} from 'lucide-react';
import { TipoSessao } from '../types';
import { formatarDataAgenda } from '../utils/dateUtils';

export const MaxView: React.FC = () => {
  const { 
    alunos, consultores, agendamentos, 
    agendarSessao, marcarPresenca, reagendarSessao, 
    enviarLembreteWhatsApp, cadastrarAluno, activeTab
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal Novo Agendamento
  const [showModalAgendamento, setShowModalAgendamento] = useState(false);
  const [novoAlunoId, setNovoAlunoId] = useState(alunos[0]?.id || '');
  const [novoConsultorId, setNovoConsultorId] = useState(consultores[0]?.id || '');
  const [novoTipo, setNovoTipo] = useState<TipoSessao>('diagnostico_1h');
  const [novaData, setNovaData] = useState('2026-10-16');
  const [novoInicio, setNovoInicio] = useState('14:00');
  const [novoFim, setNovoFim] = useState('15:00');
  const [novaSala, setNovaSala] = useState('Sala 204 - Bloco Empreendedorismo');
  const [novasNotas, setNovasNotas] = useState('');

  // Modal Novo Aluno (Balcão/Recepção)
  const [showModalNovoAluno, setShowModalNovoAluno] = useState(false);
  const [nomeNovo, setNomeNovo] = useState('');
  const [whatsNovo, setWhatsNovo] = useState('');
  const [emailNovo, setEmailNovo] = useState('');
  const [negocioNovo, setNegocioNovo] = useState('');
  const [ramoNovo, setRamoNovo] = useState('');

  // Modal Reagendamento
  const [reagendandoAgId, setReagendandoAgId] = useState<string | null>(null);
  const [reagendarData, setReagendarData] = useState('2026-10-22');
  const [reagendarInicio, setReagendarInicio] = useState('13:00');
  const [reagendarFim, setReagendarFim] = useState('14:00');

  // Ajusta automaticamente fim de acordo com o tipo
  const handleTipoChange = (t: TipoSessao) => {
    setNovoTipo(t);
    const [h, m] = novoInicio.split(':').map(Number);
    const duracao = t === 'diagnostico_1h' ? 1 : 2;
    const hFim = String(h + duracao).padStart(2, '0');
    setNovoFim(`${hFim}:${String(m).padStart(2, '0')}`);
  };

  const handleInicioChange = (horario: string) => {
    setNovoInicio(horario);
    const [h, m] = horario.split(':').map(Number);
    const duracao = novoTipo === 'diagnostico_1h' ? 1 : 2;
    const hFim = String(h + duracao).padStart(2, '0');
    setNovoFim(`${hFim}:${String(m).padStart(2, '0')}`);
  };

  const handleSalvarAgendamento = (e: React.FormEvent) => {
    e.preventDefault();
    const res = agendarSessao({
      alunoId: novoAlunoId,
      consultorId: novoConsultorId,
      tipo: novoTipo,
      data: novaData,
      horarioInicio: novoInicio,
      horarioFim: novoFim,
      sala: novaSala,
      observacoes: novasNotas
    });

    if (res.success) {
      setShowModalAgendamento(false);
      setNovasNotas('');
    } else {
      alert(res.message);
    }
  };

  const handleSalvarNovoAluno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeNovo || !whatsNovo || !negocioNovo) {
      alert('Por favor, preencha os campos essenciais.');
      return;
    }
    const criado = cadastrarAluno({
      nome: nomeNovo,
      whatsapp: whatsNovo.replace(/\D/g, ''),
      email: emailNovo || `${nomeNovo.toLowerCase().replace(/\s+/g, '')}@email.com`,
      negocio: negocioNovo,
      ramo: ramoNovo || 'Geral',
      statusPrograma: 'Inscrito',
      statusMei: 'Informal / Sem CNPJ',
      historicoNotas: 'Cadastrado presencialmente no balcão por Max.'
    });

    setShowModalNovoAluno(false);
    setNomeNovo('');
    setWhatsNovo('');
    setEmailNovo('');
    setNegocioNovo('');
    setRamoNovo('');
    // Abre já o agendamento para ele
    setNovoAlunoId(criado.id);
    setShowModalAgendamento(true);
  };

  const handleExecutarReagendamento = () => {
    if (!reagendandoAgId) return;
    const res = reagendarSessao(reagendandoAgId, reagendarData, reagendarInicio, reagendarFim);
    if (!res.success) {
      alert(res.message);
    }
    setReagendandoAgId(null);
  };

  // Filtragem e Alertas Rápidos
  const agendamentosAmanha = agendamentos.filter(ag => ag.status === 'agendado' || ag.status === 'confirmado');
  const alunosEmRisco = alunos.filter(a => (a.totalFaltas === 1 || a.totalReagendamentos === 2) && a.statusPrograma !== 'Desligado');
  const alunosDesligados = alunos.filter(a => a.statusPrograma === 'Desligado');

  // Detecção de buracos de 1h ociosos no turno da Aline
  const agendamentosAline = agendamentos.filter(a => a.consultorId === 'c1' && a.status !== 'reagendado' && a.status !== 'cancelado_menos_24h');
  const slotsDe1h = agendamentosAline.filter(a => a.tipo === 'diagnostico_1h');
  const temBuracoPotencial = slotsDe1h.length % 2 !== 0;

  return (
    <div className="space-y-6">
      {/* Banner de Identificação do Operador */}
      <div className="bg-[#004B8D] rounded-2xl p-6 text-white shadow-md border-b-4 border-[#A1D900] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#A1D900] text-xs font-bold uppercase tracking-wider mb-1">
            <span>Posto de Atendimento e Recepção</span>
            <span>•</span>
            <span>Operador Responsável: Max</span>
          </div>
          <h2 className="text-2xl font-bold font-['Montserrat']">Painel de Controle da Grade e Assiduidade</h2>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl font-['Inter']">
            Acabe com o quebra-cabeça das planilhas: agende em blocos protegidos, controle faltas com regra rígida e envie lembretes 24h sem perder histórico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModalNovoAluno(true)}
            className="btn-conex-neon px-5 py-2.5 text-xs shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Aluno (Balcão)</span>
          </button>
          <button
            onClick={() => setShowModalAgendamento(true)}
            className="btn-conex-primary px-5 py-2.5 text-xs shadow-sm flex items-center gap-2 cursor-pointer border border-white/20"
          >
            <CalendarPlus className="w-4 h-4 text-[#A1D900]" />
            <span>Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas e Alertas Operacionais de Max */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {agendamentos.filter(a => !a.lembreteEnviado24h && a.status === 'agendado').length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lembretes 24h a Enviar</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{alunosEmRisco.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Alunos em Risco (1 Falta)</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{alunosDesligados.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Desligados por Regra</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#A1D900] flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {agendamentos.filter(a => a.status === 'confirmado').length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Presenças Pré-Confirmadas</div>
          </div>
        </div>
      </div>

      {/* Alerta Inteligente de Grade / Anti-Buraco de Horário */}
      {temBuracoPotencial && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="text-amber-900 dark:text-amber-200 font-semibold">Alerta do Quebra-Cabeça da Grade:</strong>
            <span className="text-amber-800 dark:text-amber-300 ml-1">
              Existe um número ímpar de entrevistas de 1h marcadas para a consultora Aline ({slotsDe1h.length} entrevistas). 
              Para evitar 1 hora ociosa não planejada no turno de 4h, case outra entrevista de 1h ou ajuste o horário para casar com uma mentoria de 2h.
            </span>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba Selecionada na Barra Lateral */}
      {/* ABA 1: GRADE DE ATENDIMENTOS & PRESENÇA */}
      {activeTab === 'agenda' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 dark:bg-[#1E252E]">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base font-['Montserrat']">Atendimentos Registrados no Sistema</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Regra rígida: Cancelamento com menos de 24h = 1 Falta. Limite: 2 Faltas ou 3 Reagendamentos = Desligamento.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 bg-white dark:bg-[#161B22] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              Turnos Padrão: 13h às 17h (Aline) • 08h às 12h (Regis)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 dark:bg-[#1E252E] text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Data & Horário</th>
                  <th className="py-3 px-4">Empreendedor (Aluno)</th>
                  <th className="py-3 px-4">Tipo de Sessão</th>
                  <th className="py-3 px-4">Consultora</th>
                  <th className="py-3 px-4">Status & Confirmação</th>
                  <th className="py-3 px-4 text-right">Ações de Presença (Max)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {agendamentos.map(ag => {
                  const aluno = alunos.find(a => a.id === ag.alunoId);
                  const consultor = consultores.find(c => c.id === ag.consultorId);
                  const isCanceladoOuFalta = ag.status === 'falta_injustificada' || ag.status === 'cancelado_menos_24h';
                  const isConcluido = ag.status === 'realizado';
                  const infoData = formatarDataAgenda(ag.data);

                  return (
                    <tr key={ag.id} className="hover:bg-slate-50/80 dark:hover:bg-[#1E252E]/60 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 dark:text-white">
                          {infoData.dia} de {infoData.mesAbrev}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-300 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{ag.horarioInicio} - {ag.horarioFim}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 font-['Montserrat']">
                          <span>{aluno?.nome || 'Aluno Removido'}</span>
                          {aluno?.totalFaltas === 1 && (
                            <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-bold border border-amber-200 dark:border-amber-800" title="1 Falta acumulada">
                              1 Falta
                            </span>
                          )}
                          {aluno?.statusPrograma === 'Desligado' && (
                            <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-[10px] px-1.5 py-0.2 rounded font-bold border border-rose-200 dark:border-rose-800">
                              Desligado
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{aluno?.negocio}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                          ag.tipo === 'diagnostico_1h'
                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        }`}>
                          {ag.tipo === 'diagnostico_1h' ? 'Diagnóstico (1h)' : 'Mentoria (2h)'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {consultor?.nome}
                        <div className="text-[11px] text-slate-400">{ag.sala}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {ag.status === 'confirmado' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            <Check className="w-3.5 h-3.5" /> Confirmado
                          </span>
                        )}
                        {ag.status === 'agendado' && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                            Agendado
                          </span>
                        )}
                        {ag.status === 'realizado' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                            Realizado
                          </span>
                        )}
                        {ag.status === 'falta_injustificada' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                            Falta Injustificada
                          </span>
                        )}
                        {ag.status === 'cancelado_menos_24h' && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                            Cancelou &lt;24h (Conta Falta)
                          </span>
                        )}
                        {ag.status === 'reagendado' && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md line-through">
                            Reagendado
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {ag.status !== 'realizado' && ag.status !== 'reagendado' && (
                            <>
                              {ag.status !== 'confirmado' && (
                                <button
                                  onClick={() => marcarPresenca(ag.id, 'confirmado')}
                                  title="Confirmar presença prévia do aluno"
                                  className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#A1D900] hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => marcarPresenca(ag.id, 'realizado')}
                                title="Marcar como Realizado (Compareceu)"
                                className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
                              >
                                Presente
                              </button>
                              <button
                                onClick={() => marcarPresenca(ag.id, 'cancelado_menos_24h')}
                                title="Cancelou com menos de 24h (Conta Falta no histórico)"
                                className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors cursor-pointer border border-amber-200 dark:border-amber-800"
                              >
                                &lt;24h
                              </button>
                              <button
                                onClick={() => marcarPresenca(ag.id, 'falta_injustificada')}
                                title="Falta Injustificada (Conta Falta e desliga se atingir 2)"
                                className="px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-medium hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors cursor-pointer border border-rose-200 dark:border-rose-800"
                              >
                                Falta
                              </button>
                              <button
                                onClick={() => {
                                  setReagendandoAgId(ag.id);
                                  setReagendarData(ag.data);
                                }}
                                title="Reagendar horário (Conta no limite de 3 reagendamentos)"
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          {ag.status === 'realizado' && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-[#A1D900]" />
                              <span>Concluído</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: CENTRAL DE LEMBRETES 24H (WHATSAPP) */}
      {activeTab === 'lembretes' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-['Montserrat']">Automação de Lembretes 24 Horas Antes</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Max não precisa mais digitar mensagens no celular do zero! Clique no botão para disparar o aviso formatado via WhatsApp e registrar a data de envio na nuvem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agendamentosAmanha.map(ag => {
              const aluno = alunos.find(a => a.id === ag.alunoId);
              const consultor = consultores.find(c => c.id === ag.consultorId);
              const dataFormatada = new Date(ag.data + 'T12:00:00').toLocaleDateString('pt-BR');

              return (
                <div key={ag.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-[#1E252E] flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">{aluno?.nome}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{aluno?.negocio} • Tel: {aluno?.whatsapp}</div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        ag.lembreteEnviado24h 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#A1D900] border border-emerald-200 dark:border-emerald-800' 
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {ag.lembreteEnviado24h ? 'Lembrete Enviado' : 'Aviso Pendente'}
                      </span>
                    </div>

                    <div className="mt-3 bg-white dark:bg-[#161B22] p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono space-y-1">
                      <div><strong>Data:</strong> {dataFormatada} às {ag.horarioInicio}</div>
                      <div><strong>Consultora:</strong> {consultor?.nome} ({ag.sala})</div>
                      <div><strong>Tipo:</strong> {ag.tipo === 'diagnostico_1h' ? 'Diagnóstico Inicial (1h)' : 'Mentoria de Negócios (2h)'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => {
                        const { link } = enviarLembreteWhatsApp(ag.id);
                        window.open(link, '_blank');
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{ag.lembreteEnviado24h ? 'Reenviar WhatsApp' : 'Disparar Lembrete WhatsApp'}</span>
                    </button>
                    {ag.status !== 'confirmado' && (
                      <button
                        onClick={() => marcarPresenca(ag.id, 'confirmado')}
                        className="bg-white dark:bg-[#161B22] border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#252D37] text-slate-700 dark:text-slate-200 font-medium text-xs py-2 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#A1D900]" />
                        <span>Confirmou</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 3: LISTA GERAL DE ALUNOS & HISTÓRICO */}
      {activeTab === 'alunos' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white font-['Montserrat']">Empreendedores Cadastrados no Co.Nexo</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Acompanhe o funil de cada participante e consulte faltas/reagendamentos antes de agendar.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nome ou negócio..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#004B8D] dark:focus:ring-[#A1D900]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-[#1E252E] text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Empreendedor & Negócio</th>
                  <th className="py-3 px-4">Contato</th>
                  <th className="py-3 px-4">Etapa do Programa</th>
                  <th className="py-3 px-4">Status MEI</th>
                  <th className="py-3 px-4 text-center">Faltas (Máx 2)</th>
                  <th className="py-3 px-4 text-center">Reagend. (Máx 3)</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {alunos
                  .filter(a => a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || a.negocio.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(aluno => (
                    <tr key={aluno.id} className="hover:bg-slate-50/80 dark:hover:bg-[#1E252E]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white font-['Montserrat']">{aluno.nome}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{aluno.negocio} ({aluno.ramo})</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-600 dark:text-slate-300">
                        {aluno.whatsapp}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          aluno.statusPrograma === 'Concluído' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#A1D900] border border-emerald-200 dark:border-emerald-800' :
                          aluno.statusPrograma === 'MEI Formalizado' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800' :
                          aluno.statusPrograma === 'Desligado' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                          'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {aluno.statusPrograma}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {aluno.statusMei}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          aluno.totalFaltas === 0 ? 'text-slate-600 dark:text-slate-400' :
                          aluno.totalFaltas === 1 ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                          'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}>
                          {aluno.totalFaltas} / 2
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          aluno.totalReagendamentos === 0 ? 'text-slate-600 dark:text-slate-400' :
                          aluno.totalReagendamentos === 2 ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                          aluno.totalReagendamentos >= 3 ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                          'text-slate-700 dark:text-slate-300'
                        }`}>
                          {aluno.totalReagendamentos} / 3
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setNovoAlunoId(aluno.id);
                            setShowModalAgendamento(true);
                          }}
                          className="text-xs text-[#004B8D] dark:text-[#A1D900] hover:underline font-semibold cursor-pointer"
                        >
                          + Agendar Sessão
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL NOVO AGENDAMENTO COM REGRA DO BLOCO DE 4 HORAS */}
      {showModalAgendamento && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg font-['Montserrat']">Novo Agendamento na Grade</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Validação automática de horário e limite de faltas</p>
              </div>
              <button 
                onClick={() => setShowModalAgendamento(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSalvarAgendamento} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Selecionar Empreendedor</label>
                <select
                  value={novoAlunoId}
                  onChange={e => setNovoAlunoId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-800 dark:text-slate-100"
                >
                  {alunos.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.nome} — {a.negocio} ({a.totalFaltas} faltas / {a.totalReagendamentos} reagendamentos) {a.statusPrograma === 'Desligado' ? '🚫 DESLIGADO' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipo de Sessão</label>
                  <select
                    value={novoTipo}
                    onChange={e => handleTipoChange(e.target.value as TipoSessao)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-800 dark:text-slate-100"
                  >
                    <option value="diagnostico_1h">Diagnóstico Inicial (1 hora)</option>
                    <option value="mentoria_2h">Mentoria de Negócios (2 horas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Consultora</label>
                  <select
                    value={novoConsultorId}
                    onChange={e => setNovoConsultorId(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-800 dark:text-slate-100"
                  >
                    {consultores.map(c => (
                      <option key={c.id} value={c.id}>{c.nome} ({c.turnoPadrao})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Data</label>
                  <input
                    type="date"
                    value={novaData}
                    onChange={e => setNovaData(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Início</label>
                  <input
                    type="time"
                    value={novoInicio}
                    onChange={e => handleInicioChange(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Fim (Calculado)</label>
                  <input
                    type="time"
                    value={novoFim}
                    readOnly
                    className="w-full p-2 bg-slate-100 dark:bg-[#1E252E] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs text-slate-600 dark:text-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sala Presencial no SENAC</label>
                <input
                  type="text"
                  value={novaSala}
                  onChange={e => setNovaSala(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Observações da Sessão</label>
                <textarea
                  rows={2}
                  value={novasNotas}
                  onChange={e => setNovasNotas(e.target.value)}
                  placeholder="Ex: Trazer comprovantes de compra da feira..."
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModalAgendamento(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-conex-primary px-4 py-2 text-xs shadow-sm cursor-pointer"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO ALUNO (BALCÃO) */}
      {showModalNovoAluno && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg font-['Montserrat']">Cadastro Rápido de Balcão</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sem fichas de papel ou cópia manual do RD Station</p>
              </div>
              <button 
                onClick={() => setShowModalNovoAluno(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSalvarNovoAluno} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo do Empreendedor</label>
                <input
                  type="text"
                  placeholder="Ex: Arthur Santana"
                  value={nomeNovo}
                  onChange={e => setNomeNovo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp (DDD + Número)</label>
                  <input
                    type="tel"
                    placeholder="11987654321"
                    value={whatsNovo}
                    onChange={e => setWhatsNovo(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ramo de Atividade</label>
                  <input
                    type="text"
                    placeholder="Ex: Alimentação"
                    value={ramoNovo}
                    onChange={e => setRamoNovo(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome do Negócio / Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Marmitaria do Arthur (Venda de Quentinhas)"
                  value={negocioNovo}
                  onChange={e => setNegocioNovo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">E-mail (Opcional)</label>
                <input
                  type="email"
                  placeholder="arthur@email.com"
                  value={emailNovo}
                  onChange={e => setEmailNovo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModalNovoAluno(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-conex-neon px-4 py-2 text-xs shadow-sm cursor-pointer"
                >
                  Cadastrar e Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE REAGENDAMENTO COM CONTROLE DE LIMITE */}
      {reagendandoAgId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Reagendar Atendimento</h3>
              <button 
                onClick={() => setReagendandoAgId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lembrete: Cada reagendamento é contabilizado. O limite rígido é de 3 reagendamentos.
            </p>

            <div className="space-y-2 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nova Data</label>
                <input
                  type="date"
                  value={reagendarData}
                  onChange={e => setReagendarData(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Novo Início</label>
                  <input
                    type="time"
                    value={reagendarInicio}
                    onChange={e => setReagendarInicio(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Novo Fim</label>
                  <input
                    type="time"
                    value={reagendarFim}
                    onChange={e => setReagendarFim(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setReagendandoAgId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecutarReagendamento}
                className="btn-conex-primary px-3 py-1.5 text-xs shadow-sm cursor-pointer"
              >
                Confirmar Reagendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
