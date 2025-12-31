export default {
  async fetch(request, env) {
    // CORS: Sadece senin GitHub Pages sitene veya her yere (*) izin verir
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Ön kontrol isteği (Tarayıcı güvenliği için)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Gelen mesajları al
      const { messages } = await request.json();

      // Groq API'sine güvenli çağrı (API KEY BURADA GİZLİ)
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.API_KEY}`, // Panelden eklediğin Secret
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: messages,
          temperature: 0.7
        })
      });

      const data = await response.json();

      // Yanıtı tarayıcıya geri gönder
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Sistem hatası oluştu." }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
