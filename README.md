# 🚀 Co.Nexo — Plataforma Integrada de Mentoria e Gestão (MVP)

> **Projeto:** Co.Nexo / Conex.hub  
> **Instituição:** SENAC Empreendedorismo  
> **Objetivo:** Resolver o caos operacional de planilhas manuais, proteger o histórico do programa em nuvem e garantir que o empreendedor nunca caia no "limbo" entre encontros ou pós-conclusão.

---

## 🌐 Como Executar o MVP

O servidor de desenvolvimento já está pronto e em execução:

```bash
# Caso precise rodar novamente:
npm install
npm run dev
```

Abra no seu navegador: **[http://localhost:5173/](http://localhost:5173/)**

---

## 👥 As 4 Visões & Dores Resolvidas

No topo da aplicação, você encontra o **seletor de visões (Role Switcher)** com alternância instantânea:

### 1. 👔 Recepção & Operação — Max
* **Fim do Quebra-Cabeça da Grade:** O sistema calcula slots compatíveis com os turnos presenciais de 4 horas (13h às 17h para Aline e 08h às 12h para Regis).
* **Alerta de Horário Órfão (Anti-Buraco):** Avisa visualmente quando há um número ímpar de entrevistas de 1 hora, impedindo que a consultora fique 1 hora ociosa.
* **Automação de Lembretes 24h:** Lista quem tem atendimento amanhã e gera o link direto do WhatsApp com mensagem acolhedora pré-formatada com 1 clique (`wa.me`).
* **Regra Rígida de Assiduidade:**
  * Cancelamentos com menos de 24h contam automaticamente como falta.
  * O sistema trava agendamentos e notifica desligamento ao atingir **2 faltas ou 3 reagendamentos**.
* **Cadastro de Balcão:** Fim das fichas de papel ou cópia manual do RD Station.

### 2. 👩‍💼 Consultora & Mentora — Aline
* **Prontuário Digital Unificado ("Diário de Bordo"):** Substitui pastas no OneDrive ("A.S.") e folhas soltas. Linha do tempo com diagnósticos, tarefas passadas e evolução do MEI em menos de 15 segundos.
* **Registro Ágil de Sessão:** Formulário rápido que alimenta o portal do aluno sem burocracia.
* **Minha Grade Semanal:** Visualização dos horários do turno e confirmação prévia para não ficar esperando na sala vazia.
* **Caixa de Dúvidas dos Alunos:** Responda dúvidas que os alunos mandam entre os encontros, acabando com os 15 dias de silêncio.
* **Biblioteca de Materiais:** Compartilhamento de calculadoras e modelos com os mentorados.

### 3. 👨‍🍳 Mentorado (Empreendedor) — Arthur Santana
* **Acolhimento & Próximo Encontro:** Informações claras da próxima sessão com a Aline (data, horário, sala 204 SENAC) e botão para confirmar presença com 1 clique.
* **Extrato de Assiduidade Transparente:** Arthur visualiza seu saldo de faltas (0 de 2) e reagendamentos (0 de 3) com orientações claras para evitar o desligamento.
* **Caderno de Exercícios & Checklist:** Visualização das tarefas que a Aline passou no encontro (ex: separar comprovantes da feira num envelope, parar com o fiado em papelão).
* **Canal Direto com a Mentora:** Arthur pode mandar dúvidas quando travar nas contas, sem esperar 15 dias no silêncio.
* **Trilha do MEI:** Rota clara para deixar a informalidade e não ser abandonado no pós-ciclo.

### 4. 📊 Coordenação Geral — Regis
* **Os 4 Grandes Números da Diretoria em 1 Clique:**
  1. Total de MEIs formalizados (e em processo).
  2. Total de horas de mentoria presencial executadas vs. horas ociosas evitadas.
  3. Taxa de No-Show (%) e índice de assiduidade do programa.
  4. Funil de avanço dos alunos por etapa.
* **Prevenção do Trauma de Dados Perdidos:**
  * **Persistência Protegida:** Armazenamento referencial que nunca se perde com uma célula apagada.
  * **Backup Cloud em JSON:** Download completo da base com 1 clique.
  * **Restauração Rápida:** Carregamento de backups prévios a qualquer momento.
  * **Exportação CSV/Excel:** Relatório pronto para anexar na prestação de contas da diretoria do SENAC.
* **Fila "Anti-Limbo" (30 e 60 dias):** Acompanhamento proativo de quem terminou o 5º encontro para checar a sobrevivência do negócio e abertura do MEI.
* **Radar Preventivo:** Detecção precoce de alunos com 1 falta antes de serem desligados.

---

## 🛠️ Tecnologias Utilizadas
* **React 19 + TypeScript**
* **Vite** para build ultrarrápido
* **TailwindCSS v4** para design responsivo e acessível
* **Lucide React** para iconografia
* **Local Cloud Engine:** Camada de persistência reativa com simulação de nuvem e rotina de backup/restauração.
