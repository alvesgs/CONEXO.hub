import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { CoNexoLogo } from '../components/CoNexoLogo';
import { UserCheck, Briefcase, GraduationCap, BarChart3, ArrowRight, Sun, Moon } from 'lucide-react';

interface ProfileOption {
  id: Role;
  name: string;
  icon: React.ReactNode;
}

export const LoginView: React.FC = () => {
  const { setRole, theme, toggleTheme } = useApp();

  // Perfis estritamente nomeados conforme solicitado:
  // Recepção, Mentor(a), Aluno(a) e Gestão
  const profiles: ProfileOption[] = [
    {
      id: 'max',
      name: 'Recepção',
      icon: <UserCheck className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
    },
    {
      id: 'aline',
      name: 'Mentor(a)',
      icon: <Briefcase className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
    },
    {
      id: 'arthur',
      name: 'Aluno(a)',
      icon: <GraduationCap className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
    },
    {
      id: 'regis',
      name: 'Gestão',
      icon: <BarChart3 className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0D1117] flex flex-col justify-between items-center px-4 py-8 font-['Inter'] transition-colors duration-200">
      {/* Top subtle bar with theme toggle */}
      <div className="w-full max-w-md flex justify-between items-center">
        <span className="text-[11px] font-bold tracking-widest text-[#004B8D] dark:text-[#A1D900] uppercase font-['Montserrat']">
          SENAC EMPREENDEDORISMO
        </span>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#A1D900]" /> : <Moon className="w-4 h-4 text-[#004B8D]" />}
        </button>
      </div>

      {/* Main Minimalist Login Card */}
      <div className="w-full max-w-md my-auto">
        <div className="bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm text-center">
          {/* Logo Oficial Co.Nexo Senac */}
          <div className="flex justify-center mb-6">
            <CoNexoLogo size="lg" variant={theme === 'dark' ? 'dark' : 'light'} withTagline={false} />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-white font-['Montserrat']">
              Acesso ao Sistema
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-['Inter']">
              Selecione o seu perfil para entrar
            </p>
          </div>

          {/* Lista de Perfis Minimalista */}
          <div className="space-y-3">
            {profiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => setRole(profile.id)}
                className="w-full group flex items-center justify-between px-5 py-4 rounded-2xl bg-[#F9F9F9] dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 hover:border-[#004B8D] dark:hover:border-[#A1D900] hover:bg-white dark:hover:bg-[#1E252E] hover:shadow-md transition-all duration-200 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-[#004B8D]/30 group-hover:bg-[#004B8D]/5 dark:group-hover:bg-[#004B8D]/20 transition-colors">
                    {profile.icon}
                  </div>
                  <span className="text-sm font-bold text-[#1A1A1A] dark:text-slate-200 group-hover:text-[#004B8D] dark:group-hover:text-[#A1D900] transition-colors font-['Montserrat']">
                    {profile.name}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-[#004B8D] dark:group-hover:bg-[#A1D900] dark:group-hover:text-[#1A1A1A] transition-all duration-200">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>

          {/* Subtle security/status note */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#A1D900]"></span>
            <span>Ambiente de demonstração do MVP</span>
          </div>
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer className="text-center text-xs text-slate-400 dark:text-slate-500">
        <p>© 2026 Senac • Programa Co.Nexo</p>
      </footer>
    </div>
  );
};
