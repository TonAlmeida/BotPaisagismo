const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "meumelhortoken"; // token de verificação do webhook
const WHATSAPP_TOKEN = "meumelhortoken"; // access token da API do WhatsApp
const PHONE_NUMBER_ID = "740479862489336"; // seu phone_number_id fixo

// Verificação do Webhook (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Recebimento de mensagens (POST)
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message) {
      const from = message.from; // número do usuário
      const text = message.text?.body;
      let reply = menuInicial();

      switch (text?.trim()) {
        case "1":
          reply = "🌿 Paisagismo residencial...";
          break;
        case "2":
          reply = "🏢 Paisagismo comercial...";
          break;
        case "3":
          reply = "💧 Irrigação e sistemas automatizados...";
          break;
        case "4":
          reply = "✂️ Manutenção de jardins...";
          break;
        case "5":
          reply = "📋 Consultoria em paisagismo...";
          break;
        case "6":
          reply = "🌸 Mudas ornamentais...";
          break;
        case "7":
          reply = "❓ Outros assuntos...";
          break;
        default:
          reply = "Desculpe, não entendi. Digite 1 a 7.";
      }

      await enviarMensagem(from, reply);
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.sendStatus(500);
  }
});

// Função do menu inicial
function menuInicial() {
  return `🌱 Olá, seja bem-vindo(a) à *[Nome da Empresa]*.
Eu sou o assistente virtual e vou te ajudar a encontrar o que precisa.

1️⃣ Paisagismo residencial
2️⃣ Paisagismo comercial
3️⃣ Irrigação e sistemas automatizados
4️⃣ Manutenção de jardins
5️⃣ Consultoria em paisagismo
6️⃣ Mudas ornamentais
7️⃣ Outros`;
}

// Função para enviar mensagem
async function enviarMensagem(to, message) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  const data = {
    me

