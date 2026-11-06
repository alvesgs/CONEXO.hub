import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { LoginView } from './views/LoginView';
import { MaxView } from './views/MaxView';
import { AlineView } from './views/AlineView';
import { ArthurView } from './views/ArthurView';
import { RegisView } from './views/RegisView';
import { CloudCheck, DownloadCloud, RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  const { 
    role, 
    isSidebarCollapsed, 
    exportarBackupCloud, 
    resetarDadosDemo 
  } = useApp();

  // Primeira tela de acesso: Tela de Login e Escolha de Perfil
  if (!role) {
    return (
      <>
        <LoginView />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0D1117] text-[#1A1A1A] dark:text-slate-100 font-['Inter'] transition-colors duration-200">
      {/* Barra de Navegação Padrão: Lateral Retrátil à Esquerda */}
      <Sidebar />

      {/* Conteúdo Principal com espaço para a barra recolhida */}
      <div className="ml-20 flex flex-col min-h-screen">
        {/* Barra Superior Discreta de Status e Ações Globais */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#004B8D] dark:text-[#A1D900] tracking-wide font-['Montserrat']">
              SENAC EMPREENDEDORISMO
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
              Co.Nexo — Gestão Integrada de Mentorias
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-[#A1D900] font-semibold text-[11px]">
              <CloudCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sincronizado na Nuvem</span>
            </div>
            <button 
              onClick={exportarBackupCloud}
              className="text-slate-500 hover:text-[#004B8D] dark:hover:text-[#A1D900] flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
              title="Baixar cópia de segurança em JSON"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Backup</span>
            </button>
            <button 
              onClick={resetarDadosDemo}
              className="text-slate-500 hover:text-amber-500 flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
              title="Recarregar dados iniciais"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset Demo</span>
            </button>
          </div>
        </header>

        {/* Área de Visualização do Perfil Selecionado */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {role === 'max' && <MaxView />}
          {role === 'aline' && <AlineView />}
          {role === 'arthur' && <ArthurView />}
          {role === 'regis' && <RegisView />}
        </main>

        <Toast />

        {/* Rodapé Minimalista */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#004B8D] dark:text-white font-['Montserrat']">
                <span className="text-[#A1D900]">co.</span>nexo
              </span>
              <span>—</span>
              <span>SENAC São Paulo</span>
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              Ambiente com proteção ativa contra perda de dados
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
