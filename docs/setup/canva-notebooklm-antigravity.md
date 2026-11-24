# Ambiente Canva + NotebookLM + Antigravity

Este repositório já está pré-configurado para o **Google Antigravity** (App, IDE e CLI) com:

- Servidor MCP oficial do **Canva** configurado no workspace em [`.agents/mcp_config.json`](../../.agents/mcp_config.json).
- **12 skills** especializadas instaladas em [`.agents/skills/`](../../.agents/skills/).

---

## 1. Skills Instaladas

| Categoria | Skill | Origem | Uso principal |
| :--- | :--- | :--- | :--- |
| **Canva (Oficial)** | `canva-agent-guide` | `canva-sdks/canva-skills` | Guia mestre para descobrir ferramentas e fluxos do Canva MCP |
| **Canva (Oficial)** | `canva-edit-design` | `canva-sdks/canva-skills` | Edição segura em transação de designs existentes |
| **Canva (Oficial)** | `canva-branded-presentation` | `canva-sdks/canva-skills` | Criação de apresentações a partir de briefing ou Brand Kit |
| **Canva (Oficial)** | `canva-presentation-time-fitting` | `canva-sdks/canva-skills` | Ajuste das notas do apresentador ao tempo exato do pitch |
| **Canva (Oficial)** | `canva-design-feedback` | `canva-sdks/canva-skills` | Revisão de layout, hierarquia visual, legibilidade e copy |
| **Canva (Oficial)** | `canva-brand-check` | `canva-sdks/canva-skills` | Auditoria de cores, fontes e consistência visual com Brand Kit |
| **Canva (Oficial)** | `canva-autofill` | `canva-sdks/canva-skills` | Preenchimento de Brand Templates com dados estruturados |
| **Canva (Oficial)** | `canva-cli` | `canva-sdks/canva-skills` | Uso da CLI `@canva/cli` (`canva api`) via REST API |
| **Direção de Arte** | `canva-design-director` | `mavericraven/canva-design-director` | Regras de grid, tipografia e qualidade anti-"AI slop" |
| **PowerPoint (.pptx)** | `pptx` | `anthropics/skills` | Geração e validação de decks `.pptx` 100% editáveis para importar no Canva |
| **HTML Interativo** | `frontend-slides` | `zarazhangrui/frontend-slides` | Slides HTML 16:9 e folder digital interativo |
| **NotebookLM** | `nlm-skill` | `jacob-bd/gemini-notebook-mcp-cli` | Automação e consulta de notebooks via `nlm` CLI e `gemini-notebook-mcp` |

---

## 2. Conectar o Canva MCP no Antigravity (Sua Máquina)

O arquivo [`.agents/mcp_config.json`](../../.agents/mcp_config.json) já declara o servidor remoto oficial do Canva:

```json
{
  "mcpServers": {
    "canva": {
      "serverUrl": "https://mcp.canva.com/mcp"
    }
  }
}
```

> **Importante:** A autenticação do Canva MCP usa **OAuth 2.0 PKCE no seu navegador**. Por isso, ela precisa ser autorizada na sua máquina (Antigravity App, IDE ou CLI) — agentes remotos na nuvem sem o conector Canva habilitado não acessam sua conta privada automaticamente.

### Passos no Antigravity App / IDE

1. Clone ou atualize este repositório localmente e abra a pasta `CONEXO.hub` no Antigravity.
2. Em **Customizations → Installed → MCP Servers** (ou `… → MCP Servers → Manage MCP Servers` na IDE), verifique o servidor `canva`.
   - Caso prefira configurar globalmente, adicione a entrada acima em `~/.gemini/config/mcp_config.json`.
3. Clique em **Authenticate** (ou **Refresh**), conclua o login na sua conta do Canva no navegador e cole o código de autorização se solicitado.
4. Peça ao agente:
   > *"Resolva o link `https://canva.link/1p6b286umiw4mm9` com `canva-edit-design` / `canva-design-director` e analise os slides atuais."*

---

## 3. Conectar o NotebookLM (Gemini Notebook) no Antigravity

O Google **não** oferece uma API pública oficial nem conector nativo de NotebookLM para agentes remotos na nuvem. A integração mais confiável para uso local com Antigravity é o projeto open-source [`jacob-bd/gemini-notebook-mcp-cli`](https://github.com/jacob-bd/gemini-notebook-mcp-cli), que conecta o Antigravity ao seu NotebookLM usando sua sessão local do Chrome.

### Instalação Rápida (3 comandos ou via script)

Execute na sua máquina (ou rode `./scripts/setup-antigravity.sh`):

```bash
uv tool install notebooklm-mcp-cli
nlm login
nlm setup add antigravity
```

Depois de executar os 3 comandos:

1. Reinicie o Antigravity App / IDE / CLI.
2. Confira se o servidor `gemini-notebook-mcp` aparece ativo.
3. Peça ao agente: *"Liste meus notebooks do NotebookLM e extraia os dados do Regis sobre o Co.Nexo."*

> **Nota de segurança:** Nunca compartilhe cookies de sessão do Google (`Cookie` header) ou arquivos de autenticação em chats públicos ou repositórios Git.

---

## 4. Como usar o NotebookLM em Agentes na Nuvem (Sem MCP Local)

Se você estiver conversando com um agente remoto na nuvem (como o Antigravity na Web) onde não é possível abrir um navegador local para autenticar no Canva ou NotebookLM:

1. **No NotebookLM:** Peça no chat do seu notebook um resumo completo estruturado com todos os números, fontes do Regis e dados locais da cidade e clique em **Copiar** ou **Exportar para Documentos Google** (baixe como `.docx`/`.pdf`/`.md`).
2. **No Canva:** Clique em **Compartilhar → Baixar → Microsoft PowerPoint (`.pptx`)** (ou PDF).
3. Envie esses arquivos no chat ou suba para o repositório — o agente consegue ler tudo, montar o deck final em `.pptx` editável (importável de volta no Canva com 1 clique) e gerar o **folder digital interativo** em HTML.
