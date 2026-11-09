import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, Calendar, Clock, PlusCircle, CheckCircle2, 
  MessageSquare, FileText, Send, User, ChevronRight, 
  HelpCircle, Sparkles, AlertCircle
} from 'lucide-react';
import { StatusMEI } from '../types';
import { formatarDataAgenda } from '../utils/dateUtils';

export const AlineView: React.FC = () => {
  const { 
    alunos, agendamentos, diarios, duvidas, materiais,
    selectedAlunoId, setSelectedAlunoId,
    salvarDiarioDeBordo, responderDuvida, adicionarMaterial,
    marcarPresenca, activeTab, setActiveTab
  } = useApp();

  // Formulário de Nova Entrada no Diário de Bordo
  const [novoEncontroNum, setNovoEncontroNum] = useState<number>(1);
  const [novoDiagnostico, setNovoDiagnostico] = useState('');
  const [novasOrientacoes, setNovasOrientacoes] = useState('');
  const [novaTarefa, setNovaTarefa] = useState('');
  const [statusTarefaAnt, setStatusTarefaAnt] = useState<'pendente' | 'em_andamento' | 'cumprida'>('cumprida');
  const [novoStatusMei, setNovoStatusMei] = useState<StatusMEI>('Informal / Sem CNPJ');
  const [novosPassos, setNovosPassos] = useState('');

  // Resposta de Dúvida
  const [respostaTexto, setRespostaTexto] = useState<{ [key: string]: string }>({});

  // Novo Material
  const [novoMatTitulo, setNovoMatTitulo] = useState('');
  const [novoMatCat, setNovoMatCat] = useState<'Gestão Financeira' | 'Vendas & Clientes' | 'Formalização MEI' | 'Controles Diários'>('Gestão Financeira');
  const [novoMatDesc, setNovoMatDesc] = useState('');
  const [novoMatLink, setNovoMatLink] = useState('');
  const [showModalMaterial, setShowModalMaterial] = useState(false);

  const alunoAtual = alunos.find(a => a.id === selectedAlunoId) || alunos[0];
  const diariosDoAluno = diarios.filter(d => d.alunoId === alunoAtual?.id);
  const duvidasPendentes = duvidas.filter(d => d.consultorId === 'c1' || d.alunoId === alunoAtual?.id);
  const meusAgendamentos = agendamentos.filter(a => a.consultorId === 'c1');

  const handleSalvarDiario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoDiagnostico || !novaTarefa) {
      alert('Por favor, preencha o diagnóstico e as tarefas combinadas.');
      return;
    }

    salvarDiarioDeBordo({
      alunoId: alunoAtual.id,
      consultorId: 'c1', // Aline
      agendamentoId: `ag_aline_${Date.now()}`,
      numeroEncontro: novoEncontroNum,
      data: new Date().toISOString().split('T')[0],
      diagnosticoResumo: novoDiagnostico,
      orientacoesPrestadas: novasOrientacoes,
      tarefaProximoEncontro: novaTarefa,
      tarefaStatusAnterior: statusTarefaAnt,
      statusFormalizacaoMei: novoStatusMei,
      proximosPassos: novosPassos
    });

    // Limpa formulário
    setNovoDiagnostico('');
    setNovasOrientacoes('');
    setNovaTarefa('');
    setNovosPassos('');
  };

  const handleSalvarMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoMatTitulo || !novoMatLink) return;
    adicionarMaterial({
      titulo: novoMatTitulo,
      categoria: novoMatCat,
      descricao: novoMatDesc,
      linkOuTexto: novoMatLink,
      adicionadoPor: 'Aline Silva'
    });
    setShowModalMaterial(false);
    setNovoMatTitulo('');
    setNovoMatDesc('');
    setNovoMatLink('');
  };

  return (
    <div className="space-y-6">
      {/* Banner de Identificação da Consultora */}
      <div className="bg-[#004B8D] rounded-2xl p-6 text-white shadow-sm border-b-4 border-[#A1D900] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#A1D900] text-xs font-bold uppercase tracking-wider mb-1 font-['Montserrat']">
            <span>Mentoria de Negócios</span>
            <span>•</span>
            <span>Aline Silva</span>
          </div>
          <h2 className="text-2xl font-bold font-['Montserrat']">Prontuário e Grade</h2>
          <p className="text-blue-100/90 text-xs mt-1 font-['Inter']">
            Acompanhamento do histórico de evolução, prontuários de mentoria e grade semanal.
          </p>
        </div>

        <div className="bg-[#334195] border border-blue-400/30 rounded-xl px-4 py-2 text-xs text-white">
          <div><strong>Turno:</strong> 13h às 17h (Tarde)</div>
          <div className="text-blue-200 text-[11px]">Sala 204 • Presencial</div>
        </div>
      </div>

      {/* Conteúdo da Aba Selecionada na Barra Lateral */}
      {/* ABA 1: PRONTUÁRIO DIGITAL UNIFICADO (DIÁRIO DE BORDO) */}
      {activeTab === 'prontuario' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Seletor Lateral de Empreendedor */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-['Montserrat']">
              Selecionar Empreendedor
            </h3>
            <div className="space-y-2">
              {alunos.map(aluno => {
                const isSelected = aluno.id === alunoAtual?.id;
                return (
                  <button
                    key={aluno.id}
                    onClick={() => setSelectedAlunoId(aluno.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#004B8D] text-white border-[#004B8D] shadow-sm font-semibold'
                        : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-[#1A1A1A] dark:text-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {aluno.nome}
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-[#A1D900] text-[#1A1A1A] font-bold' 
                          : aluno.statusPrograma === 'Concluído' 
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                            : aluno.statusPrograma === 'MEI Formalizado' 
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300' 
                              : aluno.statusPrograma === 'Desligado' 
                                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300' 
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}>
                        {aluno.statusPrograma}
                      </span>
                    </div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                      {aluno.negocio}
                    </div>
                    <div className={`text-[11px] mt-2 flex justify-between ${isSelected ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span>{aluno.encontrosRealizados} de 5 encontros</span>
                      <span className={`font-medium ${isSelected ? 'text-[#A1D900]' : 'text-slate-700 dark:text-slate-300'}`}>
                        {aluno.statusMei}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área Principal do Prontuário */}
          <div className="lg:col-span-8 space-y-6">
            {alunoAtual ? (
              <>
                {/* Cabeçalho do Prontuário do Aluno */}
                <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Montserrat']">{alunoAtual.nome}</h3>
                      <span className="bg-slate-100 dark:bg-[#1E252E] text-slate-700 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-md font-mono border border-slate-200 dark:border-slate-700">
                        {alunoAtual.ramo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {alunoAtual.negocio} • WhatsApp: {alunoAtual.whatsapp} • Desde: {alunoAtual.dataCadastro}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#A1D900] border border-emerald-200 dark:border-emerald-800">
                      Situação: {alunoAtual.statusMei}
                    </span>
                  </div>
                </div>

                {/* Linha do Tempo de Entradas Anteriores */}
                <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 font-['Montserrat']">
                      <BookOpen className="w-5 h-5 text-emerald-600 dark:text-[#A1D900]" />
                      <span>Linha do Tempo de Sessões & Evolução</span>
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">
                      {diariosDoAluno.length} registros no prontuário
                    </span>
                  </div>

                  {diariosDoAluno.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      Nenhum registro no prontuário para este aluno ainda. Faça o primeiro registro abaixo!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {diariosDoAluno.map(diario => (
                        <div key={diario.id} className="border-l-4 border-emerald-500 bg-slate-50 dark:bg-[#1E252E] p-4 rounded-r-xl space-y-2 border border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                              {diario.numeroEncontro === 0 ? 'Diagnóstico Inicial (1h)' : `Encontro ${diario.numeroEncontro} de Mentoria (2h)`}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 font-mono">{diario.data}</span>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Diagnóstico & Descobertas:</div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{diario.diagnosticoResumo}</p>
                          </div>

                          {diario.orientacoesPrestadas && (
                            <div>
                              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Orientações Transmitidas:</div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{diario.orientacoesPrestadas}</p>
                            </div>
                          )}

                          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
                            <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span>Tarefas Combinadas com o Empreendedor:</span>
                            </div>
                            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 font-medium">{diario.tarefaProximoEncontro}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Formulário Ágil de Registro de Novo Atendimento */}
                <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 font-['Montserrat']">
                      <PlusCircle className="w-5 h-5 text-emerald-600 dark:text-[#A1D900]" />
                      <span>Registrar Sessão no Prontuário</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Registro de diagnóstico, orientações e tarefas combinadas na sessão.
                    </p>
                  </div>

                  <form onSubmit={handleSalvarDiario} className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Número do Encontro</label>
                        <select
                          value={novoEncontroNum}
                          onChange={e => setNovoEncontroNum(Number(e.target.value))}
                          className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                        >
                          <option value={1}>Encontro 1 de 5 (Custos & Contas)</option>
                          <option value={2}>Encontro 2 de 5 (Precificação & Margem)</option>
                          <option value={3}>Encontro 3 de 5 (Vendas & Clientes)</option>
                          <option value={4}>Encontro 4 de 5 (Planejamento Semanal)</option>
                          <option value={5}>Encontro 5 de 5 (Fechamento & Rumo ao MEI)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status da Tarefa Anterior</label>
                        <select
                          value={statusTarefaAnt}
                          onChange={e => setStatusTarefaAnt(e.target.value as any)}
                          className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                        >
                          <option value="cumprida">✅ Cumprida com Sucesso</option>
                          <option value="em_andamento">⏳ Em Andamento / Parcial</option>
                          <option value="pendente">❌ Não Conseguiu Fazer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status Formalização MEI</label>
                        <select
                          value={novoStatusMei}
                          onChange={e => setNovoStatusMei(e.target.value as StatusMEI)}
                          className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                        >
                          <option value="Informal / Sem CNPJ">Informal / Sem CNPJ</option>
                          <option value="Em Análise / Documentação">Em Análise / Documentação</option>
                          <option value="MEI Aberto e Ativo">MEI Aberto e Ativo 🎉</option>
                          <option value="Desistência / Sem Interesse">Sem Interesse no Momento</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Diagnóstico & O que foi trabalhado hoje</label>
                      <textarea
                        rows={3}
                        value={novoDiagnostico}
                        onChange={e => setNovoDiagnostico(e.target.value)}
                        placeholder="Ex: Montamos a planilha de custo dos ingredientes das marmitas. Arthur percebeu que estava vendendo o frango assado abaixo do custo de reposição..."
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Orientações Transmitidas</label>
                      <input
                        type="text"
                        value={novasOrientacoes}
                        onChange={e => setNovasOrientacoes(e.target.value)}
                        placeholder="Ex: Ajustar o valor da marmita grande de R$ 18 para R$ 22 a partir de segunda-feira."
                        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-xl space-y-1">
                      <label className="block text-xs font-bold text-emerald-900 dark:text-[#A1D900]">
                        Tarefas para o Empreendedor Levar Feitas (Aparece no Painel de Arthur)
                      </label>
                      <textarea
                        rows={2}
                        value={novaTarefa}
                        onChange={e => setNovaTarefa(e.target.value)}
                        placeholder="Ex: 1. Aplicar a nova tabela de preços. 2. Guardar as notas da compra do arroz e óleo para o próximo encontro."
                        className="w-full p-2 bg-white dark:bg-[#0D1117] border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-conex-neon text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Salvar Prontuário</span>
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-[#161B22] p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
                Selecione um empreendedor à esquerda para carregar o diário de bordo.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: MINHA GRADE DE ATENDIMENTOS (Com Dia, Mês e Horário e Alto Contraste) */}
      {activeTab === 'grade' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Grade de Atendimentos</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Atendimentos agendados para o turno da tarde (13h às 17h).
              </p>
            </div>
            <div className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#A1D900] px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              Sala 204 • Bloco Empreendedorismo
            </div>
          </div>

          <div className="space-y-3">
            {meusAgendamentos.map(ag => {
              const aluno = alunos.find(a => a.id === ag.alunoId);
              const infoData = formatarDataAgenda(ag.data);

              return (
                <div 
                  key={ag.id} 
                  className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/80 dark:bg-[#1E252E] hover:bg-slate-100 dark:hover:bg-[#252D37] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Bloco de Horário e Data */}
                    <div className="w-24 text-center shrink-0 bg-white dark:bg-[#161B22] p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">{ag.horarioInicio}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">às {ag.horarioFim}</div>
                      <div className="text-[10px] font-bold text-[#004B8D] dark:text-[#A1D900] mt-1 border-t border-slate-100 dark:border-slate-800 pt-0.5">
                        {infoData.dia} {infoData.mesAbrev}
                      </div>
                    </div>

                    <div className="h-10 w-px bg-slate-200 dark:border-slate-700 hidden sm:block" />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat']">{aluno?.nome}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          ag.tipo === 'diagnostico_1h' 
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800' 
                            : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        }`}>
                          {ag.tipo === 'diagnostico_1h' ? 'Diagnóstico 1h' : 'Mentoria 2h'}
                        </span>
                      </div>
                      
                      {/* Dia, Mês e Horário Explícitos */}
                      <div className="text-xs text-slate-700 dark:text-slate-200 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 dark:text-white">{aluno?.negocio}</span>
                        <span className="text-slate-400">•</span>
                        <span className="inline-flex items-center gap-1 font-medium">
                          📅 <strong>{infoData.dia} de {infoData.mes}</strong> ({infoData.diaSemanaAbrev})
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="inline-flex items-center gap-1 font-mono">
                          ⏰ {ag.horarioInicio} às {ag.horarioFim}
                        </span>
                      </div>

                      {ag.observacoes && (
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 italic bg-white/60 dark:bg-[#161B22]/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                          "{ag.observacoes}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      ag.status === 'confirmado' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#A1D900] border border-emerald-200 dark:border-emerald-800' :
                      ag.status === 'realizado' ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700' :
                      ag.status === 'agendado' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800' :
                      'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {ag.status === 'confirmado' ? '✅ Confirmado por Max' :
                       ag.status === 'realizado' ? 'Atendimento Concluído' :
                       ag.status === 'agendado' ? 'Aguardando Lembrete' : ag.status}
                    </span>

                    {aluno && (
                      <button
                        onClick={() => {
                          setSelectedAlunoId(aluno.id);
                          setActiveTab('prontuario');
                        }}
                        className="px-3.5 py-1.5 bg-white dark:bg-[#161B22] border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#252D37] text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-xs"
                      >
                        Abrir Prontuário
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 3: DÚVIDAS DOS ALUNOS */}
      {activeTab === 'duvidas' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Dúvidas dos Mentorados</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perguntas e orientações enviadas pelos participantes entre os encontros presenciais.
            </p>
          </div>

          <div className="space-y-4">
            {duvidasPendentes.map(d => {
              const aluno = alunos.find(a => a.id === d.alunoId);
              return (
                <div key={d.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-[#1E252E] space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{aluno?.nome}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">({aluno?.negocio})</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{d.criadaEm}</span>
                  </div>

                  <div className="bg-white dark:bg-[#161B22] p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100">
                    <strong className="text-slate-900 dark:text-white">Dúvida do Empreendedor:</strong>
                    <p className="mt-1 text-slate-700 dark:text-slate-200">{d.pergunta}</p>
                  </div>

                  {d.status === 'respondida' ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-lg text-xs text-emerald-900 dark:text-emerald-200">
                      <div className="flex justify-between items-center font-bold">
                        <span>Sua Resposta:</span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono">{d.respondidaEm}</span>
                      </div>
                      <p className="mt-1">{d.resposta}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Digite sua orientação técnica para ajudar o aluno..."
                        value={respostaTexto[d.id] || ''}
                        onChange={e => setRespostaTexto({ ...respostaTexto, [d.id]: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-[#0D1117] border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            if (!respostaTexto[d.id]) return;
                            responderDuvida(d.id, respostaTexto[d.id]);
                            setRespostaTexto({ ...respostaTexto, [d.id]: '' });
                          }}
                          className="btn-conex-neon text-xs px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Resposta</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 4: MATERIAIS DE APOIO */}
      {activeTab === 'materiais' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Materiais e Modelos de Apoio</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Planilhas, roteiros e guias disponibilizados aos participantes.
              </p>
            </div>
            <button
              onClick={() => setShowModalMaterial(true)}
              className="btn-conex-neon px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Adicionar Material</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materiais.map(mat => (
              <div key={mat.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-[#1E252E] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-[#A1D900] bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {mat.categoria}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{mat.criadoEm}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-2">{mat.titulo}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{mat.descricao}</p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Por: {mat.adicionadoPor}</span>
                  <a
                    href={mat.linkOuTexto}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#004B8D] dark:text-[#A1D900] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Acessar Link</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Adicionar Material */}
      {showModalMaterial && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#161B22] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Novo Material de Apoio</h3>
              <button 
                onClick={() => setShowModalMaterial(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSalvarMaterial} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Título do Conteúdo</label>
                <input
                  type="text"
                  placeholder="Ex: Planilha de Custos para Alimentos"
                  value={novoMatTitulo}
                  onChange={e => setNovoMatTitulo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Trilha / Categoria</label>
                <select
                  value={novoMatCat}
                  onChange={e => setNovoMatCat(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                >
                  <option value="Gestão Financeira">Gestão Financeira</option>
                  <option value="Vendas & Clientes">Vendas & Clientes</option>
                  <option value="Formalização MEI">Formalização MEI</option>
                  <option value="Controles Diários">Controles Diários</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Descrição Breve</label>
                <textarea
                  rows={2}
                  placeholder="Explique como esse material vai ajudar o empreendedor..."
                  value={novoMatDesc}
                  onChange={e => setNovoMatDesc(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Link do Arquivo ou Guia (Google Drive, Docs, etc.)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={novoMatLink}
                  onChange={e => setNovoMatLink(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModalMaterial(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-conex-primary px-5 py-2 rounded-full text-xs font-bold shadow-sm cursor-pointer"
                >
                  Publicar Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
