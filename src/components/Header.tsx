import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserCheck, Briefcase, GraduationCap, 
  BarChart3, LogOut 
} from 'lucide-react';
import { Role } from '../types';
import { CoNexoLogo } from './CoNexoLogo';

export const Header: React.FC = () => {
  const { role, setRole } = useApp();

  // Nomes estritamente alinhados: Recepção, Mentor(a), Aluno(a) e Gestão
  const personas: { id: Role; label: string; icon: React.ReactNode }[] = [
    {
      id: 'max',
      label: 'Recepção',
      icon: <UserCheck className="w-4 h-4" />
    },
    {
      id: 'aline',
      label: 'Mentor(a)',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: 'arthur',
      label: 'Aluno(a)',
      icon: <GraduationCap className="w-4 h-4" />
    },
    {
      id: 'regis',
      label: 'Gestão',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs font-['Inter']">
      {/* Top Banner Institucional - #004B8D */}
      <div className="bg-[#004B8D] text-white text-xs px-4 py-1.5 flex justify-between items-center border-b border-[#334195]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#A1D900] tracking-wide font-['Montserrat']">SENAC EMPREENDEDORISMO</span>
          <span className="text-blue-200">•</span>
          <span className="text-blue-100 hidden sm:inline">Programa Oficial Co.Nexo</span>
        </div>
      </div>

      {/* Main Header & Role Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand with official Logo */}
        <div className="flex items-center gap-3">
          <CoNexoLogo size="md" withTagline={false} />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <span className="hidden sm:inline bg-[#F9F9F9] text-[#004B8D] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#004B8D]/20 font-['Montserrat']">
            MVP
          </span>
        </div>

        {/* Persona Switcher Tabs & Botão Voltar para Tela de Login */}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 bg-[#F9F9F9] p-1 rounded-xl border border-slate-200">
            {personas.map(p => {
              const isActive = role === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setRole(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#004B8D] text-white shadow-xs font-bold font-["Montserrat"]' 
                      : 'text-[#1A1A1A] hover:bg-slate-200/70 font-medium'
                  }`}
                >
                  <span className={isActive ? 'text-[#A1D900]' : 'text-slate-500'}>
                    {p.icon}
                  </span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Botão Sair / Trocar Perfil */}
          <button
            onClick={() => setRole(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-[#004B8D] hover:bg-[#F9F9F9] border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            title="Voltar para a tela inicial de seleção de perfil"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Trocar Perfil</span>
          </button>
        </div>
      </div>
    </header>
  );
};
