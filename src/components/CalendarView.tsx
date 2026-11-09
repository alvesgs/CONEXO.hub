import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, 
  User, Check, AlertTriangle, RefreshCw, CheckCircle, 
  Plus, X, Filter, MapPin, Briefcase, Phone, ExternalLink
} from 'lucide-react';
import { Agendamento, Aluno, Consultor, StatusAgendamento, TipoSessao } from '../types';

interface CalendarViewProps {
  agendamentos: Agendamento[];
  alunos: Aluno[];
  consultores: Consultor[];
  viewMode: 'semana' | 'mes';
  onViewModeChange?: (mode: 'semana' | 'mes') => void;
  onMarcarPresenca: (agendamentoId: string, status: StatusAgendamento) => void;
  onReagendar: (agendamentoId: string, dataAtual: string) => void;
  onNovoAgendamentoParaData?: (data: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  agendamentos,
  alunos,
  consultores,
  viewMode,
  onViewModeChange,
  onMarcarPresenca,
  onReagendar,
  onNovoAgendamentoParaData,
}) => {
  // Inicializa na data do primeiro agendamento futuro/existente ou hoje (padrão out/2026 nos dados de teste)
  const initialDate = useMemo(() => {
    if (agendamentos.length > 0) {
      // Procura primeiro agendamento ordenado
      const sorted = [...agendamentos].sort((a, b) => a.data.localeCompare(b.data));
      const [y, m, d] = sorted[0].data.split('-').map(Number);
      return new Date(y, m - 1, d, 12, 0, 0);
    }
    return new Date();
  }, []);

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedConsultorId, setSelectedConsultorId] = useState<string>('todos');
  const [detalheAgendamento, setDetalheAgendamento] = useState<Agendamento | null>(null);

  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const diasSemanaNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const diasSemanaAbrev = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  // Anos disponíveis para navegação anual
  const anosDisponiveis = [2024, 2025, 2026, 2027, 2028];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Filtragem por consultor se selecionado
  const agendamentosFiltrados = useMemo(() => {
    if (selectedConsultorId === 'todos') return agendamentos;
    return agendamentos.filter(ag => ag.consultorId === selectedConsultorId);
  }, [agendamentos, selectedConsultorId]);

  // Mapa de agendamentos por chave de data YYYY-MM-DD
  const agendamentosPorData = useMemo(() => {
    const map: Record<string, Agendamento[]> = {};
    agendamentosFiltrados.forEach(ag => {
      if (!map[ag.data]) {
        map[ag.data] = [];
      }
      map[ag.data].push(ag);
    });
    // Ordena cada dia pelo horário de início
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio));
    });
    return map;
  }, [agendamentosFiltrados]);

  // Navegação anterior / próximo
  const handleAnterior = () => {
    const nova = new Date(currentDate);
    if (viewMode === 'mes') {
      nova.setMonth(nova.getMonth() - 1);
    } else {
      nova.setDate(nova.getDate() - 7);
    }
    setCurrentDate(nova);
  };

  const handleProximo = () => {
    const nova = new Date(currentDate);
    if (viewMode === 'mes') {
      nova.setMonth(nova.getMonth() + 1);
    } else {
      nova.setDate(nova.getDate() + 7);
    }
    setCurrentDate(nova);
  };

  const handleHoje = () => {
    setCurrentDate(new Date());
  };

  const handleIrParaOutubro2026 = () => {
    setCurrentDate(new Date(2026, 9, 16, 12, 0, 0));
  };

  const handleMudarMes = (mesIdx: number) => {
    const nova = new Date(currentDate);
    nova.setMonth(mesIdx);
    setCurrentDate(nova);
  };

  const handleMudarAno = (ano: number) => {
    const nova = new Date(currentDate);
    nova.setFullYear(ano);
    setCurrentDate(nova);
  };

  // Helper para formatar YYYY-MM-DD com segurança de fuso
  const formatYMD = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dia}`;
  };

  // CÁLCULO DOS DIAS DO MÊS (GRADE 7x6 = 42 dias com Segunda como início)
  const diasDoMesGrid = useMemo(() => {
    const primeiroDiaMes = new Date(currentYear, currentMonth, 1, 12, 0, 0);
    let primeiroDiaSemana = primeiroDiaMes.getDay(); // 0 = Domingo, 1 = Segunda, ...
    // Ajusta para Segunda ser 0 e Domingo ser 6
    const offsetInicio = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1;

    const dias: { date: Date; dateStr: string; isCurrentMonth: boolean; isToday: boolean }[] = [];
    const hojeStr = formatYMD(new Date());

    // Início na segunda-feira correspondente
    const inicioGrid = new Date(primeiroDiaMes);
    inicioGrid.setDate(inicioGrid.getDate() - offsetInicio);

    for (let i = 0; i < 42; i++) {
      const d = new Date(inicioGrid);
      d.setDate(inicioGrid.getDate() + i);
      const dateStr = formatYMD(d);
      dias.push({
        date: d,
        dateStr,
        isCurrentMonth: d.getMonth() === currentMonth,
        isToday: dateStr === hojeStr
      });
    }

    // Se a última linha (últimos 7 dias) for inteiramente do próximo mês, corta para 35
    const ultimaLinhaPertenceProximoMes = dias.slice(35).every(d => !d.isCurrentMonth);
    return ultimaLinhaPertenceProximoMes ? dias.slice(0, 35) : dias;
  }, [currentYear, currentMonth]);

  // CÁLCULO DOS DIAS DA SEMANA ATUAL (Segunda a Domingo)
  const diasDaSemanaGrid = useMemo(() => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 12, 0, 0);
    const day = d.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);

    const hojeStr = formatYMD(new Date());
    const dias: { date: Date; dateStr: string; isToday: boolean }[] = [];

    for (let i = 0; i < 7; i++) {
      const proximo = new Date(monday);
      proximo.setDate(monday.getDate() + i);
      const dateStr = formatYMD(proximo);
      dias.push({
        date: proximo,
        dateStr,
        isToday: dateStr === hojeStr
      });
    }
    return dias;
  }, [currentDate]);

  // Helper de cores e badges de status
  const getStatusBadge = (status: StatusAgendamento) => {
    switch (status) {
      case 'confirmado':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          label: 'Confirmado'
        };
      case 'agendado':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          dot: 'bg-blue-500',
          label: 'Agendado'
        };
      case 'realizado':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-400',
          label: 'Realizado'
        };
      case 'falta_injustificada':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          dot: 'bg-rose-500',
          label: 'Falta Injustificada'
        };
      case 'cancelado_menos_24h':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500',
          label: 'Cancelou <24h'
        };
      case 'reagendado':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 line-through',
          dot: 'bg-slate-400',
          label: 'Reagendado'
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200',
          dot: 'bg-slate-400',
          label: status
        };
    }
  };

  // Helper para tipo de sessão
  const getTipoSessaoBadge = (tipo: TipoSessao) => {
    if (tipo === 'diagnostico_1h') {
      return {
        label: 'Diagnóstico (1h)',
        badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        borderLeft: 'border-l-purple-500'
      };
    }
    return {
      label: 'Mentoria (2h)',
      badge: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      borderLeft: 'border-l-indigo-500'
    };
  };

  // Total de agendamentos no período selecionado
  const totalAgendamentosPeriodo = useMemo(() => {
    if (viewMode === 'mes') {
      return diasDoMesGrid
        .filter(d => d.isCurrentMonth)
        .reduce((acc, d) => acc + (agendamentosPorData[d.dateStr]?.length || 0), 0);
    } else {
      return diasDaSemanaGrid.reduce((acc, d) => acc + (agendamentosPorData[d.dateStr]?.length || 0), 0);
    }
  }, [viewMode, diasDoMesGrid, diasDaSemanaGrid, agendamentosPorData]);

  return (
    <div className="space-y-4">
      {/* BARRA SUPERIOR DE CONTROLES: NAVEGAÇÃO ANUAL, MENSAL E SEMANAL */}
      <div className="bg-slate-50/70 dark:bg-[#1E252E] p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Título do Período e Navegadores Rápidos */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={handleAnterior}
              title={viewMode === 'mes' ? 'Mês anterior' : 'Semana anterior'}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleHoje}
              title="Ir para a data de hoje"
              className="px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
            >
              Hoje
            </button>
            <button
              onClick={handleProximo}
              title={viewMode === 'mes' ? 'Próximo mês' : 'Próxima semana'}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Atalho caso queira voltar para Outubro de 2026 (base de dados de exemplo) */}
          {currentYear !== 2026 || currentMonth !== 9 ? (
            <button
              onClick={handleIrParaOutubro2026}
              className="text-[11px] font-medium text-[#004B8D] dark:text-[#A1D900] bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800 cursor-pointer hover:underline"
              title="Ver agendamentos cadastrados de demonstração"
            >
              Ir para Out/2026
            </button>
          ) : null}

          {/* Nome do Mês e Ano por extenso */}
          <div className="ml-1">
            <span className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
              {mesesNomes[currentMonth]} {currentYear}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block sm:inline sm:ml-2">
              ({totalAgendamentosPeriodo} {totalAgendamentosPeriodo === 1 ? 'atendimento' : 'atendimentos'})
            </span>
          </div>
        </div>

        {/* Seletores Diretos: Mês, Ano e Filtro de Consultor */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor de Mês (Durante o ano) */}
          <select
            value={currentMonth}
            onChange={e => handleMudarMes(Number(e.target.value))}
            className="p-1.5 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
          >
            {mesesNomes.map((nome, idx) => (
              <option key={nome} value={idx}>{nome}</option>
            ))}
          </select>

          {/* Seletor de Ano */}
          <select
            value={currentYear}
            onChange={e => handleMudarAno(Number(e.target.value))}
            className="p-1.5 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
          >
            {anosDisponiveis.map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>

          {/* Filtro por Consultor */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedConsultorId}
              onChange={e => setSelectedConsultorId(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos os Consultores</option>
              {consultores.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Alternador de Modo Semana / Mês (se fornecido externamente ou interno) */}
          {onViewModeChange && (
            <div className="flex items-center bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeChange('semana')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'semana'
                    ? 'bg-[#004B8D] text-white dark:bg-[#A1D900] dark:text-[#0D1117]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Semana
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('mes')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'mes'
                    ? 'bg-[#004B8D] text-white dark:bg-[#A1D900] dark:text-[#0D1117]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mês
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODO 1: VISUALIZAÇÃO MENSAL (GRADE COMPLETA DO MÊS)          */}
      {/* ============================================================ */}
      {viewMode === 'mes' && (
        <div className="bg-white dark:bg-[#161B22] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {/* Cabeçalho dos Dias da Semana */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1E252E] text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
            {diasSemanaNomes.map((dia, idx) => (
              <div key={dia} className="py-2.5 px-1 truncate">
                <span className="hidden sm:inline">{dia}</span>
                <span className="sm:hidden">{diasSemanaAbrev[idx]}</span>
              </div>
            ))}
          </div>

          {/* Grade de Células de Dias */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800">
            {diasDoMesGrid.map((celula, idx) => {
              const diaNum = celula.date.getDate();
              const agsDoDia = agendamentosPorData[celula.dateStr] || [];
              const isWeekend = celula.date.getDay() === 0 || celula.date.getDay() === 6;

              return (
                <div
                  key={`${celula.dateStr}-${idx}`}
                  className={`min-h-[105px] p-1.5 flex flex-col justify-between transition-colors ${
                    !celula.isCurrentMonth
                      ? 'bg-slate-50/50 dark:bg-[#0D1117]/50 text-slate-400 dark:text-slate-600'
                      : isWeekend
                      ? 'bg-slate-50/30 dark:bg-[#12161D]'
                      : 'bg-white dark:bg-[#161B22]'
                  }`}
                >
                  {/* Topo da Célula: Número do Dia e Botão Adicionar */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        celula.isToday
                          ? 'bg-[#004B8D] text-white dark:bg-[#A1D900] dark:text-[#0D1117] font-bold'
                          : celula.isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {diaNum}
                    </span>

                    <div className="flex items-center gap-1">
                      {agsDoDia.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#004B8D] dark:text-blue-300">
                          {agsDoDia.length}
                        </span>
                      )}
                      {onNovoAgendamentoParaData && celula.isCurrentMonth && (
                        <button
                          type="button"
                          onClick={() => onNovoAgendamentoParaData(celula.dateStr)}
                          title={`Agendar para ${celula.dateStr}`}
                          className="opacity-0 hover:opacity-100 focus:opacity-100 p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-opacity cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lista de Atendimentos no Dia */}
                  <div className="space-y-1 flex-1 overflow-hidden">
                    {agsDoDia.slice(0, 3).map(ag => {
                      const aluno = alunos.find(a => a.id === ag.alunoId);
                      const statusInfo = getStatusBadge(ag.status);
                      const tipoInfo = getTipoSessaoBadge(ag.tipo);

                      return (
                        <button
                          key={ag.id}
                          type="button"
                          onClick={() => setDetalheAgendamento(ag)}
                          className={`w-full text-left p-1 rounded text-[11px] border leading-tight transition-all truncate block cursor-pointer hover:shadow-xs ${statusInfo.bg}`}
                          title={`${ag.horarioInicio} - ${aluno?.nome || 'Aluno'} (${tipoInfo.label})`}
                        >
                          <div className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusInfo.dot}`} />
                            <span className="font-mono text-[10px] font-bold shrink-0">{ag.horarioInicio}</span>
                            <span className="truncate font-medium">{aluno?.nome?.split(' ')[0] || 'Aluno'}</span>
                          </div>
                        </button>
                      );
                    })}

                    {agsDoDia.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setDetalheAgendamento(agsDoDia[0])}
                        className="text-[10px] text-slate-500 dark:text-slate-400 hover:underline pl-1 block font-medium"
                      >
                        +{agsDoDia.length - 3} mais...
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODO 2: VISUALIZAÇÃO SEMANAL (7 COLUNAS COM DETALHES DE HORA) */}
      {/* ============================================================ */}
      {viewMode === 'semana' && (
        <div className="bg-white dark:bg-[#161B22] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {/* Subtítulo informativo da semana */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1E252E] flex justify-between items-center text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Semana de {diasDaSemanaGrid[0].date.getDate()} de {mesesNomes[diasDaSemanaGrid[0].date.getMonth()]} a {diasDaSemanaGrid[6].date.getDate()} de {mesesNomes[diasDaSemanaGrid[6].date.getMonth()]} de {diasDaSemanaGrid[6].date.getFullYear()}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Clique em qualquer atendimento para gerenciar presença ou reagendar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            {diasDaSemanaGrid.map(diaInfo => {
              const diaNomeSemana = diasSemanaNomes[diaInfo.date.getDay() === 0 ? 6 : diaInfo.date.getDay() - 1];
              const diaNum = diaInfo.date.getDate();
              const mesAbrev = mesesNomes[diaInfo.date.getMonth()].slice(0, 3);
              const agsDoDia = agendamentosPorData[diaInfo.dateStr] || [];
              const isWeekend = diaInfo.date.getDay() === 0 || diaInfo.date.getDay() === 6;

              return (
                <div
                  key={diaInfo.dateStr}
                  className={`min-h-[350px] p-2.5 flex flex-col ${
                    diaInfo.isToday
                      ? 'bg-blue-50/20 dark:bg-[#004B8D]/10'
                      : isWeekend
                      ? 'bg-slate-50/30 dark:bg-[#12161D]'
                      : 'bg-white dark:bg-[#161B22]'
                  }`}
                >
                  {/* Cabeçalho do dia */}
                  <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {diaNomeSemana}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-sm font-bold px-1.5 py-0.2 rounded-md ${
                            diaInfo.isToday
                              ? 'bg-[#004B8D] text-white dark:bg-[#A1D900] dark:text-[#0D1117]'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {diaNum}
                        </span>
                        <span className="text-xs text-slate-400">{mesAbrev}</span>
                      </div>
                    </div>

                    {onNovoAgendamentoParaData && (
                      <button
                        type="button"
                        onClick={() => onNovoAgendamentoParaData(diaInfo.dateStr)}
                        title={`Novo agendamento em ${diaNum}/${mesAbrev}`}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Lista de Atendimentos */}
                  <div className="space-y-2 flex-1">
                    {agsDoDia.length === 0 ? (
                      <div className="h-full flex items-center justify-center p-4 text-center">
                        <span className="text-[11px] text-slate-400 italic">Sem atendimentos</span>
                      </div>
                    ) : (
                      agsDoDia.map(ag => {
                        const aluno = alunos.find(a => a.id === ag.alunoId);
                        const consultor = consultores.find(c => c.id === ag.consultorId);
                        const statusInfo = getStatusBadge(ag.status);
                        const tipoInfo = getTipoSessaoBadge(ag.tipo);

                        return (
                          <div
                            key={ag.id}
                            className={`p-2.5 rounded-xl border border-l-4 shadow-2xs transition-all hover:shadow-xs bg-slate-50/70 dark:bg-[#1E252E] ${tipoInfo.borderLeft} border-slate-200 dark:border-slate-700 space-y-1.5`}
                          >
                            {/* Horário e Tipo */}
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {ag.horarioInicio} - {ag.horarioFim}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${statusInfo.bg}`}>
                                {statusInfo.label}
                              </span>
                            </div>

                            {/* Aluno & Negócio */}
                            <div>
                              <button
                                type="button"
                                onClick={() => setDetalheAgendamento(ag)}
                                className="font-semibold text-xs text-slate-900 dark:text-white hover:text-[#004B8D] dark:hover:text-[#A1D900] text-left block truncate w-full cursor-pointer"
                              >
                                {aluno?.nome || 'Aluno'}
                              </button>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {aluno?.negocio || 'Negócio'}
                              </div>
                            </div>

                            {/* Consultor e Sala */}
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                              <User className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{consultor?.nome?.split(' ')[0]} • {ag.sala.split(' - ')[0]}</span>
                            </div>

                            {/* Ações Rápidas de Presença */}
                            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-1">
                              {ag.status !== 'realizado' && ag.status !== 'reagendado' && (
                                <>
                                  {ag.status !== 'confirmado' && (
                                    <button
                                      type="button"
                                      onClick={() => onMarcarPresenca(ag.id, 'confirmado')}
                                      title="Confirmar Presença"
                                      className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#A1D900] hover:bg-emerald-100 dark:hover:bg-emerald-900/60 cursor-pointer"
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => onMarcarPresenca(ag.id, 'realizado')}
                                    title="Marcar como Realizado"
                                    className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 cursor-pointer"
                                  >
                                    Pres.
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onMarcarPresenca(ag.id, 'cancelado_menos_24h')}
                                    title="Cancelou <24h"
                                    className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold hover:bg-amber-200 cursor-pointer"
                                  >
                                    &lt;24h
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onMarcarPresenca(ag.id, 'falta_injustificada')}
                                    title="Falta Injustificada"
                                    className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-[10px] font-bold hover:bg-rose-200 cursor-pointer"
                                  >
                                    Falta
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onReagendar(ag.id, ag.data)}
                                    title="Reagendar"
                                    className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                              {ag.status === 'realizado' && (
                                <span className="text-[10px] text-emerald-600 dark:text-[#A1D900] font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Concluído
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL DETALHADO DO AGENDAMENTO (AO CLICAR NO CALENDÁRIO)     */}
      {/* ============================================================ */}
      {detalheAgendamento && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          {(() => {
            const ag = detalheAgendamento;
            const aluno = alunos.find(a => a.id === ag.alunoId);
            const consultor = consultores.find(c => c.id === ag.consultorId);
            const statusInfo = getStatusBadge(ag.status);
            const tipoInfo = getTipoSessaoBadge(ag.tipo);
            const [anoStr, mesStr, diaStr] = ag.data.split('-');

            return (
              <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${tipoInfo.badge}`}>
                      {tipoInfo.label}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat'] mt-1">
                      {aluno?.nome || 'Empreendedor'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {aluno?.negocio || 'Negócio'} {aluno?.ramo ? `(${aluno.ramo})` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetalheAgendamento(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                {/* Informações de Data, Horário e Local */}
                <div className="space-y-2 text-xs bg-slate-50 dark:bg-[#0D1117] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      Data:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {diaStr}/{mesStr}/{anoStr}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Horário:
                    </span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {ag.horarioInicio} às {ag.horarioFim}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Local / Sala:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {ag.sala}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Consultor(a):
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {consultor?.nome}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 dark:text-slate-400">Status Atual:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Contato WhatsApp */}
                {aluno?.whatsapp && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161B22]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <div className="text-[10px] text-slate-400">WhatsApp</div>
                        <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">{aluno.whatsapp}</div>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/55${aluno.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 dark:text-[#A1D900] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Ações de Presença para a Recepção (Max) */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ações de Operação (Recepção)
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {ag.status !== 'confirmado' && ag.status !== 'realizado' && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarcarPresenca(ag.id, 'confirmado');
                          setDetalheAgendamento(null);
                        }}
                        className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#A1D900] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirmar Presença</span>
                      </button>
                    )}

                    {ag.status !== 'realizado' && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarcarPresenca(ag.id, 'realizado');
                          setDetalheAgendamento(null);
                        }}
                        className="p-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Marcar Presente</span>
                      </button>
                    )}

                    {ag.status !== 'realizado' && ag.status !== 'cancelado_menos_24h' && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarcarPresenca(ag.id, 'cancelado_menos_24h');
                          setDetalheAgendamento(null);
                        }}
                        className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold hover:bg-amber-100 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Cancelou &lt;24h</span>
                      </button>
                    )}

                    {ag.status !== 'realizado' && ag.status !== 'falta_injustificada' && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarcarPresenca(ag.id, 'falta_injustificada');
                          setDetalheAgendamento(null);
                        }}
                        className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Falta Injustificada</span>
                      </button>
                    )}

                    {ag.status !== 'realizado' && (
                      <button
                        type="button"
                        onClick={() => {
                          setDetalheAgendamento(null);
                          onReagendar(ag.id, ag.data);
                        }}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-200 flex items-center justify-center gap-1.5 cursor-pointer col-span-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reagendar Horário do Atendimento</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setDetalheAgendamento(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
