export default function handler(req, res) {
  const VERIFY_TOKEN = "meumelhortoken"; // mesmo que você colocou no painel Meta

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verificado com sucesso!");
      res.status(200).send(challenge); // devolve só o challenge
    } else {
      console.error("Falha na verificação - Token recebido:", token);
      res.sendStatus(403);
    }
  }

  else if (req.method === "POST") {
    console.log("Mensagem recebida:", JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  }

  else {
    res.sendStatus(405);
  }
}
