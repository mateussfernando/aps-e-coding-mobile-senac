const express = require('express');
const cors = require('cors');
const bodyParser = 'body-parser';
const axios = require('axios');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(require('body-parser').json()); 

// Configuração do MongoDB
const mongoUri = 'mongodb://localhost:27017';
const dbName = 'crimeEvidenceDB';
const collectionName = 'evidence';
const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

// Dados estáticos de evidências de crimes para carregar no banco
const staticCrimeEvidence = [
  {
    case_id: "CSI-2024-001",
    crime_type: "Homicídio",
    date_occurrence: "2024-05-15T14:30:00Z",
    location: "Rua das Palmeiras, 123, Bairro Central, Cidade Exemplo",
    victim: {
      name: "João Silva",
      age: 45
    },
    evidences: [
      { id: "EV001", type: "Arma de fogo", description: "Pistola calibre .380, encontrada próxima ao corpo da vítima. Número de série raspado.", collected_by: "Perito Carlos Andrade", collection_date: "2024-05-15T15:00:00Z" },
      { id: "EV002", type: "Impressões digitais", description: "Fragmentos de impressões digitais parciais coletados na maçaneta da porta de entrada.", collected_by: "Perito Carlos Andrade", collection_date: "2024-05-15T15:30:00Z" },
      { id: "EV003", type: "Testemunha ocular", description: "Maria Oliveira, vizinha, relatou ter ouvido disparos por volta das 14:25 e visto um indivíduo alto, vestindo casaco escuro, fugindo do local em direção à Avenida Principal.", collected_by: "Detetive Ana Costa", collection_date: "2024-05-15T16:00:00Z" },
      { id: "EV004", type: "Mancha de sangue", description: "Amostra de substância aparentando ser sangue, tipo O+, encontrada na parede da sala, a 1.5m do solo.", collected_by: "Perito Carlos Andrade", collection_date: "2024-05-15T15:15:00Z" },
      { id: "EV005", type: "Cápsulas de munição", description: "Três cápsulas de munição calibre .380 deflagradas, encontradas próximas ao corpo.", collected_by: "Perito Carlos Andrade", collection_date: "2024-05-15T15:05:00Z" }
    ],
    suspects: [
      { name: "Pedro Almeida", connection_to_victim: "Ex-sócio, com histórico de disputas financeiras recentes.", notes: "Visto nas proximidades do local do crime no dia anterior." },
      { name: "Carlos Ferreira", connection_to_victim: "Vizinho com quem a vítima teve um desentendimento público na semana passada.", notes: "Nega envolvimento, mas não apresentou álibi conclusivo."}
    ],
    autopsy_findings: "Causa da morte: Múltiplos ferimentos por projétil de arma de fogo. Três projéteis recuperados do corpo, compatíveis com calibre .380."
  },
  {
    case_id: "CSI-2024-002",
    crime_type: "Roubo Majorado",
    date_occurrence: "2024-06-01T10:00:00Z",
    location: "Agência Bancária Central, Praça da Matriz, Cidade Exemplo",
    victim: {
      name: "Banco Exemplo S.A.",
      details: "Funcionários e clientes presentes foram rendidos."
    },
    evidences: [
      { id: "EV006", type: "Imagens de CCTV", description: "Gravações das câmeras de segurança internas e externas registraram a ação de três indivíduos mascarados e armados.", collected_by: "Detetive Bianca Lima", collection_date: "2024-06-01T11:00:00Z" },
      { id: "EV007", type: "Veículo Abandonado", description: "Automóvel sedan de cor prata, utilizado na fuga e abandonado a 2km do local. Placas adulteradas. Impressões digitais parciais recuperadas no volante.", collected_by: "Perito Ricardo Nunes", collection_date: "2024-06-01T12:30:00Z" },
      { id: "EV008", type: "Ferramenta de Arrombamento", description: "Pé de cabra encontrado próximo ao cofre arrombado.", collected_by: "Perito Ricardo Nunes", collection_date: "2024-06-01T10:45:00Z" }
    ],
    suspects: [],
    modus_operandi: "Ação rápida e coordenada, com uso de armas de fogo para intimidação. Fuga em veículo roubado. Alvo específico: cofre principal da agência."
  }
];

// Função para conectar ao MongoDB e carregar dados iniciais
async function connectAndSeedDB() {
  try {
    await client.connect();
    console.log("Conectado com sucesso ao MongoDB!");
    db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Verifica se a coleção já tem dados para evitar duplicatas
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(staticCrimeEvidence);
      console.log("Dados estáticos de evidências de crimes carregados no MongoDB.");
    } else {
      console.log("Coleção de evidências já contém dados. Nenhum dado novo foi carregado.");
    }
  } catch (err) {
    console.error("Falha ao conectar ou carregar dados no MongoDB:", err);
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao DB
  }
}

// Chave da API Gemini
const GEMINI_API_KEY = '';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

// Endpoint para solicitar a geração de um laudo
app.post('/generate-report', async (req, res) => {
  const { case_id } = req.body;

  if (!case_id) {
    return res.status(400).json({ error: "O 'case_id' é obrigatório no corpo da requisição." });
  }

  try {
    const evidenceCollection = db.collection(collectionName);
    const crimeCase = await evidenceCollection.findOne({ case_id: case_id });

    if (!crimeCase) {
      return res.status(404).json({ error: `Caso com ID '${case_id}' não encontrado.` });
    }

    // Monta o prompt para a LLM com as informações do caso
    let promptText = `Por favor, gere um laudo pericial preliminar conciso e bem estruturado para o seguinte caso criminal:\n\n`;
    promptText += `ID do Caso: ${crimeCase.case_id}\n`;
    promptText += `Tipo de Crime: ${crimeCase.crime_type}\n`;
    promptText += `Data da Ocorrência: ${new Date(crimeCase.date_occurrence).toLocaleString('pt-BR')}\n`;
    promptText += `Local: ${crimeCase.location}\n\n`;

    if (crimeCase.victim) {
      promptText += `Vítima(s):\n`;
      if (crimeCase.victim.name) promptText += `- Nome: ${crimeCase.victim.name}\n`;
      if (crimeCase.victim.age) promptText += `- Idade: ${crimeCase.victim.age}\n`;
      if (crimeCase.victim.details) promptText += `- Detalhes Adicionais: ${crimeCase.victim.details}\n`;
      promptText += `\n`;
    }

    promptText += `Evidências Coletadas:\n`;
    crimeCase.evidences.forEach(ev => {
      promptText += `- ID: ${ev.id}, Tipo: ${ev.type}, Descrição: ${ev.description}, Coletado por: ${ev.collected_by} em ${new Date(ev.collection_date).toLocaleString('pt-BR')}\n`;
    });
    promptText += `\n`;

    if (crimeCase.suspects && crimeCase.suspects.length > 0) {
      promptText += `Suspeito(s) Identificado(s):\n`;
      crimeCase.suspects.forEach(sus => {
        promptText += `- Nome: ${sus.name}, Ligação com a vítima/caso: ${sus.connection_to_victim}`;
        if (sus.notes) promptText += `, Observações: ${sus.notes}`;
        promptText += `\n`;
      });
      promptText += `\n`;
    }

    if (crimeCase.autopsy_findings) {
        promptText += `Achados da Autópsia (se aplicável): ${crimeCase.autopsy_findings}\n\n`;
    }
    if (crimeCase.modus_operandi) {
        promptText += `Modus Operandi: ${crimeCase.modus_operandi}\n\n`;
    }

    promptText += `Com base nessas informações, analise as evidências, identifique possíveis conexões entre elas e os suspeitos (se houver), e apresente uma conclusão preliminar sobre a dinâmica provável dos fatos e possíveis linhas de investigação a seguir.`;
    promptText += `O laudo deve ser técnico, objetivo e baseado estritamente nos dados fornecidos.`;


    console.log("Enviando prompt para a LLM:", promptText);

    const geminiResponse = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: promptText }] }],
        // Opcional: Adicionar configurações de geração, como temperatura, etc.
        // generationConfig: {
        //   temperature: 0.7,
        //   topK: 1,
        //   topP: 1,
        //   maxOutputTokens: 2048,
        // },
      }
    );

    if (geminiResponse.data.candidates && geminiResponse.data.candidates.length > 0 &&
        geminiResponse.data.candidates[0].content && geminiResponse.data.candidates[0].content.parts &&
        geminiResponse.data.candidates[0].content.parts.length > 0) {
      const report = geminiResponse.data.candidates[0].content.parts[0].text;
      res.json({ case_id: crimeCase.case_id, report: report });
    } else {
      console.error("Resposta da API Gemini em formato inesperado:", geminiResponse.data);
      // Verifica se há um erro de prompt bloqueado
      if (geminiResponse.data.promptFeedback && geminiResponse.data.promptFeedback.blockReason) {
        throw new Error(`Prompt bloqueado pela API Gemini: ${geminiResponse.data.promptFeedback.blockReason}. Detalhes: ${JSON.stringify(geminiResponse.data.promptFeedback.safetyRatings)}`);
      }
      throw new Error('Resposta da API Gemini não contém o conteúdo esperado.');
    }

  } catch (error) {
    console.error("Erro ao processar a solicitação de laudo:", error.message);
    if (error.response) {
      console.error("Detalhes do erro da API Gemini:", error.response.data);
      res.status(error.response.status || 500).json({ error: 'Erro ao chamar a API LLM', details: error.response.data });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }
});

// Rota de teste para verificar dados do MongoDB (opcional)
app.get('/evidence/:case_id', async (req, res) => {
  const { case_id } = req.params;
  try {
    const evidenceCollection = db.collection(collectionName);
    const crimeCase = await evidenceCollection.findOne({ case_id: case_id });
    if (crimeCase) {
      res.json(crimeCase);
    } else {
      res.status(404).json({ error: "Caso não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados do MongoDB', details: error.message });
  }
});


// Inicia o servidor após conectar ao DB
async function startServer() {
  await connectAndSeedDB(); // Conecta ao DB e carrega os dados estáticos

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`---------------------------------------------------------------------------`);
    console.log(`Para testar, envie um POST para http://localhost:${port}/generate-report`);
    console.log(`Com o corpo (JSON): { "case_id": "CSI-2024-001" } ou { "case_id": "CSI-2024-002" }`);
  });
}

startServer();

// Tratamento para fechar a conexão com o MongoDB ao encerrar o servidor
process.on('SIGINT', async () => {
  console.log("Recebido SIGINT. Fechando conexão com o MongoDB...");
  await client.close();
  console.log("Conexão com o MongoDB fechada.");
  process.exit(0);
});