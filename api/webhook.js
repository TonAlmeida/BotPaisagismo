export default async function handler(req, res) {
  console.log('📨 Recebida requisição:', req.method);
  
  try {
    // VERIFICAÇÃO DO WEBHOOK (GET)
    if (req.method === 'GET') {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];
      
      // ⚠️ SUBSTITUA PELO SEU TOKEN DO PAINEL META!
      const VERIFY_TOKEN = 'meumelhortoken';
      
      console.log('🔍 Dados verificação:', { mode, token, challenge });
      
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook verificado com sucesso!');
        return res.status(200).send(challenge);
      } else {
        console.log('❌ Falha na verificação');
        return res.status(403).json({ error: 'Token inválido' });
      }
    }
    
    // RECEBIMENTO DE MENSAGENS (POST)
    if (req.method === 'POST') {
      console.log('📩 Mensagem recebida:', JSON.stringify(req.body, null, 2));
      return res.status(200).json({ status: 'success' });
    }
    
    // MÉTODO NÃO PERMITIDO
    return res.status(405).end();
    
  } catch (error) {
    console.error('💥 Erro no webhook:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
