# API Integration

## Scholarsome API Endpoint

This extension sends study set data to the Scholarsome API for import.

### Endpoint

```
POST {scholarsome_url}/api/import
```

### Headers

```http
Content-Type: application/json
Authorization: Bearer {api_key}
```

### Request Payload

```json
{
  "title": "Spanish Vocabulary - Lesson 1",
  "cards": [
    {
      "front": "hola",
      "back": "hello"
    },
    {
      "front": "adiós",
      "back": "goodbye"
    },
    {
      "front": "gracias",
      "back": "thank you"
    }
  ],
  "source": "quizlet",
  "source_url": "https://quizlet.com/123456789/spanish-vocabulary-lesson-1-flash-cards/"
}
```

### Request Payload Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | The title of the study set |
| `cards` | array | Yes | Array of card objects |
| `cards[].front` | string | Yes | The term/question (front of card) |
| `cards[].back` | string | Yes | The definition/answer (back of card) |
| `source` | string | Yes | Source platform (always "quizlet") |
| `source_url` | string | Yes | Original Quizlet URL |

### Success Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "set_id": "abc123",
  "message": "Study set imported successfully",
  "cards_imported": 3,
  "url": "https://scholarsome.com/sets/abc123"
}
```

### Error Responses

#### Authentication Error

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```

```json
{
  "error": "Invalid API key",
  "message": "The provided API key is not valid or has expired"
}
```

#### Validation Error

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
```

```json
{
  "error": "Validation failed",
  "message": "Request validation failed",
  "details": [
    "title is required",
    "cards must contain at least one card"
  ]
}
```

#### Server Error

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
```

```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred while processing your request"
}
```

## API Configuration

Users must configure the extension with:

1. **Scholarsome URL**: The base URL of their Scholarsome instance
   - Example: `https://scholarsome.com`
   - Should not include trailing slash or `/api/import` path

2. **API Key**: A valid Scholarsome API key with import permissions
   - Format: Bearer token
   - Can be obtained from Scholarsome account settings

## Implementation Notes

### Error Handling

The extension handles various error scenarios:

1. **Missing Configuration**: Checks for API key before making requests
2. **Network Errors**: Catches fetch errors and displays user-friendly messages
3. **API Errors**: Parses error responses and displays details to user
4. **Empty Data**: Validates that study set has terms before sending

### Data Transformation

The extension transforms Quizlet's term/definition structure to Scholarsome's front/back card format:

```javascript
// Quizlet format
{
  terms: [
    { term: "hello", definition: "hola" }
  ]
}

// Scholarsome format
{
  cards: [
    { front: "hello", back: "hola" }
  ]
}
```

### API Compatibility

If the Scholarsome API uses a different format, the `background.js` file can be modified:

```javascript
// Current implementation in background.js
const payload = {
  title: data.title,
  cards: data.terms.map(term => ({
    front: term.term,
    back: term.definition
  })),
  source: 'quizlet',
  source_url: data.url
};

// Modify this section to match your API's expected format
```

## Testing the API

### Using cURL

```bash
curl -X POST https://scholarsome.com/api/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "title": "Test Study Set",
    "cards": [
      {"front": "term1", "back": "definition1"},
      {"front": "term2", "back": "definition2"}
    ],
    "source": "quizlet",
    "source_url": "https://quizlet.com/test"
  }'
```

### Using JavaScript (Node.js)

```javascript
const fetch = require('node-fetch');

async function testScholaromeAPI() {
  const response = await fetch('https://scholarsome.com/api/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      title: 'Test Study Set',
      cards: [
        { front: 'term1', back: 'definition1' },
        { front: 'term2', back: 'definition2' }
      ],
      source: 'quizlet',
      source_url: 'https://quizlet.com/test'
    })
  });

  const result = await response.json();
  console.log(result);
}

testScholaromeAPI();
```

## Mock API for Development

For testing without a real Scholarsome instance, you can create a mock API:

```javascript
// Simple mock server using Express.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/import', (req, res) => {
  // Validate API key
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  if (apiKey !== 'test-key-123') {
    return res.status(401).json({
      error: 'Invalid API key'
    });
  }

  // Validate payload
  if (!req.body.title || !req.body.cards || req.body.cards.length === 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Title and cards are required'
    });
  }

  // Success response
  res.json({
    success: true,
    set_id: 'mock-' + Date.now(),
    message: 'Study set imported successfully',
    cards_imported: req.body.cards.length,
    url: 'https://scholarsome.com/sets/mock-' + Date.now()
  });
});

app.listen(3000, () => {
  console.log('Mock API running on http://localhost:3000');
});
```

Then update the extension settings to use `http://localhost:3000`.
