#!/usr/bin/env bash
set -euo pipefail

# Script de configuração local para Antigravity + Canva MCP + NotebookLM MCP
# Uso: bash scripts/setup-antigravity.sh

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GLOBAL_CONFIG_DIR="${HOME}/.gemini/config"
GLOBAL_MCP_CONFIG="${GLOBAL_CONFIG_DIR}/mcp_config.json"

echo "==> Configurando ambiente Antigravity para o projeto Co.Nexo..."

# 1. Garantir pasta global de config do Antigravity e instruir sobre Canva MCP
mkdir -p "${GLOBAL_CONFIG_DIR}"
if [ ! -f "${GLOBAL_MCP_CONFIG}" ]; then
  cp "${REPO_ROOT}/.agents/mcp_config.json" "${GLOBAL_MCP_CONFIG}"
  echo "[OK] Criado ${GLOBAL_MCP_CONFIG} com o servidor Canva MCP."
else
  echo "[INFO] ${GLOBAL_MCP_CONFIG} já existe. Verifique se contém o servidor 'canva' (https://mcp.canva.com/mcp)."
fi

# 2. Instalar notebooklm-mcp-cli (nlm + gemini-notebook-mcp) se uv estiver disponível
if command -v uv >/dev/null 2>&1; then
  echo "==> Instalando/atualizando notebooklm-mcp-cli via uv..."
  uv tool install --upgrade notebooklm-mcp-cli
elif command -v pipx >/dev/null 2>&1; then
  echo "==> Instalando/atualizando notebooklm-mcp-cli via pipx..."
  pipx install --force notebooklm-mcp-cli
else
  echo "[AVISO] 'uv' ou 'pipx' não encontrado."
  echo "        Instale uv (https://docs.astral.sh/uv/) e rode:"
  echo "          uv tool install notebooklm-mcp-cli"
fi

# 3. Registrar NotebookLM MCP e skill no Antigravity caso nlm esteja no PATH
if command -v nlm >/dev/null 2>&1; then
  echo "==> Registrando gemini-notebook-mcp no Antigravity..."
  nlm setup add antigravity || true
  nlm skill install antigravity || true
  echo ""
  echo "[PRÓXIMO PASSO] Execute 'nlm login' para autenticar sua conta Google no NotebookLM."
fi

# 4. Verificar Node.js / @canva/cli (opcional)
if command -v npm >/dev/null 2>&1; then
  echo "[INFO] Para usar também a CLI oficial do Canva (opcional):"
  echo "       npm install -g @canva/cli@latest && canva login"
fi

echo ""
echo "==> Concluído! Reinicie o Antigravity App/IDE e clique em 'Authenticate' no servidor 'canva' nas Customizations."
