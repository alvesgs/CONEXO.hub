# CONEXO.hub — Co.Nexo (SENAC Empreendedorismo)

> **Da Informalidade ao CNPJ Sustentável com Eficiência Operacional Máxima**
> Plataforma unificada de gestão de mentorias, eliminação de no-show, proteção de histórico pedagógico e aceleração contínua de microempreendedores.

---

## Estrutura do Repositório

```text
CONEXO.hub/
├── .agents/
│   ├── mcp_config.json                        # Configuração do Canva MCP oficial para Antigravity
│   └── skills/                                # 12 skills (Canva, Design Director, PPTX, Frontend Slides, NotebookLM)
├── docs/
│   ├── comercial/
│   │   └── Co.Nexo_Apresentacao_Negocios_Vendas.pdf
│   ├── pitch/
│   │   ├── roteiro-ideias-shark-tank.pdf      # Notas originais das dinâmicas e roteiro do pitch
│   │   └── roteiro-ideias-shark-tank.md       # Transcrição estruturada em Markdown
│   └── setup/
│       └── canva-notebooklm-antigravity.md    # Guia completo de configuração Canva + NotebookLM + Antigravity
├── scripts/
│   └── setup-antigravity.sh                   # Script de configuração automática do ambiente local
└── README.md
```

---

## Documentos do Projeto

| Arquivo | Descrição |
| :--- | :--- |
| [Apresentação Executiva & Proposta Comercial](./docs/comercial/Co.Nexo_Apresentacao_Negocios_Vendas.pdf) | Visão completa do produto, dor do mercado, matriz de ROI, 4 personas (Max, Aline, Arthur Santana e Regis), roteiro de demonstração e especificações técnicas. |
| [Ideias de Pitch — Modelo Shark Tank (PDF)](./docs/pitch/roteiro-ideias-shark-tank.pdf) | Documento original com dinâmicas de abertura e engajamento. |
| [Ideias de Pitch — Modelo Shark Tank (Markdown)](./docs/pitch/roteiro-ideias-shark-tank.md) | Versão estruturada em texto para leitura rápida e uso por agentes de IA. |
| [Guia Canva + NotebookLM + Antigravity](./docs/setup/canva-notebooklm-antigravity.md) | Passo a passo para autenticar Canva MCP e NotebookLM (`nlm`) no Antigravity. |

---

## Setup Rápido do Ambiente (Antigravity + Canva + NotebookLM)

1. **Abra este repositório no Antigravity** (App, IDE ou CLI) — as skills em [`.agents/skills/`](./.agents/skills/) e o servidor Canva MCP em [`.agents/mcp_config.json`](./.agents/mcp_config.json) são carregados automaticamente.
2. **Autentique o Canva MCP:** em *Customizations → Installed → MCP Servers*, clique em **Authenticate** no servidor `canva` e conclua o login OAuth no navegador.
3. **Conecte o NotebookLM (opcional, na sua máquina):**
   ```bash
   bash scripts/setup-antigravity.sh
   nlm login
   ```
   Consulte o guia completo em [docs/setup/canva-notebooklm-antigravity.md](./docs/setup/canva-notebooklm-antigravity.md).
