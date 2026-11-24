# CONEXO.hub — Co.Nexo (SENAC Bahia • Santo Antônio de Jesus & Vitória da Conquista)

> **Da Informalidade ao CNPJ Sustentável com Eficiência Operacional Máxima**
> Plataforma unificada de gestão de mentorias, eliminação de no-show, proteção de histórico pedagógico e aceleração contínua de microempreendedores — integrada à metodologia do **Programa CO.NEXO (SENAC Bahia)**.

---

## Estrutura Organizada do Repositório

```text
CONEXO.hub/
├── .agents/
│   ├── mcp_config.json                                 # Configuração do Canva MCP oficial para Antigravity
│   └── skills/                                         # 12 skills (Canva, Design Director, PPTX, Frontend Slides, NotebookLM)
├── assets/
│   ├── branding/                                       # Logos oficiais transparentes (Co.Nexo SENAC, SENAC 80 anos)
│   ├── dashboards-1sem-2026/                           # 9 painéis de desempenho do 1º Semestre/2026 (Jan–Jun)
│   │   ├── 00-painel-geral-desempenho-1sem-2026.png
│   │   ├── 01-horas-totais-1245h.png
│   │   ├── 02-evolucao-horas-totais-detalhada.png
│   │   ├── 03-participantes-103.png
│   │   ├── 04-atendimentos-mentorias-314.png
│   │   ├── 05-concluintes-74.png
│   │   ├── 06-novas-turmas-27.png
│   │   ├── 07-taxa-conclusao-72pct-permanencia.png
│   │   └── 08-grade-completa-12-paineis-rascunho.png
│   └── espacos/                                        # Fotos reais dos espaços físicos (SAJ e VCA)
├── docs/
│   ├── comercial/
│   │   └── Co.Nexo_Apresentacao_Negocios_Vendas.pdf    # Proposta comercial do software CONEXO.hub
│   ├── institucional/
│   │   ├── manual-programa-conexo-2026.pdf             # Manual do Programa CO.NEXO (Abril/2026)
│   │   └── relatorio-resultados-conexo-saj-2023-2026.pdf # Relatório Gerencial SAJ V4 (Out/2023–Jul/2026)
│   ├── pitch/
│   │   ├── roteiro-ideias-shark-tank.pdf               # Notas originais das dinâmicas Shark Tank
│   │   ├── roteiro-ideias-shark-tank.md                # Transcrição estruturada das dinâmicas
│   │   └── sintese-dados-saj-para-pitch.md             # Consolidação de dados (SAJ + SEBRAE + 1º Sem/2026)
│   └── setup/
│       └── canva-notebooklm-antigravity.md             # Guia Canva MCP + NotebookLM MCP + Antigravity
├── presentations/
│   ├── folder-digital/
│   │   └── folder-digital-conexo.html                  # Folder Digital Interativo (mobile-first para a plateia)
│   ├── pitch-shark-tank/
│   │   ├── pitch-conexo-shark-tank.pptx                # Deck 100% editável (10 slides + notas) para importar no Canva
│   │   ├── pitch-conexo-shark-tank.html                # Apresentação HTML 16:9 interativa com cronômetro e notas (tecla N)
│   │   └── roteiro-apresentador-shark-tank.md          # Script minuto a minuto + dinâmica do barbante + 5 perguntas do Quiz
│   └── referencia/
│       └── Apresentacao_DN_CONEXO_2026.pptx            # Apresentação institucional de referência (DN 2026)
├── scripts/
│   └── setup-antigravity.sh                            # Script de configuração automática do ambiente local
└── README.md
```

---

## Principais Entregáveis do Pitch (Prontos para Uso e Edição no Canva)

| Entregável | Para que serve | Caminho |
| :--- | :--- | :--- |
| **Pitch Deck Editável (`.pptx`)** | Importar diretamente no **Canva** (textos, cards, tabelas, imagens e notas do apresentador 100% editáveis). | [`presentations/pitch-shark-tank/pitch-conexo-shark-tank.pptx`](./presentations/pitch-shark-tank/pitch-conexo-shark-tank.pptx) |
| **Apresentação Web 16:9 (`.html`)** | Apresentar direto no navegador com cronômetro (`T`) e notas Shark Tank (`N`). | [`presentations/pitch-shark-tank/pitch-conexo-shark-tank.html`](./presentations/pitch-shark-tank/pitch-conexo-shark-tank.html) |
| **Folder Digital Interativo (`.html`)** | Disponibilizar para a plateia abrir no celular durante o pitch (inclui seletor de trilhas e cases de SAJ). | [`presentations/folder-digital/folder-digital-conexo.html`](./presentations/folder-digital/folder-digital-conexo.html) |
| **Roteiro do Apresentador + Quiz** | Script cronometrado (8–9 min), dinâmica do barbante e 5 perguntas prontas para o Quiz ao vivo. | [`presentations/pitch-shark-tank/roteiro-apresentador-shark-tank.md`](./presentations/pitch-shark-tank/roteiro-apresentador-shark-tank.md) |
| **Síntese de Dados SAJ + SEBRAE** | Todos os números cruzados (SAJ 2023–2026, 1º Sem/2026 e Observatório SEBRAE SAJ). | [`docs/pitch/sintese-dados-saj-para-pitch.md`](./docs/pitch/sintese-dados-saj-para-pitch.md) |

---

## Setup do Ambiente (Antigravity + Canva + NotebookLM)

1. Abra este repositório no **Antigravity** (App, IDE ou CLI) — as 12 skills em [`.agents/skills/`](./.agents/skills/) e o servidor Canva MCP em [`.agents/mcp_config.json`](./.agents/mcp_config.json) são carregados automaticamente.
2. Em **Customizations → Installed → MCP Servers**, autentique o servidor **`canva`** via OAuth no navegador.
3. Para conectar também o seu **NotebookLM** localmente:
   ```bash
   bash scripts/setup-antigravity.sh
   nlm login
   ```
   Consulte o guia completo em [`docs/setup/canva-notebooklm-antigravity.md`](./docs/setup/canva-notebooklm-antigravity.md).
