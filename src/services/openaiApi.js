export async function sendMessage(conversationHistory, { onDelta } = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("No API key found");
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
         model: "llama-3.1-8b-instant",  // ✅ Higher rate limits, available 24/7
          messages: conversationHistory.map(msg => ({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content
          })),
        }),
      }
    );

    const data = await response.json();
    console.log("Groq Response:", data);

    if (!response.ok) {
      throw new Error(data.error?.message || "Request failed");
    }

    const reply = data.choices[0].message.content;
    console.log("Reply text:", reply);         // debug
    console.log("onDelta exists:", !!onDelta); // debug

    // ✅ THIS IS THE KEY FIX
    if (onDelta) onDelta(reply);

    return reply;

  } catch (error) {
    console.error(error);
    throw new Error("Error calling API");
  }
}