import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

const token = "SEU_TOKEN_DO_WHATSAPP";
const phoneNumberId = "SEU_PHONE_NUMBER_ID";

app.post("/webhook", (req, res) => {
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from; // número do cliente
    const text = message.text?.body;

    if (!text) {
      enviarMensagem(from, menuInicial());
    } else {
      // Responde baseado na opção digitada
      switch (text.trim()) {
        case "1":
          enviarMensagem(from, "🌿 Paisagismo residencial: Oferecemos projetos personalizados para jardins de casas e condomínios.");
          break;
        case "2":
          enviarMensagem(from, "🏢 Paisagismo comercial: Criamos ambientes verdes para empresas, lojas e áreas públicas.");
          break;
        case "3":
          enviarMensagem(from, "💧 Irrigação e sistemas automatizados: Instalação e manutenção de sistemas inteligentes de irrigação.");
          break;
        case "4":
          enviarMensagem(from, "✂️ Manutenção de jardins: Podas, limpeza e cuidados com seu jardim.");
          break;
        case "5":
          enviarMensagem(from, "📋 Consultoria em paisagismo: Orientação especializada para transformar seu espaço verde.");
          break;
        case "6":
          enviarMensagem(from, "🌸 Mudas ornamentais: Temos diversas espécies de mudas para compra e plantio.");
          break;
        case "7":
          enviarMensagem(from, "❓ Outros assuntos: Por favor, descreva sua dúvida ou necessidade e entraremos em contato.");
          break;
        default:
          enviarMensagem(from, "Desculpe, não entendi. Por favor, digite um número de 1 a 7 para escolher uma opção.");
      }
    }
  }

  res.sendStatus(200);
});

function enviarMensagem(to, message) {
  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
  const data = {
    messaging_product: "whatsapp",
    to: to,
    text: {
      body: message,
    },
  };

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
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

app.listen(3000, () => console.log("Bot rodando na porta 3000"));
