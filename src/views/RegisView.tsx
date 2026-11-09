import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, Download, Award, 
  Clock, TrendingUp, FileSpreadsheet,
  Upload, Database, AlertTriangle
} from 'lucide-react';

export const RegisView: React.FC = () => {
  const { 
    alunos, agendamentos, activeTab,
    exportarBackupCloud, restaurarBackupCloud, atualizarStatusMei
  } = useApp();

  const [filtroFunil, setFiltroFunil] = useState<string>('todos');

  // Cálculos das 4 Perguntas Cruciais da Diretoria do SENAC:
  
  // 1. Quantos MEIs formalmente abertos?
  const totalMeisAbertos = alunos.filter(a => a.statusMei === 'MEI Aberto e Ativo' || a.statusPrograma === 'MEI Formalizado').length;
  const totalMeisEmProcesso = alunos.filter(a => a.statusMei === 'Em Análise / Documentação').length;

  // 2. Total de horas de mentoria presencial executadas
  const agendamentosRealizados = agendamentos.filter(a => a.status === 'realizado');
  const totalHorasExecutadas = agendamentosRealizados.reduce((acc, curr) => {
    return acc + (curr.tipo === 'diagnostico_1h' ? 1 : 2);
  }, 0);

  // 3. Índice de assiduidade e taxa de no-show
  const totalFaltasGerais = agendamentos.filter(a => a.status === 'falta_injustificada' || a.status === 'cancelado_menos_24h').length;
  const totalSessoesFinalizadas = agendamentosRealizados.length + totalFaltasGerais;
  const taxaNoShow = totalSessoesFinalizadas > 0 
    ? ((totalFaltasGerais / totalSessoesFinalizadas) * 100).toFixed(1)
    : '0.0';
  const taxaAssiduidade = (100 - Number(taxaNoShow)).toFixed(1);

  // 4. Etapas da Trilha (Funil)
  const contagemFunil = {
    inscritos: alunos.filter(a => a.statusPrograma === 'Inscrito' || a.statusPrograma === 'Diagnóstico Agendado').length,
    emTrilha: alunos.filter(a => a.statusPrograma.startsWith('Em Trilha')).length,
    concluidos: alunos.filter(a => a.statusPrograma === 'Concluído').length,
    meiAberto: totalMeisAbertos,
    desligados: alunos.filter(a => a.statusPrograma === 'Desligado').length
  };

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

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        restaurarBackupCloud(content);
      }
    };
    reader.readAsText(file);
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
          <h2 className="text-2xl font-bold font-['Montserrat']">Painel Executivo</h2>
          <p className="text-blue-100/90 text-xs mt-1 font-['Inter']">
            Indicadores estratégicos, evolução do funil e prestação de contas do programa.
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
          <button
            onClick={exportarBackupCloud}
            className="btn-conex-primary px-4 py-2 text-xs shadow-xs flex items-center gap-1.5 cursor-pointer border border-white/20"
          >
            <Download className="w-4 h-4 text-[#A1D900]" />
            <span>Backup JSON</span>
          </button>
        </div>
      </div>

      {/* ABA 1: DASHBOARD EXECUTIVO & KPIS */}
      {(activeTab === 'kpis' || !activeTab) && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
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
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                <span className="text-emerald-600 dark:text-[#A1D900] font-semibold">+{totalMeisEmProcesso}</span>
                <span>em formalização</span>
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
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                <span className="text-[#004B8D] dark:text-blue-300 font-semibold">{agendamentosRealizados.length}</span>
                <span>sessões realizadas</span>
              </div>
            </div>

            {/* KPI 3: Taxa de No-Show */}
            <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Taxa de No-Show
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">{taxaNoShow}%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                <span className="text-emerald-600 dark:text-[#A1D900] font-semibold">{taxaAssiduidade}%</span>
                <span>assiduidade</span>
              </div>
            </div>

            {/* KPI 4: Base Total de Alunos */}
            <div className="bg-white dark:bg-[#161B22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Participantes
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">{alunos.length}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Alunos na base
              </div>
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

      {/* ABA 4: AUDITORIA, BACKUP & NUVEM */}
      {activeTab === 'auditoria' && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#A1D900]" />
              <h3 className="font-bold text-white text-base font-['Montserrat']">Segurança e Backup de Dados</h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Armazenamento em nuvem com integridade referencial. Todos os agendamentos, presenças e prontuários estão protegidos.
            Gere cópias de segurança em formato JSON ou restaure backups anteriores a qualquer momento.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={exportarBackupCloud}
              className="btn-conex-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer border border-white/20"
            >
              <Download className="w-4 h-4 text-[#A1D900]" />
              <span>Fazer Backup (JSON)</span>
            </button>

            <label className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Restaurar JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleUploadBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
