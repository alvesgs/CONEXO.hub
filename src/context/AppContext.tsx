import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Aluno, Consultor, Agendamento, EntradaDiarioDeBordo, 
  DuvidaMentorado, MaterialApoio, Role, StatusMEI, TipoSessao 
} from '../types';
import { 
  INITIAL_ALUNOS, INITIAL_CONSULTORES, INITIAL_AGENDAMENTOS, 
  INITIAL_DIARIOS, INITIAL_DUVIDAS, INITIAL_MATERIAIS 
} from '../data/initialData';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  alunos: Aluno[];
  consultores: Consultor[];
  agendamentos: Agendamento[];
  diarios: EntradaDiarioDeBordo[];
  duvidas: DuvidaMentorado[];
  materiais: MaterialApoio[];
  selectedAlunoId: string;
  setSelectedAlunoId: (id: string) => void;
  alertaGlobal: string | null;
  setAlertaGlobal: (msg: string | null) => void;
  
  // Interface e Temas
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Operações de Negócio
  cadastrarAluno: (novo: Omit<Aluno, 'id' | 'totalFaltas' | 'totalReagendamentos' | 'totalCancelamentos' | 'dataCadastro' | 'encontrosRealizados'>) => Aluno;
  agendarSessao: (dados: { alunoId: string; consultorId: string; tipo: TipoSessao; data: string; horarioInicio: string; horarioFim: string; sala: string; observacoes?: string }) => { success: boolean; message: string };
  marcarPresenca: (agendamentoId: string, acao: 'realizado' | 'falta_injustificada' | 'cancelado_menos_24h' | 'confirmado') => void;
  reagendarSessao: (agendamentoId: string, novaData: string, novoInicio: string, novoFim: string) => { success: boolean; message: string };
  cancelarSessao: (agendamentoId: string, motivo?: string, forcarMenos24h?: boolean) => { success: boolean; menos24h: boolean; desligado?: boolean; message: string };
  enviarLembreteWhatsApp: (agendamentoId: string) => { link: string; texto: string };
  salvarDiarioDeBordo: (entrada: Omit<EntradaDiarioDeBordo, 'id' | 'criadoEm'>) => void;
  enviarDuvida: (pergunta: string, alunoId: string, consultorId: string) => void;
  responderDuvida: (duvidaId: string, resposta: string) => void;
  adicionarMaterial: (material: Omit<MaterialApoio, 'id' | 'criadoEm'>) => void;
  atualizarStatusMei: (alunoId: string, statusMei: StatusMEI) => void;
  
  // Segurança de Dados & Backup
  exportarBackupCloud: () => void;
  restaurarBackupCloud: (jsonString: string) => boolean;
  resetarDadosDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'conex_hub_database_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [selectedAlunoId, setSelectedAlunoId] = useState<string>(''); // Vazio por padrão para exibir sob demanda
  const [alertaGlobal, setAlertaGlobal] = useState<string | null>(null);

  // Tema Claro / Escuro
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('conex_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('conex_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Barra lateral retrátil
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('conex_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('conex_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Aba ativa compartilhada
  const [activeTab, setActiveTab] = useState<string>('agenda');

  // Ajusta automaticamente a primeira aba de cada perfil ao trocar de perfil
  useEffect(() => {
    if (role === 'max') setActiveTab('agenda');
    else if (role === 'aline') setActiveTab('prontuario');
    else if (role === 'arthur') setActiveTab('proximo');
    else if (role === 'regis') setActiveTab('kpis');
  }, [role]);

  // Inicialização com persistência em localStorage para simular Cloud Database
  const [alunos, setAlunos] = useState<Aluno[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_alunos`);
    return saved ? JSON.parse(saved) : INITIAL_ALUNOS;
  });

  const [consultores] = useState<Consultor[]>(INITIAL_CONSULTORES);

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_agendamentos`);
    if (saved) {
      try {
        const parsed: Agendamento[] = JSON.parse(saved);
        // Sincroniza e migra quaisquer agendamentos antigos de 2026-10 para 2026-11 (mês atual)
        const migrados = parsed.map(ag => ({
          ...ag,
          data: ag.data.startsWith('2026-10') ? ag.data.replace('2026-10-', '2026-11-') : ag.data
        }));
        return migrados;
      } catch {
        return INITIAL_AGENDAMENTOS;
      }
    }
    return INITIAL_AGENDAMENTOS;
  });

  const [diarios, setDiarios] = useState<EntradaDiarioDeBordo[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_diarios`);
    if (saved) {
      try {
        const parsed: EntradaDiarioDeBordo[] = JSON.parse(saved);
        return parsed.map(d => ({
          ...d,
          data: d.data.startsWith('2026-10') ? d.data.replace('2026-10-', '2026-11-') : d.data
        }));
      } catch {
        return INITIAL_DIARIOS;
      }
    }
    return INITIAL_DIARIOS;
  });

  const [duvidas, setDuvidas] = useState<DuvidaMentorado[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_duvidas`);
    return saved ? JSON.parse(saved) : INITIAL_DUVIDAS;
  });

  const [materiais, setMateriais] = useState<MaterialApoio[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_materiais`);
    return saved ? JSON.parse(saved) : INITIAL_MATERIAIS;
  });

  // Efeitos para persistência contínua (Salvar na Nuvem Local / Autosalvamento)
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_alunos`, JSON.stringify(alunos));
  }, [alunos]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_agendamentos`, JSON.stringify(agendamentos));
  }, [agendamentos]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_diarios`, JSON.stringify(diarios));
  }, [diarios]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_duvidas`, JSON.stringify(duvidas));
  }, [duvidas]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_materiais`, JSON.stringify(materiais));
  }, [materiais]);

  // CADASTRO DE ALUNO
  const cadastrarAluno = (novo: Omit<Aluno, 'id' | 'totalFaltas' | 'totalReagendamentos' | 'totalCancelamentos' | 'dataCadastro' | 'encontrosRealizados'>): Aluno => {
    const id = `a_${Date.now()}`;
    const novoAluno: Aluno = {
      ...novo,
      id,
      totalFaltas: 0,
      totalReagendamentos: 0,
      totalCancelamentos: 0,
      encontrosRealizados: 0,
      dataCadastro: new Date().toISOString().split('T')[0]
    };
    setAlunos(prev => [novoAluno, ...prev]);
    setSelectedAlunoId(id);
    return novoAluno;
  };

  // AGENDAMENTO INTELIGENTE COM REGRAS DE NEGÓCIO
  const agendarSessao = (dados: {
    alunoId: string;
    consultorId: string;
    tipo: TipoSessao;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    sala: string;
    observacoes?: string;
  }) => {
    const aluno = alunos.find(a => a.id === dados.alunoId);
    if (!aluno) return { success: false, message: 'Empreendedor não encontrado.' };

    // REGRA 1: Bloqueio de Desligamento Automático (2 faltas ou 3 reagendamentos)
    if (aluno.totalFaltas >= 2 || aluno.totalReagendamentos >= 3 || aluno.statusPrograma === 'Desligado') {
      return { 
        success: false, 
        message: `🚫 BLOQUEIO DO SISTEMA: ${aluno.nome} está DESLIGADO(A) por ultrapassar o limite rígido do programa (${aluno.totalFaltas}/2 faltas, ${aluno.totalReagendamentos}/3 reagendamentos). Novo agendamento não permitido.` 
      };
    }

    // REGRA 2: Checagem de conflito direto de horário com a consultora
    const conflito = agendamentos.find(ag => 
      ag.consultorId === dados.consultorId &&
      ag.data === dados.data &&
      ag.status !== 'reagendado' &&
      ag.status !== 'cancelado_menos_24h' &&
      ((dados.horarioInicio >= ag.horarioInicio && dados.horarioInicio < ag.horarioFim) ||
       (dados.horarioFim > ag.horarioInicio && dados.horarioFim <= ag.horarioFim))
    );

    if (conflito) {
      return { 
        success: false, 
        message: `Conflito de agenda: A consultora já possui compromisso das ${conflito.horarioInicio} às ${conflito.horarioFim} nesta data.` 
      };
    }

    const novoAg: Agendamento = {
      id: `ag_${Date.now()}`,
      alunoId: dados.alunoId,
      consultorId: dados.consultorId,
      tipo: dados.tipo,
      data: dados.data,
      horarioInicio: dados.horarioInicio,
      horarioFim: dados.horarioFim,
      sala: dados.sala,
      status: 'agendado',
      lembreteEnviado24h: false,
      observacoes: dados.observacoes
    };

    setAgendamentos(prev => [...prev, novoAg]);

    // Atualiza status do aluno se estiver no início
    setAlunos(prev => prev.map(a => {
      if (a.id === dados.alunoId && a.statusPrograma === 'Inscrito') {
        return { ...a, statusPrograma: 'Diagnóstico Agendado' };
      }
      return a;
    }));

    return { 
      success: true, 
      message: `Agendamento criado com sucesso para ${aluno.nome}!` 
    };
  };

  // MARCAR PRESENÇA & REGRA DE ASSIDUIDADE RÍGIDA
  const marcarPresenca = (agendamentoId: string, acao: 'realizado' | 'falta_injustificada' | 'cancelado_menos_24h' | 'confirmado') => {
    const ag = agendamentos.find(a => a.id === agendamentoId);
    if (!ag) return;

    setAgendamentos(prev => prev.map(item => {
      if (item.id === agendamentoId) {
        return { ...item, status: acao };
      }
      return item;
    }));

    // Se for confirmação prévia
    if (acao === 'confirmado') {
      setAlertaGlobal(`✅ Presença confirmada para o agendamento de ${ag.data} às ${ag.horarioInicio}!`);
      return;
    }

    // Se for falta ou cancelado com menos de 24 horas
    if (acao === 'falta_injustificada' || acao === 'cancelado_menos_24h') {
      setAlunos(prev => prev.map(aluno => {
        if (aluno.id === ag.alunoId) {
          const novasFaltas = aluno.totalFaltas + 1;
          const desligar = novasFaltas >= 2;
          
          if (desligar) {
            setAlertaGlobal(`🚨 ATENÇÃO MAX E REGIS: O aluno ${aluno.nome} atingiu 2 faltas e foi DESLIGADO AUTOMATICAMENTE do programa.`);
          } else {
            setAlertaGlobal(`⚠️ Falta registrada para ${aluno.nome}. Alerta: 1 de 2 faltas atingidas.`);
          }

          return {
            ...aluno,
            totalFaltas: novasFaltas,
            statusPrograma: desligar ? 'Desligado' : aluno.statusPrograma
          };
        }
        return aluno;
      }));
    }

    // Se for realizado
    if (acao === 'realizado') {
      setAlunos(prev => prev.map(aluno => {
        if (aluno.id === ag.alunoId) {
          const novosEncontros = aluno.encontrosRealizados + 1;
          let novoStatus = aluno.statusPrograma;
          
          if (ag.tipo === 'diagnostico_1h') {
            novoStatus = 'Em Trilha (Encontro 1)';
          } else {
            if (novosEncontros >= 5) {
              novoStatus = 'Concluído';
            } else {
              novoStatus = `Em Trilha (Encontro ${Math.min(novosEncontros, 5)})` as any;
            }
          }

          const hoje = new Date();
          const d30 = new Date(hoje);
          d30.setDate(d30.getDate() + 30);
          const d60 = new Date(hoje);
          d60.setDate(d60.getDate() + 60);

          return {
            ...aluno,
            encontrosRealizados: novosEncontros,
            statusPrograma: novoStatus,
            dataConclusao: novosEncontros >= 5 ? hoje.toISOString().split('T')[0] : aluno.dataConclusao,
            dataFollowUp30d: novosEncontros >= 5 ? d30.toISOString().split('T')[0] : aluno.dataFollowUp30d,
            dataFollowUp60d: novosEncontros >= 5 ? d60.toISOString().split('T')[0] : aluno.dataFollowUp60d
          };
        }
        return aluno;
      }));
    }
  };

  // REAGENDAMENTO COM CONTROLE DE LIMITE
  const reagendarSessao = (agendamentoId: string, novaData: string, novoInicio: string, novoFim: string) => {
    const ag = agendamentos.find(a => a.id === agendamentoId);
    if (!ag) return { success: false, message: 'Agendamento não encontrado.' };

    const aluno = alunos.find(a => a.id === ag.alunoId);
    if (!aluno) return { success: false, message: 'Aluno não encontrado.' };

    const novosReagendamentos = aluno.totalReagendamentos + 1;
    const atingiuLimite = novosReagendamentos >= 3;

    // Atualiza agendamento antigo como reagendado
    setAgendamentos(prev => prev.map(item => {
      if (item.id === agendamentoId) {
        return { ...item, status: 'reagendado' };
      }
      return item;
    }));

    if (atingiuLimite) {
      setAlunos(prev => prev.map(a => a.id === aluno.id ? { 
        ...a, 
        totalReagendamentos: novosReagendamentos, 
        statusPrograma: 'Desligado' 
      } : a));
      
      return {
        success: false,
        message: `🚫 LIMITE EXCEDIDO: ${aluno.nome} atingiu o limite rígido de 3 reagendamentos e foi DESLIGADO do programa.`
      };
    }

    // Cria o novo agendamento
    const novoAg: Agendamento = {
      id: `ag_${Date.now()}`,
      alunoId: ag.alunoId,
      consultorId: ag.consultorId,
      tipo: ag.tipo,
      data: novaData,
      horarioInicio: novoInicio,
      horarioFim: novoFim,
      sala: ag.sala,
      status: 'agendado',
      lembreteEnviado24h: false,
      observacoes: `Reagendado do dia ${ag.data} às ${ag.horarioInicio}.`
    };

    setAgendamentos(prev => [...prev, novoAg]);
    setAlunos(prev => prev.map(a => a.id === aluno.id ? { ...a, totalReagendamentos: novosReagendamentos } : a));

    return {
      success: true,
      message: `Reagendado com sucesso para ${novaData} às ${novoInicio}. Aluno acumula ${novosReagendamentos}/3 reagendamentos permitidos.`
    };
  };

  // CANCELAMENTO DE SESSÃO COM REGRA DAS 24 HORAS & LIMITE DE CANCELAMENTOS
  const cancelarSessao = (agendamentoId: string, motivo?: string, forcarMenos24h?: boolean) => {
    const ag = agendamentos.find(a => a.id === agendamentoId);
    if (!ag) return { success: false, menos24h: false, message: 'Agendamento não encontrado.' };

    const aluno = alunos.find(a => a.id === ag.alunoId);
    if (!aluno) return { success: false, menos24h: false, message: 'Aluno não encontrado.' };

    // Limite de cancelamentos permitidos no programa (Máximo 2 cancelamentos)
    const cancelamentosAtuais = aluno.totalCancelamentos || 0;
    if (cancelamentosAtuais >= 2) {
      return { 
        success: false, 
        menos24h: false, 
        message: `🚫 LIMITE EXCEDIDO: ${aluno.nome} já atingiu o limite de 2 cancelamentos permitidos no programa.` 
      };
    }

    const novosCancelamentos = cancelamentosAtuais + 1;

    // Regra das 24 horas: se forcarMenos24h for booleano, usa ele; senão calcula pela data/hora
    let isMenos24h = forcarMenos24h;
    if (isMenos24h === undefined) {
      const dataAg = new Date(`${ag.data}T${ag.horarioInicio}:00`);
      const agora = new Date();
      const diffMs = dataAg.getTime() - agora.getTime();
      const diffHoras = diffMs / (1000 * 60 * 60);
      isMenos24h = diffHoras < 24 && diffHoras > -24;
    }

    if (isMenos24h) {
      const novasFaltas = aluno.totalFaltas + 1;
      const desligar = novasFaltas >= 2;

      setAgendamentos(prev => prev.map(item => {
        if (item.id === agendamentoId) {
          return {
            ...item,
            status: 'cancelado_menos_24h' as const,
            observacoes: motivo 
              ? `${item.observacoes ? item.observacoes + ' | ' : ''}Cancelado pelo aluno (<24h): ${motivo}` 
              : `${item.observacoes ? item.observacoes + ' | ' : ''}Cancelado pelo aluno com menos de 24h.`
          };
        }
        return item;
      }));

      setAlunos(prev => prev.map(a => {
        if (a.id === aluno.id) {
          return {
            ...a,
            totalCancelamentos: novosCancelamentos,
            totalFaltas: novasFaltas,
            statusPrograma: desligar ? 'Desligado' : a.statusPrograma
          };
        }
        return a;
      }));

      if (desligar) {
        setAlertaGlobal(`🚨 ATENÇÃO: ${aluno.nome} cancelou com menos de 24h, acumulou 2 faltas e foi DESLIGADO do programa.`);
      } else {
        setAlertaGlobal(`⚠️ Encontro cancelado com menos de 24h. 1 falta contabilizada (${novasFaltas}/2). Cancelamentos utilizados: ${novosCancelamentos}/2.`);
      }

      return {
        success: true,
        menos24h: true,
        desligado: desligar,
        message: desligar 
          ? 'Encontro cancelado com menos de 24h. Limite de 2 faltas atingido (aluno desligado do programa).' 
          : `Encontro cancelado com menos de 24h. Foi registrada 1 falta no seu histórico (${novasFaltas}/2). Cancelamento ${novosCancelamentos} de 2 realizado.`
      };
    } else {
      // Cancelado com antecedência (>24h): Horário liberado sem falta no histórico
      setAgendamentos(prev => prev.map(item => {
        if (item.id === agendamentoId) {
          return {
            ...item,
            status: 'cancelado' as const,
            observacoes: motivo 
              ? `${item.observacoes ? item.observacoes + ' | ' : ''}Cancelado pelo aluno (>24h): ${motivo}` 
              : `${item.observacoes ? item.observacoes + ' | ' : ''}Cancelado pelo aluno com antecedência (>24h).`
          };
        }
        return item;
      }));

      setAlunos(prev => prev.map(a => {
        if (a.id === aluno.id) {
          return {
            ...a,
            totalCancelamentos: novosCancelamentos
          };
        }
        return a;
      }));

      setAlertaGlobal(`✅ Encontro cancelado com sucesso. Horário liberado sem penalidade de falta. Cancelamentos: ${novosCancelamentos}/2.`);
      return {
        success: true,
        menos24h: false,
        desligado: false,
        message: `Encontro cancelado com antecedência de mais de 24h. Nenhuma falta foi registrada. Cancelamento ${novosCancelamentos} de 2 realizado.`
      };
    }
  };

  // ENVIO DE LEMBRETE WHATSAPP E GERAÇÃO DE MENSAGEM PADRONIZADA
  const enviarLembreteWhatsApp = (agendamentoId: string) => {
    const ag = agendamentos.find(a => a.id === agendamentoId);
    const aluno = alunos.find(a => a.id === ag?.alunoId);
    const consultor = consultores.find(c => c.id === ag?.consultorId);

    const dataFormatada = ag?.data ? new Date(ag.data + 'T12:00:00').toLocaleDateString('pt-BR') : '';
    const texto = `Olá, ${aluno?.nome || 'Empreendedor'}! Aqui é do Co.Nexo SENAC. Lembramos que seu encontro de ${ag?.tipo === 'diagnostico_1h' ? 'Diagnóstico Inicial (1h)' : 'Mentoria de Negócios (2h)'} com a consultora ${consultor?.nome} está confirmado para amanhã, dia ${dataFormatada}, às ${ag?.horarioInicio} na ${ag?.sala}. Por favor, responda com 1 para confirmar ou 2 se precisar de apoio. Esperamos por você!`;

    const encoded = encodeURIComponent(texto);
    const link = `https://wa.me/55${aluno?.whatsapp}?text=${encoded}`;

    // Marca como enviado no banco
    setAgendamentos(prev => prev.map(item => {
      if (item.id === agendamentoId) {
        return { 
          ...item, 
          lembreteEnviado24h: true, 
          dataEnvioLembrete: new Date().toLocaleString('pt-BR') 
        };
      }
      return item;
    }));

    return { link, texto };
  };

  // DIÁRIO DE BORDO / PRONTUÁRIO DIGITAL
  const salvarDiarioDeBordo = (entrada: Omit<EntradaDiarioDeBordo, 'id' | 'criadoEm'>) => {
    const novoDiario: EntradaDiarioDeBordo = {
      ...entrada,
      id: `d_${Date.now()}`,
      criadoEm: new Date().toLocaleString('pt-BR')
    };

    setDiarios(prev => [novoDiario, ...prev]);

    // Atualiza status MEI do aluno se tiver mudado no prontuário
    setAlunos(prev => prev.map(a => {
      if (a.id === entrada.alunoId) {
        return {
          ...a,
          statusMei: entrada.statusFormalizacaoMei,
          historicoNotas: entrada.diagnosticoResumo
        };
      }
      return a;
    }));

    setAlertaGlobal('📘 Prontuário atualizado com sucesso no Diário de Bordo!');
  };

  // DÚVIDAS INTERMEDIÁRIAS (ACABA COM O SILÊNCIO DE 15 DIAS)
  const enviarDuvida = (pergunta: string, alunoId: string, consultorId: string) => {
    const novaDuvida: DuvidaMentorado = {
      id: `duv_${Date.now()}`,
      alunoId,
      consultorId,
      pergunta,
      status: 'aberta',
      criadaEm: new Date().toLocaleString('pt-BR')
    };
    setDuvidas(prev => [novaDuvida, ...prev]);
    setAlertaGlobal('💬 Dúvida enviada para a mentora Aline! Você receberá a orientação por aqui.');
  };

  const responderDuvida = (duvidaId: string, resposta: string) => {
    setDuvidas(prev => prev.map(d => {
      if (d.id === duvidaId) {
        return {
          ...d,
          resposta,
          status: 'respondida',
          respondidaEm: new Date().toLocaleString('pt-BR')
        };
      }
      return d;
    }));
    setAlertaGlobal('✅ Resposta enviada ao mentorado!');
  };

  const adicionarMaterial = (material: Omit<MaterialApoio, 'id' | 'criadoEm'>) => {
    const novo: MaterialApoio = {
      ...material,
      id: `m_${Date.now()}`,
      criadoEm: new Date().toISOString().split('T')[0]
    };
    setMateriais(prev => [novo, ...prev]);
  };

  const atualizarStatusMei = (alunoId: string, statusMei: StatusMEI) => {
    setAlunos(prev => prev.map(a => {
      if (a.id === alunoId) {
        return {
          ...a,
          statusMei,
          statusPrograma: statusMei === 'MEI Aberto e Ativo' ? 'MEI Formalizado' : a.statusPrograma
        };
      }
      return a;
    }));
  };

  // BACKUP E RESTAURAÇÃO PARA REGIS (PREVENÇÃO DE DADOS PERDIDOS)
  const exportarBackupCloud = () => {
    const dump = {
      versao: '1.0',
      dataExportacao: new Date().toISOString(),
      alunos,
      consultores,
      agendamentos,
      diarios,
      duvidas,
      materiais
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_cloud_conex_hub_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setAlertaGlobal('💾 Backup em Nuvem exportado com sucesso! Seus dados estão seguros.');
  };

  const restaurarBackupCloud = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.alunos && data.agendamentos) {
        setAlunos(data.alunos);
        setAgendamentos(data.agendamentos);
        if (data.diarios) setDiarios(data.diarios);
        if (data.duvidas) setDuvidas(data.duvidas);
        if (data.materiais) setMateriais(data.materiais);
        setAlertaGlobal('♻️ Backup restaurado com sucesso! Todos os registros foram restabelecidos.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const resetarDadosDemo = () => {
    setAlunos(INITIAL_ALUNOS);
    setAgendamentos(INITIAL_AGENDAMENTOS);
    setDiarios(INITIAL_DIARIOS);
    setDuvidas(INITIAL_DUVIDAS);
    setMateriais(INITIAL_MATERIAIS);
    localStorage.clear();
    setAlertaGlobal('🔄 Dados de demonstração recarregados com Arthur, Max, Aline e Regis!');
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      theme, toggleTheme,
      isSidebarCollapsed, toggleSidebar,
      activeTab, setActiveTab,
      alunos, consultores, agendamentos, diarios, duvidas, materiais,
      selectedAlunoId, setSelectedAlunoId,
      alertaGlobal, setAlertaGlobal,
      cadastrarAluno, agendarSessao, marcarPresenca, reagendarSessao, cancelarSessao,
      enviarLembreteWhatsApp, salvarDiarioDeBordo, enviarDuvida, responderDuvida,
      adicionarMaterial, atualizarStatusMei,
      exportarBackupCloud, restaurarBackupCloud, resetarDadosDemo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
