import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Plus, X } from 'lucide-react';

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  allowCustom?: boolean;
  align?: 'left' | 'right';
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Selecione uma categoria...',
  className = '',
  allowCustom = true,
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalização para busca sem acentos e case-insensitive
  const normalize = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredOptions = options.filter(opt =>
    normalize(opt).includes(normalize(searchTerm))
  );

  const exactMatch = options.some(opt => normalize(opt) === normalize(searchTerm.trim()));

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Foco no input de busca ao abrir
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Botão de disparo / visualização do valor selecionado */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-left flex items-center justify-between text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-[#004B8D] dark:focus:ring-[#A1D900] transition-colors cursor-pointer"
      >
        <span className={`truncate ${!value ? 'text-slate-400 dark:text-slate-500' : 'font-medium'}`}>
          {value || placeholder}
        </span>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {value && (
            <span
              onClick={handleClear}
              className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Limpar seleção"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown com Campo de Busca e Opções */}
      {isOpen && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1 z-50 min-w-full sm:min-w-[280px] bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150`}>
          {/* Campo de Busca interno */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0D1117]/50 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar categoria..."
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 focus:outline-none placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          {/* Lista de Opções */}
          <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-100/50 dark:divide-slate-800/50">
            {/* Opção de adicionar categoria personalizada se o termo não coincidir exatamente */}
            {allowCustom && searchTerm.trim() && !exactMatch && (
              <button
                type="button"
                onClick={() => handleSelect(searchTerm.trim())}
                className="w-full px-2.5 py-2 text-xs text-left rounded-lg text-[#004B8D] dark:text-[#A1D900] bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold flex items-center gap-1.5 cursor-pointer mb-1"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Usar: "{searchTerm.trim()}"</span>
              </button>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => {
                const isSelected = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full px-2.5 py-1.5 text-xs text-left rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#004B8D] text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E252E]'
                    }`}
                  >
                    <span className="truncate">{opt}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#A1D900] shrink-0 ml-1" />}
                  </button>
                );
              })
            ) : !allowCustom || !searchTerm.trim() ? (
              <div className="p-3 text-center text-xs text-slate-400">
                Nenhuma categoria encontrada
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
