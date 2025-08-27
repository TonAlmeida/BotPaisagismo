const fetch = require("node-fetch");

const token = "meutoken";
const phoneNumberId = "740479862489336";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Endpoint de verificação do WhatsApp
    const mode = req.query["hub.mode"];
    const tokenReceived = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && tokenReceived === "meutoken") {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Token inválido");
    }
  }

  if (req.method === "POST") {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message) {
      const from = message.from;
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

    return res.status(200).send("EVENT_RECEIVED");
  }

  return res.status(405).send("Método não permitido");
}

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

async function enviarMensagem(to, message) {
  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
  const data = { messaging_product: "whatsapp", to, text: { body: message } };

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

