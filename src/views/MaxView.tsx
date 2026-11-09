import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Clock, User, Phone, Check, AlertTriangle, 
  Send, UserPlus, Search, RefreshCw, XCircle, ShieldAlert,
  ChevronRight, CalendarPlus, CheckCircle, CalendarDays, ListFilter
} from 'lucide-react';
import { TipoSessao } from '../types';
import { formatarDataAgenda } from '../utils/dateUtils';
import { SearchableSelect } from '../components/SearchableSelect';
import { CalendarView } from '../components/CalendarView';

const RAMOS_ATIVIDADE_OPCOES = [
  'Alimentação / Gastronomia',
  'Confeitaria & Panificação',
  'Beleza & Estética (Cabelo, Barba, Unhas)',
  'Moda, Vestuário & Confecção',
  'Artesanato, Costura & Decoração',
  'Comércio Varejista & Loja Física',
  'Comércio Online / E-commerce',
  'Serviços Gerais & Manutenção',
  'Construção Civil & Reformas',
  'Tecnologia, Informática & Web',
  'Marketing Digital & Redes Sociais',
  'Saúde, Fitness & Bem-Estar',
  'Educação, Aulas & Treinamentos',
  'Pet Care & Veterinária',
  'Transporte, Logística & Entregas',
  'Fotografia, Eventos & Festas',
  'Consultoria & Serviços Administrativos',
  'Outros / Diversos'
];

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
  const [novaData, setNovaData] = useState(() => new Date().toISOString().split('T')[0]);
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
  const [reagendarData, setReagendarData] = useState(() => new Date().toISOString().split('T')[0]);
  const [reagendarInicio, setReagendarInicio] = useState('13:00');
  const [reagendarFim, setReagendarFim] = useState('14:00');

  // Modo de visualização da Grade de Atendimentos: Semana, Mês ou Tabela
  const [modoVisualizacaoAgenda, setModoVisualizacaoAgenda] = useState<'semana' | 'mes' | 'tabela'>('semana');

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
      <div className="bg-[#004B8D] rounded-2xl p-6 text-white shadow-sm border-b-4 border-[#A1D900] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#A1D900] text-xs font-bold uppercase tracking-wider mb-1 font-['Montserrat']">
            <span>Recepção</span>
            <span>•</span>
            <span>Max Santos</span>
          </div>
          <h2 className="text-2xl font-bold font-['Montserrat']">Grade e Assiduidade</h2>
          <p className="text-blue-100/90 text-xs mt-1 font-['Inter']">
            Gestão operacional de agendamentos, confirmações de presença e controle de assiduidade.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowModalNovoAluno(true)}
            className="btn-conex-neon px-4 py-2 text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Aluno</span>
          </button>
          <button
            onClick={() => setShowModalAgendamento(true)}
            className="btn-conex-primary px-4 py-2 text-xs shadow-xs flex items-center gap-1.5 cursor-pointer border border-white/20"
          >
            <CalendarPlus className="w-4 h-4 text-[#A1D900]" />
            <span>Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas Operacionais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-['Montserrat']">
              {agendamentos.filter(a => !a.lembreteEnviado24h && a.status === 'agendado').length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lembretes Pendentes</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-['Montserrat']">{alunosEmRisco.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Alunos em Risco (1 Falta)</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-['Montserrat']">{alunosDesligados.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Desligados por Regra</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#A1D900] flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-['Montserrat']">
              {agendamentos.filter(a => a.status === 'confirmado').length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Presenças Confirmadas</div>
          </div>
        </div>
      </div>

      {/* Alerta de Grade */}
      {temBuracoPotencial && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Ajuste de Grade:</strong> Há {slotsDe1h.length} entrevista(s) de 1h agendada(s) para Aline. Ajuste os horários para evitar intervalos ociosos no turno.
          </span>
        </div>
      )}

      {/* Conteúdo da Aba Selecionada */}
      {/* ABA 1: GRADE DE ATENDIMENTOS & PRESENÇA */}
      {activeTab === 'agenda' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50/50 dark:bg-[#1E252E]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat']">Grade de Atendimentos</h3>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300 bg-white dark:bg-[#161B22] px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  Turnos: 13h–17h (Aline) • 08h–12h (Regis)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Cancelamento &lt; 24h contabiliza falta • Limite: 2 faltas ou 3 reagendamentos
              </p>
            </div>

            {/* Alternador de Visualização: Semana, Mês ou Tabela */}
            <div className="flex items-center bg-slate-200/80 dark:bg-[#0D1117] p-1 rounded-xl border border-slate-300/60 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setModoVisualizacaoAgenda('semana')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  modoVisualizacaoAgenda === 'semana'
                    ? 'bg-white dark:bg-[#161B22] text-[#004B8D] dark:text-[#A1D900] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Semana</span>
              </button>
              <button
                type="button"
                onClick={() => setModoVisualizacaoAgenda('mes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  modoVisualizacaoAgenda === 'mes'
                    ? 'bg-white dark:bg-[#161B22] text-[#004B8D] dark:text-[#A1D900] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Mês</span>
              </button>
              <button
                type="button"
                onClick={() => setModoVisualizacaoAgenda('tabela')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  modoVisualizacaoAgenda === 'tabela'
                    ? 'bg-white dark:bg-[#161B22] text-[#004B8D] dark:text-[#A1D900] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Tabela</span>
              </button>
            </div>
          </div>

          {modoVisualizacaoAgenda !== 'tabela' ? (
            <div className="p-4">
              <CalendarView
                agendamentos={agendamentos}
                alunos={alunos}
                consultores={consultores}
                viewMode={modoVisualizacaoAgenda}
                onViewModeChange={setModoVisualizacaoAgenda}
                onMarcarPresenca={marcarPresenca}
                onReagendar={(id, dataAtual) => {
                  setReagendandoAgId(id);
                  setReagendarData(dataAtual);
                }}
                onNovoAgendamentoParaData={(dataEscolhida, horaEscolhida) => {
                  setNovaData(dataEscolhida);
                  if (horaEscolhida) {
                    setNovoInicio(horaEscolhida);
                    const [h, m] = horaEscolhida.split(':').map(Number);
                    const duracao = novoTipo === 'diagnostico_1h' ? 1 : 2;
                    const hFim = String(h + duracao).padStart(2, '0');
                    setNovoFim(`${hFim}:${String(m || 0).padStart(2, '0')}`);
                  }
                  setShowModalAgendamento(true);
                }}
              />
            </div>
          ) : (
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
        )}
      </div>
    )}

      {/* ABA 2: CENTRAL DE LEMBRETES 24H (WHATSAPP) */}
      {activeTab === 'lembretes' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Montserrat']">Lembretes de 24 Horas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notificação e confirmação de presença dos atendimentos das próximas 24h via WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {agendamentosAmanha.map(ag => {
              const aluno = alunos.find(a => a.id === ag.alunoId);
              const consultor = consultores.find(c => c.id === ag.consultorId);
              const dataFormatada = new Date(ag.data + 'T12:00:00').toLocaleDateString('pt-BR');

              return (
                <div key={ag.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/70 dark:bg-[#1E252E] flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat']">{aluno?.nome}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{aluno?.negocio} • Tel: {aluno?.whatsapp}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        ag.lembreteEnviado24h 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#A1D900] border border-emerald-200 dark:border-emerald-800' 
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {ag.lembreteEnviado24h ? 'Enviado' : 'Pendente'}
                      </span>
                    </div>

                    <div className="mt-2.5 bg-white dark:bg-[#161B22] p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="flex justify-between">
                        <span><strong>Data:</strong> {dataFormatada} às {ag.horarioInicio}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{ag.tipo === 'diagnostico_1h' ? '1h' : '2h'}</span>
                      </div>
                      <div><strong>Consultora:</strong> {consultor?.nome} ({ag.sala})</div>
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
                      <span>{ag.lembreteEnviado24h ? 'Reenviar WhatsApp' : 'Enviar Lembrete'}</span>
                    </button>
                    {ag.status !== 'confirmado' && (
                      <button
                        onClick={() => marcarPresenca(ag.id, 'confirmado')}
                        className="bg-white dark:bg-[#161B22] border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#252D37] text-slate-700 dark:text-slate-200 font-medium text-xs py-2 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#A1D900]" />
                        <span>Confirmar</span>
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
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Montserrat']">Empreendedores Cadastrados</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lista de participantes e controle de faltas e reagendamentos.
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
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Novo Cadastro</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Cadastro presencial no balcão de atendimento</p>
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
                  <SearchableSelect
                    value={ramoNovo}
                    onChange={setRamoNovo}
                    options={RAMOS_ATIVIDADE_OPCOES}
                    placeholder="Selecione ou pesquise..."
                    align="right"
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
              Limite: até 3 reagendamentos por participante.
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
