export async function sendMessage(conversationHistory, { onDelta } = {}) {
  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       model: 'llama-3.1-8b-instant',
        messages: conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Request failed');
    }

    const reply = data.choices[0].message.content;

    if (onDelta) onDelta(reply);

    return reply;

  } catch (error) {
    console.error(error);
    throw new Error('Error calling API');
  }
}