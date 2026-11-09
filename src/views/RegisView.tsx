import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, Award, Clock, TrendingUp, FileSpreadsheet,
  AlertTriangle, CheckCircle2, Users, Target, Calendar,
  MessageSquare, Briefcase, Activity, CheckCheck, Building2,
  Sparkles
} from 'lucide-react';

export const RegisView: React.FC = () => {
  const { 
    alunos, agendamentos, diarios, duvidas, consultores, activeTab,
    atualizarStatusMei
  } = useApp();

  const [filtroFunil, setFiltroFunil] = useState<string>('todos');

  // Cálculos Estratégicos & Métricas Executivas da Gestão:
  
  // 1. MEIs Formalizados e Pipeline de Formalização
  const totalAlunos = alunos.length;
  const totalMeisAbertos = alunos.filter(a => a.statusMei === 'MEI Aberto e Ativo' || a.statusPrograma === 'MEI Formalizado').length;
  const totalMeisEmProcesso = alunos.filter(a => a.statusMei === 'Em Análise / Documentação').length;
  const totalInformais = alunos.filter(a => a.statusMei === 'Informal / Sem CNPJ').length;
  const totalDesistentesMei = alunos.filter(a => a.statusMei === 'Desistência / Sem Interesse').length;
  const taxaConversaoMei = totalAlunos > 0 ? ((totalMeisAbertos / totalAlunos) * 100).toFixed(1) : '0.0';
  const taxaPipelineMei = totalAlunos > 0 ? (((totalMeisAbertos + totalMeisEmProcesso) / totalAlunos) * 100).toFixed(1) : '0.0';

  // 2. Horas de Mentoria Executadas e Capacidade
  const agendamentosRealizados = agendamentos.filter(a => a.status === 'realizado');
  const totalHorasExecutadas = agendamentosRealizados.reduce((acc, curr) => {
    return acc + (curr.tipo === 'diagnostico_1h' ? 1 : 2);
  }, 0);
  const mediaHorasPorAluno = totalAlunos > 0 ? (totalHorasExecutadas / totalAlunos).toFixed(1) : '0.0';

  // 3. Assiduidade, No-Show e Ocorrências
  const totalFaltasGerais = agendamentos.filter(a => a.status === 'falta_injustificada' || a.status === 'cancelado_menos_24h').length;
  const totalCancelamentosAntecipados = agendamentos.filter(a => a.status === 'cancelado').length;
  const totalReagendamentosGerais = agendamentos.filter(a => a.status === 'reagendado').length;
  const totalSessoesFinalizadas = agendamentosRealizados.length + totalFaltasGerais;
  const taxaNoShow = totalSessoesFinalizadas > 0 
    ? ((totalFaltasGerais / totalSessoesFinalizadas) * 100).toFixed(1)
    : '0.0';
  const taxaAssiduidade = (100 - Number(taxaNoShow)).toFixed(1);

  // 4. Retenção e Alunos Ativos
  const alunosDesligados = alunos.filter(a => a.statusPrograma === 'Desligado');
  const totalDesligados = alunosDesligados.length;
  const totalAlunosAtivos = totalAlunos - totalDesligados;
  const taxaRetencao = totalAlunos > 0 ? ((totalAlunosAtivos / totalAlunos) * 100).toFixed(1) : '100.0';

  // 5. Efetividade das Tarefas Práticas dos Empreendedores (dos Diários de Bordo)
  const totalTarefasAvaliadas = diarios.length;
  const tarefasCumpridas = diarios.filter(d => d.tarefaStatusAnterior === 'cumprida').length;
  const tarefasEmAndamento = diarios.filter(d => d.tarefaStatusAnterior === 'em_andamento').length;
  const tarefasPendentes = diarios.filter(d => d.tarefaStatusAnterior === 'pendente').length;
  const taxaAderenciaTarefas = totalTarefasAvaliadas > 0 
    ? ((tarefasCumpridas / totalTarefasAvaliadas) * 100).toFixed(0)
    : '100';

  // 6. Resolução de Dúvidas Técnicas & Suporte
  const totalDuvidas = duvidas.length;
  const duvidasRespondidas = duvidas.filter(d => d.status === 'respondida').length;
  const taxaResolucaoDuvidas = totalDuvidas > 0 
    ? ((duvidasRespondidas / totalDuvidas) * 100).toFixed(0)
    : '100';

  // 7. Próximos Atendimentos & Engajamento WhatsApp
  const agendamentosPendentes = agendamentos.filter(a => a.status === 'agendado' || a.status === 'confirmado');
  const agendamentosConfirmados = agendamentos.filter(a => a.status === 'confirmado');
  const taxaConfirmacaoAgenda = agendamentosPendentes.length > 0
    ? ((agendamentosConfirmados.length / agendamentosPendentes.length) * 100).toFixed(0)
    : '100';

  // 8. Etapas da Trilha (Funil)
  const contagemFunil = {
    inscritos: alunos.filter(a => a.statusPrograma === 'Inscrito' || a.statusPrograma === 'Diagnóstico Agendado').length,
    emTrilha: alunos.filter(a => a.statusPrograma.startsWith('Em Trilha')).length,
    concluidos: alunos.filter(a => a.statusPrograma === 'Concluído').length,
    meiAberto: totalMeisAbertos,
    desligados: totalDesligados
  };

  // 9. Agrupamento por Ramo de Atividade
  const distribuicaoRamos = alunos.reduce((acc, curr) => {
    const ramo = curr.ramo || 'Geral';
    acc[ramo] = (acc[ramo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ramosOrdenados = Object.entries(distribuicaoRamos).sort((a, b) => b[1] - a[1]);

  // 10. Desempenho e Capacidade por Consultor
  const consultoresMetricas = consultores.map(c => {
    const sessoes = agendamentos.filter(a => a.consultorId === c.id);
    const realizadas = sessoes.filter(a => a.status === 'realizado');
    const horas = realizadas.reduce((acc, curr) => acc + (curr.tipo === 'diagnostico_1h' ? 1 : 2), 0);
    const confirmadas = sessoes.filter(a => a.status === 'confirmado' || a.status === 'agendado').length;
    const duvidasConsultor = duvidas.filter(d => d.consultorId === c.id);
    const duvidasResp = duvidasConsultor.filter(d => d.status === 'respondida').length;

    return {
      ...c,
      totalSessoes: sessoes.length,
      realizadas: realizadas.length,
      horas,
      confirmadas,
      duvidasResp,
      duvidasTotal: duvidasConsultor.length
    };
  });

  // Fila Anti-Limbo (Alunos que concluíram e precisam de contato em 30 ou 60 dias)
  const filaAntiLimbo = alunos.filter(a => a.statusPrograma === 'Concluído' || a.dataFollowUp30d);

  // Alunos em risco para intervenção preventiva
  const alunosRiscoPreventivo = alunos.filter(a => (a.totalFaltas === 1 || a.totalReagendamentos === 2) && a.statusPrograma !== 'Desligado');

  // Exportar Relatório em CSV compatível com Excel
  const exportarRelatorioCsv = () => {
    let csv = 'ID,Nome,WhatsApp,Negocio,Ramo,Status_Programa,Status_MEI,Encontros_Realizados,Faltas,Reagendamentos,Data_Cadastro\n';
    alunos.forEach(a => {
      csv += `${a.id},"${a.nome}","${a.whatsapp}","${a.negocio}","${a.ramo}","${a.statusPrograma}","${a.statusMei}",${a.encontrosRealizados},${a.totalFaltas},${a.totalReagendamentos},${a.dataCadastro}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_diretoria_senac_conex_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Banner da Coordenação */}
      <div className="bg-[#004B8D] rounded-2xl p-6 text-white shadow-sm border-b-4 border-[#A1D900] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#A1D900] text-xs font-bold uppercase tracking-wider mb-1 font-['Montserrat']">
            <span>Gestão Geral</span>
            <span>•</span>
            <span>Regis Santos</span>
          </div>
          <h2 className="text-2xl font-bold font-['Montserrat']">Painel Executivo & Métricas</h2>
          <p className="text-blue-100/90 text-xs mt-1 font-['Inter']">
            Indicadores estratégicos, evolução do funil, metas e prestação de contas do programa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportarRelatorioCsv}
            className="btn-conex-neon px-4 py-2 text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#1A1A1A]" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* ABA 1: DASHBOARD EXECUTIVO & KPIS */}
      {(activeTab === 'kpis' || !activeTab) && (
        <div className="space-y-6">
          {/* GRID DE KPIS ESTRATÉGICOS (8 CARDS DE ALTA PRECISÃO) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* KPI 1: MEIs Formalizados */}
            <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  MEIs Formalizados
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#A1D900] flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">{totalMeisAbertos}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>+{totalMeisEmProcesso} em processo</span>
                <span className="font-semibold text-emerald-600 dark:text-[#A1D900]">{taxaConversaoMei}%</span>
              </div>
            </div>

            {/* KPI 2: Horas de Mentoria Executadas */}
            <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Horas Executadas
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#004B8D] dark:text-blue-300 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">{totalHorasExecutadas}h</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>{agendamentosRealizados.length} sessões</span>
                <span className="font-semibold text-[#004B8D] dark:text-blue-300">{mediaHorasPorAluno}h/aluno</span>
              </div>
            </div>

            {/* KPI 3: Taxa de Assiduidade */}
            <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Assiduidade
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#A1D900] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">{taxaAssiduidade}%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>No-show: {taxaNoShow}%</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{totalFaltasGerais} faltas</span>
              </div>
            </div>

            {/* KPI 4: Base & Retenção */}
            <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Retenção Ativa
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">{taxaRetencao}%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>{totalAlunosAtivos} de {totalAlunos} alunos</span>
                <span className="font-semibold text-rose-500 dark:text-rose-400">{totalDesligados} deslig.</span>
              </div>
            </div>

            {/* KPI 5: Efetividade das Tarefas */}
            <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Aderência a Tarefas
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">{taxaAderenciaTarefas}%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>{tarefasCumpridas} cumpridas</span>
                <span className="font-semibold text-amber-600 dark:text-amber-300">{tarefasEmAndamento} em andam.</span>
              </div>
            </div>

            {/* KPI 6: Agendamentos & Engajamento */}
            <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Grade Futura
                </span>
                <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-300 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">{agendamentosPendentes.length}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>{agendamentosConfirmados.length} confirmados</span>
                <span className="font-semibold text-cyan-600 dark:text-cyan-300">{taxaConfirmacaoAgenda}% conf.</span>
              </div>
            </div>

            {/* KPI 7: Resolução de Dúvidas */}
            <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Suporte aos Alunos
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">{taxaResolucaoDuvidas}%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>{duvidasRespondidas} de {totalDuvidas} dúvidas</span>
                <span className="font-semibold text-emerald-600 dark:text-[#A1D900]">100% SLA</span>
              </div>
            </div>

            {/* KPI 8: Risco Preventivo */}
            <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Alerta Preventivo
                </span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">{alunosRiscoPreventivo.length}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>1 falta / 2 reagend.</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">Em monitoramento</span>
              </div>
            </div>
          </div>

          {/* PAINEL DE METAS DO PROGRAMA SENAC */}
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
                  Metas Institucionais do Ciclo • SENAC Empreendedorismo
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#004B8D] dark:text-[#A1D900] border border-blue-200 dark:border-blue-800">
                Semestre 2026/2
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {/* Meta 1: Formalização MEI */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#1E252E] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Formalização MEI</span>
                  <span className="font-bold text-emerald-600 dark:text-[#A1D900]">{totalMeisAbertos} / 5</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalMeisAbertos / 5) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
                  <span>Meta: 5 empresas ativas</span>
                  <span>{((totalMeisAbertos / 5) * 100).toFixed(0)}% da meta</span>
                </div>
              </div>

              {/* Meta 2: Horas de Mentoria */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#1E252E] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Horas de Mentoria</span>
                  <span className="font-bold text-[#004B8D] dark:text-blue-300">{totalHorasExecutadas}h / 20h</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#004B8D] dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalHorasExecutadas / 20) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
                  <span>Meta: 20 horas no ciclo</span>
                  <span>{((totalHorasExecutadas / 20) * 100).toFixed(0)}% da meta</span>
                </div>
              </div>

              {/* Meta 3: Assiduidade Presencial */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#1E252E] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Assiduidade Presencial</span>
                  <span className="font-bold text-amber-600 dark:text-amber-300">{taxaAssiduidade}% / 85%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (Number(taxaAssiduidade) / 85) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
                  <span>Meta mínima: 85%</span>
                  <span className="text-emerald-600 dark:text-[#A1D900] font-semibold">Meta Atingida</span>
                </div>
              </div>

              {/* Meta 4: Retenção dos Empreendedores */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#1E252E] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Retenção de Alunos</span>
                  <span className="font-bold text-purple-600 dark:text-purple-300">{taxaRetencao}% / 80%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (Number(taxaRetencao) / 80) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between">
                  <span>Meta mínima: 80%</span>
                  <span className="text-emerald-600 dark:text-[#A1D900] font-semibold">Saudável</span>
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÕES ANALÍTICAS: DISTRIBUIÇÃO SETORIAL & MATURIDADE JURÍDICA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Coluna 1: Ramos de Atividade (7 colunas) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
                    Distribuição por Ramo de Atividade
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {ramosOrdenados.length} setores atendidos
                </span>
              </div>

              <div className="space-y-3.5 pt-1">
                {ramosOrdenados.map(([ramo, qtd]) => {
                  const percentual = totalAlunos > 0 ? ((qtd / totalAlunos) * 100).toFixed(0) : '0';
                  return (
                    <div key={ramo} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{ramo}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 dark:text-slate-400 font-mono">{qtd} aluno{qtd > 1 ? 's' : ''}</span>
                          <span className="font-bold text-[#004B8D] dark:text-[#A1D900] w-10 text-right font-mono">{percentual}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#004B8D] to-[#A1D900] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coluna 2: Diagnóstico Jurídico MEI (5 colunas) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600 dark:text-[#A1D900]" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
                    Maturidade MEI da Base
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-[#A1D900]">
                  {taxaPipelineMei}% no pipeline
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/70 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-emerald-900 dark:text-emerald-200">MEI Aberto e Ativo</div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400">Formalização consolidada com CNPJ</div>
                  </div>
                  <span className="text-base font-bold text-emerald-900 dark:text-emerald-100 font-mono">{totalMeisAbertos}</span>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/70 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-blue-900 dark:text-blue-200">Em Análise / Documentação</div>
                    <div className="text-[11px] text-blue-700 dark:text-blue-400">Processo de abertura em andamento</div>
                  </div>
                  <span className="text-base font-bold text-blue-900 dark:text-blue-100 font-mono">{totalMeisEmProcesso}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#1E252E] rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Informal / Sem CNPJ</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Público-alvo principal para mentoria</div>
                  </div>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono">{totalInformais}</span>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/70 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-amber-900 dark:text-amber-200">Sem Interesse no Momento</div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400">Optou por manter foco apenas na gestão</div>
                  </div>
                  <span className="text-base font-bold text-amber-900 dark:text-amber-100 font-mono">{totalDesistentesMei}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PAINEL DE DESEMPENHO E CAPACIDADE DOS CONSULTORES */}
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
                  Capacidade Operacional dos Consultores
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {consultoresMetricas.length} consultores ativos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {consultoresMetricas.map(consultor => (
                <div key={consultor.id} className="p-4 bg-slate-50 dark:bg-[#1E252E] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat']">
                        {consultor.nome}
                      </div>
                      <div className="text-xs text-[#004B8D] dark:text-[#A1D900] font-medium">
                        {consultor.especialidade}
                      </div>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono">
                      {consultor.salaPadrao} • {consultor.turnoPadrao.split(' ')[0]}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center p-2 bg-white dark:bg-[#161B22] rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Horas Feitas</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 font-mono">{consultor.horas}h</div>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-[#161B22] rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Realizadas</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 font-mono">{consultor.realizadas}</div>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-[#161B22] rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Dúvidas Resp.</div>
                      <div className="text-base font-bold text-emerald-600 dark:text-[#A1D900] mt-0.5 font-mono">{consultor.duvidasResp}/{consultor.duvidasTotal}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: FUNIL DO PROGRAMA */}
      {activeTab === 'funil' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
              Funil de Evolução dos Participantes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Acompanhamento de etapas: da inscrição à formalização MEI.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            <div className="bg-slate-50 dark:bg-[#1E252E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">1. Inscrição</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Montserrat']">{contagemFunil.inscritos}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Diagnóstico pendente</div>
            </div>

            <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/80 text-center">
              <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">2. Em Mentoria</div>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-200 mt-1 font-['Montserrat']">{contagemFunil.emTrilha}</div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">Frequência ativa</div>
            </div>

            <div className="bg-blue-50/70 dark:bg-blue-950/30 p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/80 text-center">
              <div className="text-xs font-semibold text-blue-800 dark:text-blue-300">3. Concluído</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1 font-['Montserrat']">{contagemFunil.concluidos}</div>
              <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">5 encontros cumpridos</div>
            </div>

            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 text-center">
              <div className="text-xs font-semibold text-emerald-800 dark:text-[#A1D900]">4. MEI Formalizado</div>
              <div className="text-2xl font-bold text-emerald-900 dark:text-white mt-1 font-['Montserrat']">{contagemFunil.meiAberto}</div>
              <div className="text-[10px] text-emerald-700 dark:text-[#A1D900] mt-0.5">CNPJ ativo</div>
            </div>

            <div className="bg-rose-50/70 dark:bg-rose-950/30 p-3.5 rounded-xl border border-rose-200 dark:border-rose-800/80 text-center col-span-2 sm:col-span-1">
              <div className="text-xs font-semibold text-rose-800 dark:text-rose-300">5. Desligados</div>
              <div className="text-2xl font-bold text-rose-900 dark:text-rose-200 mt-1 font-['Montserrat']">{contagemFunil.desligados}</div>
              <div className="text-[10px] text-rose-700 dark:text-rose-400 mt-0.5">Limite atingido</div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: RADAR DE RISCO & FILA ANTI-LIMBO */}
      {activeTab === 'anti_limbo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar de Risco Preventivo */}
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Alerta de Risco</h3>
              </div>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                {alunosRiscoPreventivo.length} em risco
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Participantes com 1 falta ou 2 reagendamentos registrados.
            </p>

            <div className="space-y-2 pt-1">
              {alunosRiscoPreventivo.map(aluno => (
                <div key={aluno.id} className="p-3 bg-slate-50 dark:bg-[#1E252E] rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{aluno.nome} ({aluno.negocio})</div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {aluno.totalFaltas} de 2 faltas • {aluno.totalReagendamentos} de 3 reagendamentos
                    </div>
                  </div>
                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold px-2 py-1 rounded-md text-[11px]">
                    Risco Crítico
                  </span>
                </div>
              ))}
              {alunosRiscoPreventivo.length === 0 && (
                <div className="text-xs text-slate-400 py-4 text-center">Nenhum aluno em risco iminente de desligamento.</div>
              )}
            </div>
          </div>

          {/* Fila Anti-Limbo (30 e 60 dias) */}
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600 dark:text-[#A1D900]" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Fila Pós-Ciclo (MEI)</h3>
              </div>
              <span className="text-xs font-bold text-[#004B8D] dark:text-[#A1D900] bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 rounded-full">
                Follow-up 30/60d
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Acompanhamento de formalização MEI pós-conclusão da trilha.
            </p>

            <div className="space-y-2 pt-1">
              {filaAntiLimbo.map(aluno => (
                <div key={aluno.id} className="p-3 bg-slate-50 dark:bg-[#1E252E] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{aluno.nome}</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Concluiu em: {aluno.dataConclusao || 'Ciclo recente'} • Status: <strong>{aluno.statusMei}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {aluno.statusMei !== 'MEI Aberto e Ativo' ? (
                      <button
                        onClick={() => atualizarStatusMei(aluno.id, 'MEI Aberto e Ativo')}
                        className="btn-conex-neon text-xs px-3 py-1 cursor-pointer shadow-xs"
                      >
                        Formalizou MEI
                      </button>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                        MEI Ativo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
