import type { UnitContent } from "./types";

export const unitData: UnitContent = {
  unitNumber: "Módulo 3 · Unidade 2",
  unitTitle: "Planilhas, Webhooks e APIs: O Sistema Avisa Você",
  unitSubtitle:
    "Um PDF chega pelo Postman, vira documento indexado e deixa rastro numa planilha do Google.",
  overview:
    "Nesta unidade você sai do agendamento por relógio e entra na comunicação em tempo real por eventos. Aprenda como funcionam requisições HTTP e JSON, contratos de APIs (autenticação, limites e idempotência), Webhooks, como testar no Postman antes de automatizar e como registrar auditoria segura no Google Sheets via Conta de Serviço.",
  simulatorTitle: "Simulador Orientado a Evento (Webhook → API → Google Sheets)",
  simulatorSubtitle:
    "Veja como um documento enviado via Postman acorda o n8n na hora, indexa no RAG sem duplicar e registra rastro na planilha.",
  simulatorSteps: [
    {
      id: "postman",
      label: "1. Envio no Postman",
      shortDesc: "Origem dispara HTTP POST com JSON/PDF.",
      detail:
        "O sistema de origem (ou o Postman nos testes) envia um payload JSON ou arquivo PDF para o endereço do Webhook assim que o evento acontece.",
      payload: `POST https://n8n.local/webhook/novo-doc
Headers: { "x-webhook-token": "***" }
Body: { "arquivo": "contrato_12.pdf", "origem": "portal_clientes" }`,
    },
    {
      id: "webhook",
      label: "2. Nó Webhook (n8n)",
      shortDesc: "Valida o token, checa campos e responde rápido.",
      detail:
        "O nó Webhook valida a autenticidade do chamado, verifica se os campos obrigatórios vieram preenchidos e devolve resposta HTTP rápida para evitar timeout.",
      payload: `{
  "validacao_token": "OK",
  "campos_obrigatorios": ["arquivo", "origem"],
  "resposta_imediata": "202 Accepted"
}`,
    },
    {
      id: "ingest",
      label: "3. Indexação Idempotente",
      shortDesc: "API checa duplicata por conteúdo/hash.",
      detail:
        "A API de ingestão calcula o hash do conteúdo do documento. Mesmo se o webhook for reenviado por falha de rede, o arquivo não é indexado duas vezes.",
      payload: `{
  "hash_conteudo": "sha256:9f82a1...",
  "duplicata_detectada": false,
  "chunks_indexados": 14
}`,
    },
    {
      id: "sheets",
      label: "4. Google Sheets (Audit)",
      shortDesc: "Conta de Serviço grava linha na planilha.",
      detail:
        "Usando uma Conta de Serviço do Google Cloud com permissão apenas na planilha de auditoria, o fluxo grava data, arquivo, status e quantidade de chunks.",
      payload: `{
  "planilha": "Auditoria_Ingestao_RAG",
  "nova_linha": ["2026-11-16", "contrato_12.pdf", "INDEXADO", 14]
}`,
    },
    {
      id: "monitor",
      label: "5. Monitoramento & Retry",
      shortDesc: "Controla retentativas e protege contra falhas.",
      detail:
        "Caso um serviço externo falhe, o fluxo aplica retry com limite e alerta a equipe, mantendo rastro completo sem expor dados sensíveis.",
      payload: `{
  "status_final": "CONCLUIDO",
  "tentativas": 1,
  "duplicatas_evitadas": 0
}`,
    },
  ],
  concepts: [
    {
      id: "m3u2c1",
      chapter: "Capítulo 1 & 2 · Conversa HTTP",
      title: "O Custo do Silo e Anatomia de APIs (Requisição, Resposta e JSON)",
      summary:
        "Como sistemas saem do isolamento conversando por contratos HTTP padronizados.",
      fromZero:
        "Quando sistemas não conversam (silos), alguém precisa copiar e colar dados manualmente de uma tela para outra. Numa API HTTP, um sistema faz uma Requisição (método como GET ou POST, cabeçalhos e corpo em JSON) e recebe uma Resposta com um código de status (ex.: 200 OK, 404 Não Encontrado).",
      inPractice:
        "Regra de ouro: sempre teste a API primeiro manualmente em ferramentas como o Postman ou Insomnia. Se não funciona no Postman, não vai funcionar por mágica dentro do n8n.",
      attention:
        "Ignorar códigos de erro HTTP (4xx para erro no pedido, 5xx para erro no servidor) faz a automação achar que deu tudo certo quando na verdade falhou.",
      keyTakeaway:
        "Testar a requisição no Postman antes de automatizar economiza horas de depuração.",
    },
    {
      id: "m3u2c2",
      chapter: "Capítulo 3 · Contrato de API",
      title: "Autenticação, Paginação, Limites (Rate Limit) e Idempotência",
      summary:
        "As regras que toda integração profissional precisa respeitar.",
      fromZero:
        "Um contrato de API diz: como provar quem você é (Token / API Key), como buscar listas grandes em páginas (Paginação), quantas chamadas por minuto são aceitas (Rate Limit) e como evitar ações duplicadas em reenvios (Idempotência).",
      inPractice:
        "Ao receber erro `429 Too Many Requests`, o fluxo precisa esperar alguns segundos antes de tentar novamente em vez de bombardear o servidor.",
      attention:
        "Nunca coloque tokens de autenticação direto na URL onde ficam visíveis em históricos e logs — envie sempre no cabeçalho (Header).",
      keyTakeaway:
        "Respeitar paginação, rate limit e idempotência separa protótipos frágeis de integrações reais.",
    },
    {
      id: "m3u2c3",
      chapter: "Capítulo 4 · Webhooks",
      title: "O Sistema Avisa Você: Payload, Responder Rápido e Segurança",
      summary:
        "Por que esperar o evento acontecer é melhor do que ficar perguntando toda hora.",
      fromZero:
        "Webhook é uma 'URL campainha': em vez de você bater na porta toda hora perguntando se chegou carta, você deixa um endereço e o outro sistema toca a campainha enviando os dados (payload) na hora em que o evento acontece.",
      inPractice:
        "O segredo dos webhooks em produção é responder rápido (ex.: `200 OK` ou `202 Accepted` em menos de 3 segundos), porque se você demorar processando um PDF gigante antes de responder, o outro sistema acha que caiu e manda tudo de novo!",
      attention:
        "Webhooks expostos na internet precisam de verificação de token ou assinatura; caso contrário, qualquer pessoa na web pode disparar seu fluxo.",
      keyTakeaway:
        "Receba o webhook, valide o token, responda rápido e só depois faça o trabalho pesado.",
    },
    {
      id: "m3u2c4",
      chapter: "Capítulo 6 · Planilhas",
      title: "Os Três Papéis da Planilha — e Quando Ela NÃO é o Lugar",
      summary:
        "Usando planilhas como interface humana inteligente, não como banco de dados gigante.",
      fromZero:
        "Planilhas continuam existindo porque qualquer pessoa sabe ler, filtrar e comentar linhas sem saber programação. Elas brilham em três papéis: painel rápido de acompanhamento, fila de conferência humana e registro leve de auditoria.",
      inPractice:
        "No laboratório, a planilha do Google funciona como um livro-razão visual mostrando cada PDF que chegou via Postman e foi indexado no RAG.",
      attention:
        "Planilha NÃO é banco de dados para 500 mil linhas, não garante integridade forte de tipos e não deve guardar dados sensíveis sem controle de acesso.",
      keyTakeaway:
        "Use a planilha como janela amigável para humanos; deixe o armazenamento pesado no banco de dados.",
    },
    {
      id: "m3u2c5",
      chapter: "Capítulo 7–9 · Caminho Completo",
      title: "Do Webhook ao Endpoint de Ingestão Detalhada",
      summary:
        "Validando cada etapa entre a chegada do evento e o índice do RAG.",
      fromZero:
        "O fluxo segue quatro decisões claras: 1) validar origem e formato no Webhook; 2) enviar o arquivo para o endpoint de ingestão; 3) receber o detalhamento por documento (quantos chunks foram criados, se já existia); 4) registrar o resultado.",
      inPractice:
        "Retornar o detalhe por documento no JSON da API permite saber exatamente qual PDF falhou na leitura, em vez de apenas saber que 'algo deu errado'.",
      attention:
        "Sempre valide se o arquivo enviado no payload realmente é um PDF/texto válido e dentro do tamanho limite antes de tentar indexar.",
      keyTakeaway:
        "Cada etapa do caminho deve validar a entrada e devolver um retorno claro para a próxima.",
    },
    {
      id: "m3u2c6",
      chapter: "Capítulo 10 · Google Cloud",
      title: "Google Sheets com Conta de Serviço (Service Account) e Plano B",
      summary:
        "Autenticação segura de servidor para servidor sem depender de login pessoal.",
      fromZero:
        "Em vez de conectar sua conta pessoal do Gmail com acesso a todo o seu Google Drive, criamos uma Conta de Serviço no Google Cloud (um 'robô' com e-mail próprio) e compartilhamos APENAS a planilha daquele projeto com ela.",
      inPractice:
        "Caso haja bloqueio de rede ou falta de conta Google Cloud em laboratório, podemos usar um Plano B equivalente (como arquivo CSV local ou NocoDB/webhook de log).",
      attention:
        "Jamais envie o arquivo JSON da chave privada da Conta de Serviço para o GitHub!",
      keyTakeaway:
        "Conta de Serviço + compartilhamento restrito aplica o princípio do menor privilégio no Google Sheets.",
    },
    {
      id: "m3u2c7",
      chapter: "Capítulo 11 · Resiliência",
      title: "Idempotência no Reenvio e Duplicata por Conteúdo",
      summary:
        "Garantindo integridade mesmo quando o webhook dispara duas vezes.",
      fromZero:
        "Na internet, provedores de webhook às vezes enviam o mesmo evento duas vezes se houver demora na rede. Além disso, usuários podem subir o mesmo PDF com nomes diferentes (`contrato.pdf` e `contrato_copia.pdf`).",
      inPractice:
        "Verificando uma chave única do evento (idempotência no reenvio) e o hash do conteúdo do arquivo (duplicata por conteúdo), garantimos zero duplicação no índice e na planilha.",
      attention:
        "Confiar apenas no nome do arquivo não evita duplicatas quando alguém renomeia o mesmo PDF.",
      keyTakeaway:
        "Proteja tanto o reenvio do evento quanto a duplicação de conteúdo usando hash.",
    },
    {
      id: "m3u2c8",
      chapter: "Capítulo 12 · Segurança e LGPD",
      title: "Webhook Exposto, Escopo Mínimo e LGPD",
      summary:
        "Fechando as portas abertas antes de colocar a integração no ar.",
      fromZero:
        "Todo endereço de webhook público é uma porta na parede da empresa: precisa de chave secreta, validação estrita dos dados recebidos e registro de auditoria.",
      inPractice:
        "Aplique LGPD na planilha de log: registre o ID do documento, data e status, mas evite despejar textos inteiros ou CPFs/e-mails pessoais de clientes na planilha aberta à equipe.",
      attention:
        "Se uma planilha tem link 'qualquer pessoa com o link pode ver', dados registrados nela ficam expostos publicamente.",
      keyTakeaway:
        "Segurança em integrações combina token no webhook, escopo mínimo na conta de serviço e minimização de dados (LGPD).",
    },
  ],
  quiz: [
    {
      id: 1,
      question: "Qual é a principal vantagem de usar um Webhook em vez de Polling agendado?",
      options: [
        "O sistema de origem avisa imediatamente quando o evento ocorre, sem desperdício de consultas vazias.",
        "O Webhook funciona mesmo com o servidor desligado.",
        "Ele dispensa o uso do protocolo HTTP.",
        "Ele apaga todas as planilhas automaticamente.",
      ],
      correctIndex: 0,
      explanation:
        "Webhook é orientado a evento ('o sistema avisa você'), eliminando espera desnecessária e checagens repetitivas.",
    },
    {
      id: 2,
      question: "Por que devemos testar uma API no Postman antes de montar o fluxo no n8n?",
      options: [
        "Para validar URL, cabeçalhos, autenticação e formato do JSON isoladamente antes de automatizar.",
        "Porque o n8n exige que o Postman esteja aberto 24h.",
        "Para converter arquivos JSON em imagens PNG.",
        "Porque APIs não funcionam sem Postman instalado no servidor.",
      ],
      correctIndex: 0,
      explanation:
        "Testar manualmente primeiro elimina dúvidas sobre se o problema está na API ou na configuração do workflow.",
    },
    {
      id: 3,
      question: "Por que um nó de Webhook deve responder rápido (ex.: 200 OK ou 202 Accepted) antes de processar arquivos pesados?",
      options: [
        "Para evitar que o sistema remetente sofra timeout e reenvie o mesmo webhook várias vezes.",
        "Porque respostas rápidas mudam a cor do texto no navegador.",
        "Porque o JSON não aceita mais de 5 linhas.",
        "Para economizar bateria do teclado.",
      ],
      correctIndex: 0,
      explanation:
        "Provedores de webhook cancelam conexões lentas e fazem novas tentativas, o que gera reprocessamentos indesejados.",
    },
    {
      id: 4,
      question: "Qual é a forma mais segura de conectar o n8n ao Google Sheets em produção?",
      options: [
        "Deixar a planilha aberta para 'qualquer pessoa na internet editar'.",
        "Usar uma Conta de Serviço (Service Account) do Google Cloud compartilhando apenas a planilha necessária.",
        "Colocar sua senha pessoal do Gmail dentro de um texto público.",
        "Enviar os dados por comentário no YouTube.",
      ],
      correctIndex: 1,
      explanation:
        "Contas de Serviço permitem acesso automatizado com escopo mínimo restrito somente aos arquivos compartilhados com ela.",
    },
    {
      id: 5,
      question: "Como detectar que o mesmo PDF foi enviado com dois nomes diferentes (`doc.pdf` e `doc_v2.pdf`)?",
      options: [
        "Comparando apenas o tamanho da fonte do título.",
        "Calculando um hash (impressão digital) do conteúdo do arquivo antes de indexar.",
        "Contando quantas letras tem o nome do arquivo.",
        "Não é possível detectar.",
      ],
      correctIndex: 1,
      explanation:
        "O hash criptográfico do conteúdo detecta duplicatas reais mesmo quando o nome do arquivo muda.",
    },
    {
      id: 6,
      question: "O que significa receber um código HTTP `429 Too Many Requests` de uma API?",
      options: [
        "Tudo deu certo e o documento foi salvo.",
        "O limite de requisições por minuto (Rate Limit) foi ultrapassado e é preciso aguardar antes de tentar de novo.",
        "A senha foi aceita com sucesso.",
        "O servidor mudou de endereço para sempre.",
      ],
      correctIndex: 1,
      explanation:
        "Respeitar o Rate Limit com pausas evita bloqueios temporários ou banimento da chave de API.",
    },
    {
      id: 7,
      question: "Qual dos cenários abaixo NÃO é o lugar adequado para uma planilha?",
      options: [
        "Painel leve de auditoria de documentos recentes.",
        "Fila simples para revisão humana de poucos itens.",
        "Substituir um banco de dados transacional com centenas de milhares de registros e acessos simultâneos.",
        "Relatório resumido para acompanhamento da equipe.",
      ],
      correctIndex: 2,
      explanation:
        "Planilhas são ótimas interfaces humanas, mas não substituem bancos de dados robustos em alta escala.",
    },
    {
      id: 8,
      question: "Que risco ocorre ao deixar um Webhook público na internet sem token ou validação?",
      options: [
        "Qualquer pessoa ou robô pode enviar requisições falsas, disparando processos e gerando custos.",
        "O servidor fica mais rápido.",
        "O Google Sheets muda o idioma para inglês.",
        "Nenhum risco, pois URLs longas são impossíveis de achar.",
      ],
      correctIndex: 0,
      explanation:
        "Todo endpoint de webhook exposto deve validar um segredo/token ou assinatura antes de aceitar o payload.",
    },
    {
      id: 9,
      question: "Qual boa prática de LGPD deve ser aplicada ao gravar rastros na planilha de auditoria?",
      options: [
        "Colar todo o texto do documento com CPFs e endereços na planilha.",
        "Registrar apenas metadados necessários (ID, nome do arquivo, data, status), evitando dados pessoais sensíveis.",
        "Publicar a planilha em redes sociais.",
        "Remover a coluna de data e hora.",
      ],
      correctIndex: 1,
      explanation:
        "Minimização de dados reduz riscos de exposição indevida de dados pessoais.",
    },
    {
      id: 10,
      question: "Onde nunca deve ser enviada a chave JSON privada da Conta de Serviço do Google?",
      options: [
        "Para o cofre de credenciais do n8n.",
        "Para repositórios públicos ou commits no GitHub.",
        "Para variáveis de ambiente seguras no servidor.",
        "Para o arquivo `.gitignore`.",
      ],
      correctIndex: 1,
      explanation:
        "Chaves privadas em repositórios podem ser roubadas em segundos por robôs de varredura automática.",
    },
  ],
  memoryPairs: [
    {
      id: "m3u2m1",
      term: "Webhook",
      definition: "URL campainha em que o sistema avisa na hora que o evento ocorre.",
    },
    {
      id: "m3u2m2",
      term: "Payload JSON",
      definition: "Corpo estruturado de dados enviado na requisição ou resposta HTTP.",
    },
    {
      id: "m3u2m3",
      term: "Service Account",
      definition: "Identidade de robô no Google Cloud com acesso restrito a planilhas específicas.",
    },
    {
      id: "m3u2m4",
      term: "Hash de Conteúdo",
      definition: "Impressão digital usada para evitar indexar documentos duplicados.",
    },
    {
      id: "m3u2m5",
      term: "Responder Rápido",
      definition: "Devolver 200/202 logo no Webhook para evitar timeout e reenvios.",
    },
    {
      id: "m3u2m6",
      term: "Rate Limit (429)",
      definition: "Limite máximo de chamadas por minuto aceito por uma API externa.",
    },
  ],
};
