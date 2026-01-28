# Chat API Usage Guide

## Endpoint
```
POST https://your-domain.vercel.app/api/chat
```

## Request Format

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "message": "Tell me about your experience at Etched",
  "history": [
    {
      "role": "user",
      "content": "What technologies do you know?"
    },
    {
      "role": "assistant",
      "content": "I'm proficient in React, TypeScript, Python..."
    }
  ],
  "apiKey": "your-api-key-here" // Optional, only if CHAT_API_KEY is set in env
}
```

### Parameters
- **message** (required): The user's question/query
- **history** (optional): Array of previous messages for context. Format: `[{ role: "user" | "assistant", content: string }]`
- **apiKey** (optional): API key for authentication (only needed if `CHAT_API_KEY` is set in environment variables)

## Response

The API returns a **streaming response** (Server-Sent Events format).

### Example Usage

#### JavaScript/TypeScript (Fetch API)
```javascript
async function chatWithOmkar(message, history = []) {
  const response = await fetch('https://your-domain.vercel.app/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history,
      // apiKey: 'your-api-key' // Optional
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    result += decoder.decode(value, { stream: true });
    // Process chunks as they arrive
    console.log('Chunk:', decoder.decode(value));
  }

  return result;
}

// Usage
chatWithOmkar('What projects have you worked on?')
  .then(response => console.log('Full response:', response));
```

#### Python
```python
import requests
import json

def chat_with_omkar(message, history=None, api_key=None):
    url = 'https://your-domain.vercel.app/api/chat'
    payload = {
        'message': message,
        'history': history or []
    }
    if api_key:
        payload['apiKey'] = api_key
    
    response = requests.post(
        url,
        json=payload,
        headers={'Content-Type': 'application/json'},
        stream=True
    )
    
    result = ''
    for chunk in response.iter_content(chunk_size=None):
        if chunk:
            result += chunk.decode('utf-8')
    
    return result

# Usage
response = chat_with_omkar('Tell me about your skills')
print(response)
```

#### cURL
```bash
curl -X POST https://your-domain.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is your experience with AI/ML?",
    "history": []
  }'
```

## Setting Up API Key (Optional)

1. Add to your `.env.local`:
   ```
   CHAT_API_KEY=your-secret-api-key-here
   ```

2. Add the same key to Vercel environment variables

3. Include the key in your requests:
   ```json
   {
     "message": "Your question",
     "apiKey": "your-secret-api-key-here"
   }
   ```

## Features

- **Streaming responses**: Get responses as they're generated (real-time)
- **Context-aware**: Uses your portfolio data from MongoDB
- **Smart retrieval**: Automatically detects query intent and fetches relevant data
- **Conversation history**: Supports multi-turn conversations
- **CORS enabled**: Can be called from any domain

## Example Queries

- "Tell me about your experience at Etched"
- "What projects have you worked on?"
- "What technologies do you specialize in?"
- "What is your educational background?"
- "Tell me about your biggest project"
