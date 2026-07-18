// Seed inspirado nos conceitos da Norm.ai: agentes autônomos, supervisão IA, knowledge base, compliance
import { db } from '../src/lib/db'

async function main() {
  console.log('🧹 Limpando dados Norm.ai...')
  await db.outcomePricing.deleteMany()
  await db.firmStandard.deleteMany()
  await db.complianceCheck.deleteMany()
  await db.complianceRule.deleteMany()
  await db.knowledgeArticle.deleteMany()
  await db.agentRun.deleteMany()
  await db.agent.deleteMany()

  // ============ AGENTES JURÍDICOS AUTÔNOMOS ============
  console.log('🤖 Criando agentes jurídicos autônomos...')
  const agentes = await Promise.all([
    db.agent.create({
      data: {
        name: 'Analisador de Contratos',
        description: 'Analisa contratos automaticamente: identifica cláusulas abusivas, riscos, obrigações e sugere melhorias.',
        category: 'Contratos',
        capabilities: JSON.stringify(['identificar_clausulas', 'detectar_riscos', 'sugerir_melhorias', 'comparar_modelos', 'extrair_obrigacoes']),
        systemPrompt: `Você é um advogado especialista em análise de contratos. Para cada contrato fornecido:
1. Liste TODAS as cláusulas identificadas com numeração
2. Marque cláusulas potencialmente ABUSIVAS (CDC art. 51) ou NULAS
3. Identifique OBRIGAÇÕES de cada parte
4. Sinalize RISCOS (multas excessivas, renúncias, etc)
5. Sugira MELHORIAS com redação alternativa
6. Verifique cláusulas de FORO, LEI APLICÁVEL e RESCISÃO
7. Dê um SCORE de risco (0-100)
Use linguagem jurídica técnica. Cite artigos quando aplicável.`,
        tools: JSON.stringify(['search_knowledge', 'generate_report', 'verify_compliance']),
        supervisionEnabled: true,
        status: 'Ativo',
        icon: 'FileSearch',
        color: 'blue',
      },
    }),
    db.agent.create({
      data: {
        name: 'Verificador LGPD',
        description: 'Verifica conformidade com a LGPD em processos, contratos e documentos. Identifica vazamentos e dados sensíveis.',
        category: 'Conformidade',
        capabilities: JSON.stringify(['detectar_dados_sensiveis', 'verificar_base_legal', 'verificar_dpo', 'verificar_finalidade', 'gerar_relatorio_lgpd']),
        systemPrompt: `Você é um especialista em LGPD (Lei 13.709/2018). Verifique:
1. BASE LEGAL para tratamento de dados (art. 7º e 11)
2. DADOS SENSÍVEIS (art. 5º II) - identifique e marque
3. DIREITOS DO TITULAR (art. 18) - estão garantidos?
4. FINALIDADE (art. 6º I) - é compatível?
5. ENCARREGADO/DPO (art. 41) - está nomeado?
6. MEDIDAS DE SEGURANÇA (art. 46)
7. TRANSFERÊNCIA INTERNACIONAL (arts. 33-36)
Classifique risco: BAIXO/MÉDIO/ALTO. Cite artigos da LGPD.`,
        tools: JSON.stringify(['search_knowledge', 'generate_report']),
        supervisionEnabled: true,
        status: 'Ativo',
        icon: 'ShieldCheck',
        color: 'green',
      },
    }),
    db.agent.create({
      data: {
        name: 'Due Diligence Automático',
        description: 'Realiza due diligence completo: busca processos, dívidas, restrições e gera relatório de riscos.',
        category: 'Due Diligence',
        capabilities: JSON.stringify(['buscar_processos', 'verificar_dividas', 'verificar_restricoes', 'analisar_risco', 'gerar_relatorio_dd']),
        systemPrompt: `Você é um advogado especialista em due diligence. Para cada alvo:
1. Identifique todos os processos judiciais (use dados do DataJud)
2. Verifique dívidas tributárias e trabalhistas
3. Liste restrições (CNDT, CND, FGTS)
4. Analise contrato social (sócios, capital)
5. Verifique reputação (reclamações, processos)
6. Calcule SCORE de risco (0-100)
7. Recomende MEDIDAS DE MITIGAÇÃO
Estruture em relatório executivo com resumo, detalhes e recomendações.`,
        tools: JSON.stringify(['search_datajud', 'search_knowledge', 'generate_report']),
        supervisionEnabled: true,
        status: 'Ativo',
        icon: 'Search',
        color: 'purple',
      },
    }),
    db.agent.create({
      data: {
        name: 'Redator de Petições',
        description: 'Gera petições completas com base em dados do processo, fatos e pedidos. Inclui fundamentação legal.',
        category: 'Redação',
        capabilities: JSON.stringify(['gerar_inicial', 'gerar_contestacao', 'gerar_recursal', 'gerar_memoriais', 'fundamentar']),
        systemPrompt: `Você é um redator de petições jurídicas. Para cada peça:
1. Estrutura completa (endereçamento, qualificação, fatos, direito, pedidos)
2. Fundamentação legal com artigos específicos
3. Jurisprudência relevante (cite Súmulas STJ/STF/TST quando aplicável)
4. Linguagem jurídica formal e técnica
5. Pedidos numerados e específicos
6. Requerimentos de provas
7. Valor da causa
Não invente números. Use placeholders [como este] quando faltar informação.`,
        tools: JSON.stringify(['search_knowledge', 'search_jurisprudencia']),
        supervisionEnabled: true,
        status: 'Ativo',
        icon: 'PenLine',
        color: 'amber',
      },
    }),
    db.agent.create({
      data: {
        name: 'Pesquisador de Jurisprudência',
        description: 'Pesquisa teses, súmulas e precedentes sobre qualquer tema jurídico.',
        category: 'Pesquisa',
        capabilities: JSON.stringify(['buscar_teses', 'buscar_sumulas', 'buscar_precedentes', 'comparar_posicionamentos', 'sugerir_argumentos']),
        systemPrompt: `Você é um pesquisador de jurisprudência. Para cada tema:
1. TESS PRINCIPAIS (3+) com posicionamento atual
2. SÚMULAS aplicáveis (STJ, STF, TST)
3. PRECEDENTES paradigmáticos (sem inventar números)
4. POSICIONAMENTO dos tribunais superiores
5. ARGUMENTOS FAVORÁVEIS (para sua tese)
6. ARGUMENTOS CONTRÁRIOS (antecipar contestação)
7. RECOMENDAÇÕES de uso
Sempre indique que o advogado deve validar em fontes oficiais.`,
        tools: JSON.stringify(['search_knowledge', 'search_jurisprudencia']),
        supervisionEnabled: true,
        status: 'Ativo',
        icon: 'BookOpen',
        color: 'indigo',
      },
    }),
    db.agent.create({
      data: {
        name: 'Revisor de Conformidade OAB',
        description: 'Verifica conformidade com o Código de Ética da OAB em peças, comunicações e condutas.',
        category: 'Conformidade',
        capabilities: JSON.stringify(['verificar_etica', 'verificar_publicidade', 'verificar_honorarios', 'verificar_sigilo']),
        systemPrompt: `Você é um fiscal de ética da OAB. Verifique conformidade com:
- CÓDIGO DE ÉTICA E DISCIPLINA (Res. 02/2015)
- ESTATUTO DA OAB (Lei 8.906/94)
1. PUBLICIDADE (art. 5º CED) - é moderada e informativa?
2. HONORÁRIOS (art. 9º CED) - contratos estão conformes?
3. SIGILO PROFISSIONAL (art. 7º CED)
4. DEVERES (art. 2º CED)
5. VEDAÇÕES (art. 5º EOA)
Cite dispositivos. Aponte infrações com gravidade (leve/média/gravíssima).`,
        tools: JSON.stringify(['search_knowledge']),
        supervisionEnabled: true,
        status: 'Ativo',
        icon: 'Scale',
        color: 'red',
      },
    }),
  ])

  // ============ EXECUÇÕES DE EXEMPLO ============
  console.log('📋 Criando execuções de exemplo...')
  await db.agentRun.create({
    data: {
      agentId: agentes[0].id,
      task: 'Analisar contrato de prestação de serviços da Tech Solutions',
      input: JSON.stringify({ contratoId: 'demo', cliente: 'Tech Solutions Brasil S.A.' }),
      output: `# Análise de Contrato - Tech Solutions Brasil S.A.

## CLÁUSULAS IDENTIFICADAS (8 cláusulas)

### ✅ Cláusulas em conformidade (5)
1. Objeto - Prestação de serviços de consultoria jurídica mensal
2. Prazo - 12 meses com renovação automática
3. Foro - Comarca de São Paulo (adequado)
4. Lei aplicável - Legislação brasileira
5. Confidencialidade - Mútua

### ⚠️ Cláusulas de ATENÇÃO (2)
6. **Rescisão antecipada** - Multa de 50% do valor restante. **POTENCIALMENTE ABUSIVA** (CDC art. 51 II)
   - Sugestão: limitar a 10% ou valor proporcional
7. **Honorários** - Reajuste pela inflação + 5% a.a. Acima do mercado (média 3-4%)

### ❌ Cláusula NULA (1)
8. **Renúncia a direito** - "O cliente renuncia a qualquer direito de reclamação"
   - **NULA** conforme CDC art. 51 I e CDC art. 51 X (nulidade de pleno direito)

## OBRIGAÇÕES
**Contratada:** Serviços mensais, relatórios, sigilo
**Contratante:** Pagamento até dia 05, acesso a documentos

## SCORE DE RISCO: 65/100 (Médio-Alto)
**Recomendação:** Renegociar cláusulas 6, 7 e 8 antes de assinar.`,
      supervision: `## Supervisory AI - Verificação

✅ **Análise JURIDICAMENTE CORRETA.** Confirma:
- CDC art. 51 I e X aplicáveis à cláusula 8 (renúncia a direito)
- Multa de 50% é desproporcional (STJ tem precedentes limitando a 10-20%)
- Score de risco adequado

⚠️ **Observação:** Recomenda-se também verificar:
- Cláusula de exclusividade (não identificada - pode estar implícita)
- Limitação de responsabilidade

**Status:** APROVADO com observações.`,
      supervisionPassed: true,
      supervisionNotes: 'Análise técnica correta. Adicionadas 2 observações complementares.',
      status: 'Concluído',
      duration: 12500,
      tokensUsed: 1850,
    },
  })

  await db.agentRun.create({
    data: {
      agentId: agentes[1].id,
      task: 'Verificar LGPD no cadastro de clientes do JusFlow',
      input: JSON.stringify({ sistema: 'JusFlow', modulo: 'CRM' }),
      output: `# Relatório LGPD - Sistema JusFlow (Módulo CRM)

## BASE LEGAL IDENTIFICADA
✅ Execução de contrato (art. 7º V LGPD) - dados do cliente para prestação de serviços
✅ Cumprimento de obrigação legal (art. 7º II) - OAB exige identificação

## DADOS SENSÍVEIS DETECTADOS (art. 5º II)
⚠️ CPF/CNPJ - Dado pessoal (não sensível, mas protegido)
⚠️ Documentos de processos - Podem conter dados sensíveis (saúde, religião, etc)

## DIREITOS DO TITULAR (art. 18)
❌ **FALTA:** Mecanismo de portabilidade de dados
❌ **FALTA:** Botão "excluir meus dados"
✅ Acesso: cliente pode ver via portal
✅ Retificação: via advogado responsável

## ENCARREGADO/DPO (art. 41)
❌ **CRÍTICO:** DPO não nomeado no sistema
- Recomendação: nomear DPO e exibir contato no Portal do Cliente

## MEDIDAS DE SEGURANÇA (art. 46)
✅ Criptografia: (verificar implementação)
✅ Logs de auditoria: implementado
✅ Backup automático: implementado
⚠️ 2FA: opcional (recomendar obrigatório para advogados)

## TRANSFERÊNCIA INTERNACIONAL
N/A - Dados armazenados no Brasil

## CLASSIFICAÇÃO DE RISCO: MÉDIO
**Ações prioritárias:**
1. Nomear DPO
2. Implementar portabilidade
3. Política de retenção de dados
4. Treinar equipe`,
      supervision: `## Supervisory AI - Verificação

✅ **Análise LGPD CORRETA.** Pontos validados:
- Art. 7º V (execução de contrato) aplicável corretamente
- Art. 41 (DPO) - obrigatório para controladores que tratam dados sensíveis
- Art. 18 (direitos do titular) - identificação precisa

⚠️ **Adendo:** Sugiro também verificar:
- Política de retenção (art. 16)
- Procedimento de comunicação de incidentes (art. 48)

**Status:** APROVADO.`,
      supervisionPassed: true,
      supervisionNotes: 'Conformidade verificada. Adendos incluídos.',
      status: 'Concluído',
      duration: 9200,
      tokensUsed: 1450,
    },
  })

  // ============ BASE DE CONHECIMENTO ============
  console.log('📚 Criando base de conhecimento...')
  await db.knowledgeArticle.createMany({
    data: [
      {
        title: 'Tese STJ: Dano moral por inscrição indevida em órgão de proteção',
        content: `# Tese STJ - Inscrição Indevida

## POSICIONAMENTO ATUAL
O STJ consolidou entendimento de que a inscrição indevida do nome do consumidor em cadastros de proteção ao crédito gera dano moral *in re ipsa* (presumido), independentemente de prova.

## FUNDAMENTOS
- CDC art. 42 (proibição de cobrança indevida)
- CDC art. 43 (cadastros de proteção)
- Súmula 285 STJ (na hipótese de manutenção de inscrição injustificada)

## QUANTUM INDENIZATÓRIO
- Jurisprudência fixa valores entre R$ 5.000 e R$ 15.000 (varia por região)
- STJ modera para evitar enriquecimento ilícito

## PRECEDENTES
- REsp 1.412.864/PR (2017/0113247-9)
- AgInt no REsp 1.844.916/SP (2019/0333624-1)
- REsp 1.597.715/RJ (terceira turma)

## ARGUMENTOS FAVORÁVEIS (para autor)
1. Inscrição indevida configura falha na prestação de serviços
2. Dano moral presumido dispensa prova
3. Quantum deve ter caráter punitivo e pedagógico

## ARGUMENTOS CONTRÁRIOS (réu)
1. Culpa exclusiva do autor (ex: não pagamento)
2. Boa-fé objetiva do credor
3. Quantum excessivo`,
        summary: 'Inscrição indevida gera dano moral in re ipsa. Quantum R$ 5-15k.',
        category: 'Jurisprudência',
        area: 'Consumidor',
        tags: 'dano moral,inscrição indevida,SPC,Serasa,CDC,STJ',
        source: 'STJ',
        author: 'Dra. Patrícia Almeida',
        confidence: 95,
        verified: true,
      },
      {
        title: 'Horas extras: prova do trabalho extra (TST)',
        content: `# TST - Prova das Horas Extras

## POSICIONAMENTO ATUAL
O TST exige prova robusta das horas extras. A simples juntada de cartões de ponto não é suficiente se houver presunção de veracidade contestada.

## SÚMULA 338 TST
- Ônus da prova do empregador (jornada cumprida)
- Se houver registros impugnados, ônus se inverte
- Documentos sem assinatura podem ser provas

## SÚMULA 366 TST
- Cartões de ponto sem assinatura não geram presunção de veracidade absoluta
- Mas podem ser válidos como início de prova

## ESTRATÉGIA PARA RECLAMANTE
1. Juntar cartões de ponto (mesmo sem assinatura)
2. Produzir prova testemunhal qualificada
3. Demonstrar jornada por outros meios (e-mails, registros eletrônicos)
4. Questionar a regularidade dos registros

## QUANTUM
- Adicional de 50% sobre hora normal
- Reflexos em DSR, férias + 1/3, 13º, FGTS + 40%, aviso prévio`,
        summary: 'Horas extras exigem prova robusta. Súmulas 338 e 366 TST.',
        category: 'Jurisprudência',
        area: 'Trabalhista',
        tags: 'horas extras,jornada,TST,Súmula 338,Súmula 366,prova',
        source: 'TST',
        author: 'Dr. Roberto Lima',
        confidence: 92,
        verified: true,
      },
      {
        title: 'Crédito-prêmio IPI: tese atual do STJ',
        content: `# Crédito-prêmio IPI - STJ

## TEMA 69 STJ (REsp 1.222.852/RS)
STJ fixou tese: contribuintes do IPI têm direito ao crédito-prêmio previsto no Decreto-lei 491/1969, mesmo após revogação.

## REQUISITOS
1. Ser contribuinte do IPI (não cumulatividade)
2. Período: até 30/06/1975 (Lei 6.374/1975 SP)
3. Comprovar direito

## PROCEDIMENTO
- Ação ordinária (não mandado de segurança)
- Prazo prescricional: 5 anos (art. 1º Dec. 20.910/32)
- Tributário: aplicação Súmula 436 STJ

## QUANTUM
- Crédito-prêmio varia conforme produto
- Atualização: SELIC
- Compensação com débitos futuros

## RISCO
- Discutível (Tema 69 STJ favorável)
- Receita Federal ainda contesta (execução fiscal)`,
        summary: 'Crédito-prêmio IPI para contribuintes até 1975. Tema 69 STJ favorável.',
        category: 'Jurisprudência',
        area: 'Tributário',
        tags: 'IPI,crédito-prêmio,Tema 69,STJ,tributário,Decreto-lei 491',
        source: 'STJ',
        author: 'Dra. Patrícia Almeida',
        confidence: 88,
        verified: true,
      },
      {
        title: 'Modelo: Petição Inicial - Ação de Cobrança',
        content: `# Modelo: Petição Inicial - Ação de Cobrança

## ESTRUTURA

**EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA __ VARA CÍVEL DA COMARCA DE [CIDADE/UF]**

[NOME DO AUTOR], [nacionalidade], [estado civil], [profissão], portador do CPF [nº], RG [nº], residente na [endereço], por seu advogado que esta subscreve (procuração anexa), vem, respeitosamente, à presença de Vossa Excelência, propor a presente

**AÇÃO DE COBRANÇA**

em face de [NOME DO RÉU], [qualificação], pelos fatos e fundamentos a seguir:

## I - DOS FATOS
[Narrativa clara e cronológica]

## II - DO DIREITO
**1. Do inadimplemento** (CC art. 389, 395)
**2. Da mora** (CC art. 397)
**3. Da correção monetária** (Súmula 577 STF)
**4. Dos juros de mora** (CC art. 406)

## III - DOS PEDIDOS
1. Citação do réu
2. Procedência com condenação em [valor]
3. Correção + juros
4. Honorários de sucumba (CPC art. 85)
5. Custas

## IV - REQUERIMENTOS
Produção de provas: documental, testemunhal

## V - VALOR DA CAUSA
R$ [valor]

[local], [data].

[Assinatura do Advogado]
[OAB/UF nº]`,
        summary: 'Modelo de petição inicial de ação de cobrança com fundamentação.',
        category: 'Modelo',
        area: 'Cível',
        tags: 'petição,inicial,cobrança,modelo,CPC',
        source: 'Caso Próprio',
        author: 'Dra. Patrícia Almeida',
        confidence: 85,
        verified: true,
      },
      {
        title: 'Caso prático: Acordo trabalhista - Tech Solutions',
        content: `# Caso Prático - Acordo Trabalhista Tech Solutions

## SITUAÇÃO
Empregado reclamou verbas rescisórias + horas extras. Empresa buscou acordo.

## ESTRATÉGIA ADOTADA
1. Análise de risco: probabilidade de procedência 70%
2. Cálculo do risco: R$ 80k (condenação total)
3. Proposta de acordo: R$ 35k (44% do risco)

## NEGOCIAÇÃO
- 1ª proposta: R$ 35k (recusada)
- 2ª proposta: R$ 45k + parcelamento (aceita)
- Audiência: conciliação exitosa

## APRENDIZADOS
1. Calcular risco realista (não otimista)
2. Propor 40-50% do risco como abertura
3. Parcelamento facilita aceite
4. Audiência é momento-chave (juiz pressiona)

## RESULTADO
- Acordo: R$ 45k em 5x
- Honorários: R$ 5k sucumba
- Tempo: 2 meses vs 18 meses de processo
- Cliente satisfeito: evitou desgaste`,
        summary: 'Acordo trabalhista: calcular risco e propor 40-50%. Estratégia exitosa.',
        category: 'Caso Prático',
        area: 'Trabalhista',
        tags: 'acordo,conciliação,trabalhista,negociação,risco',
        source: 'Caso Próprio',
        author: 'Dra. Patrícia Almeida',
        confidence: 90,
        verified: true,
      },
    ],
  })

  // ============ REGRAS DE CONFORMIDADE ============
  console.log('⚠️ Criando regras de conformidade...')
  await db.complianceRule.createMany({
    data: [
      {
        name: 'Verificação de conflito de interesse obrigatória',
        category: 'Conflito de Interesse',
        description: 'Antes de aceitar novo cliente, verificar se há conflito com clientes existentes.',
        rule: 'TODA nova aceitação de caso deve passar por verificação de conflito. Buscar nome do cliente e partes contrárias na base de clientes e processos existentes. Se houver match, exigir aprovação manual do sócio responsável.',
        severity: 'Crítica',
        actionType: 'Bloqueio',
        enabled: true,
      },
      {
        name: 'Sigilo profissional em comunicações',
        category: 'Confidencialidade',
        description: 'Comunicações por e-mail/WhatsApp devem preservar sigilo do cliente.',
        rule: 'TODA comunicação externa contendo dados de processo deve usar: (1) e-mail criptografado, (2) WhatsApp Business com mensagem privada, (3) evitar citar detalhes sensíveis. Violação do art. 7º CED.',
        severity: 'Alta',
        actionType: 'Aviso',
        enabled: true,
      },
      {
        name: 'LGPD: nomeação de DPO',
        category: 'LGPD',
        description: 'Sistema deve ter Encarregado (DPO) nomeado conforme art. 41 LGPD.',
        rule: 'Escritórios que tratam dados sensíveis devem nomear DPO e exibir contato no Portal do Cliente. Verificar cadastro ativo do DPO no sistema.',
        severity: 'Alta',
        actionType: 'Aviso',
        enabled: true,
      },
      {
        name: 'Publicidade conforme Código de Ética OAB',
        category: 'OAB',
        description: 'Toda publicidade deve ser moderada, informativa e discreta (art. 5º CED).',
        rule: 'Materiais de marketing do escritório NÃO podem: (1) usar superlativos, (2) prometer resultado, (3) mencionar clientes sem autorização, (4) usar fotos dos advogados em situação frívola. Verificar peças antes de publicar.',
        severity: 'Média',
        actionType: 'Aprovação Manual',
        enabled: true,
      },
      {
        name: 'Contrato de honorários obrigatório',
        category: 'Honorários',
        description: 'Todo serviço deve ter contrato escrito com escopo e honorários definidos.',
        rule: 'ANTES de iniciar qualquer trabalho, o escritório deve ter contrato assinado pelo cliente com: (1) objeto claro, (2) valor dos honorários, (3) forma de pagamento, (4) foro. Sem contrato, não iniciar trabalho.',
        severity: 'Alta',
        actionType: 'Bloqueio',
        enabled: true,
      },
      {
        name: 'Retenção de documentos - prazo mínimo',
        category: 'LGPD',
        description: 'Documentos de processos encerrados devem ser mantidos por prazo mínimo.',
        rule: 'Documentos de processos encerrados devem ser mantidos por no mínimo 5 anos após o trânsito em julgado, conforme boas práticas e prazos prescricionais. Após este prazo, podem ser destruídos com autorização do cliente.',
        severity: 'Média',
        actionType: 'Aviso',
        enabled: true,
      },
      {
        name: 'Prazo fatal - alerta de antecedência',
        category: 'Prazos',
        description: 'Prazos fatais devem gerar alerta com 5, 3 e 1 dias de antecedência.',
        rule: 'TODOS os prazos fatais devem disparar: (1) notificação 5 dias antes, (2) alerta crítico 3 dias antes, (3) alerta urgente 1 dia antes, (4) alerta no dia. Falha configura negligência profissional.',
        severity: 'Crítica',
        actionType: 'Bloqueio',
        enabled: true,
      },
      {
        name: 'Backup automático diário',
        category: 'Segurança',
        description: 'Sistema deve realizar backup automático diário dos dados.',
        rule: 'Backup automático deve ser realizado diariamente (03h), com retenção de 30 dias. Verificar integridade semanalmente. Falhas devem gerar alerta crítico ao administrador.',
        severity: 'Alta',
        actionType: 'Aviso',
        enabled: true,
      },
    ],
  })

  // ============ PADRÕES DO ESCRITÓRIO ============
  console.log('🏛️ Criando padrões do escritório...')
  await db.firmStandard.createMany({
    data: [
      { category: 'Risco', name: 'Nível máximo de risco aceitável', value: 'Médio', description: 'Casos de risco Alto exigem aprovação do sócio responsável' },
      { category: 'SLA', name: 'Resposta a e-mail de cliente', value: '4 horas úteis', description: 'Todo e-mail deve ser respondido em até 4h úteis' },
      { category: 'SLA', name: 'Resposta a WhatsApp', value: '2 horas úteis', description: 'WhatsApp do cliente respondido em até 2h úteis' },
      { category: 'Comunicação', name: 'Idioma padrão', value: 'Português', description: 'Comunicações formais em português. Documentos podem ser bilíngues mediante solicitação' },
      { category: 'Qualidade', name: 'Revisão obrigatória', value: 'Dupla revisão', description: 'Toda petição deve passar por 2 revisões antes do envio (autor + revisor)' },
      { category: 'Confidencialidade', name: 'Classificação de documentos', value: 'Público, Interno, Confidencial, Restrito', description: 'Todo documento deve ser classificado' },
      { category: 'Prazos', name: 'Antecedência de alerta', value: '5, 3, 1 dias + dia', description: 'Prazos fatais geram alertas em 5, 3, 1 dias antes e no dia' },
    ],
  })

  // ============ OUTCOME PRICING ============
  console.log('💰 Criando tabela de preços por resultado...')
  await db.outcomePricing.createMany({
    data: [
      {
        name: 'Sucesso em Audiência Trabalhista',
        description: 'Honorário por vitória em audiência trabalhista (acordo ou procedência)',
        basePrice: 3000,
        successPrice: 8000,
        successCriteria: 'Acordo favorável ou procedência total dos pedidos',
        area: 'Trabalhista',
      },
      {
        name: 'Acordo em Processo Cível',
        description: 'Honorário por acordo firmado em processo cível',
        basePrice: 2000,
        successPrice: 5000,
        successCriteria: 'Acordo homologado com vantagem econômica ao cliente',
        area: 'Cível',
      },
      {
        name: 'Defesa Tributária - Redução',
        description: 'Honorário por redução de débito tributário',
        basePrice: 5000,
        successPrice: 15000,
        successCriteria: 'Redução mínima de 50% do débito ou anulação',
        area: 'Tributário',
      },
      {
        name: 'Recuperação de Crédito',
        description: 'Percentual sobre valor recuperado',
        basePrice: 1000,
        successPrice: 0,
        successCriteria: '20% do valor recuperado (successPrice calculado dinamicamente)',
        area: 'Cível',
      },
      {
        name: 'Sucesso em Recurso',
        description: 'Honorário por provimento de recurso',
        basePrice: 2500,
        successPrice: 6000,
        successCriteria: 'Recurso provido total ou parcialmente',
        area: 'Geral',
      },
    ],
  })

  console.log('✅ Seed Norm.ai concluído!')
  console.log(`   - ${agentes.length} agentes jurídicos`)
  console.log('   - 2 execuções de exemplo (com Supervisory AI)')
  console.log('   - 5 artigos de conhecimento')
  console.log('   - 8 regras de conformidade')
  console.log('   - 7 padrões do escritório')
  console.log('   - 5 modelos de outcome pricing')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
