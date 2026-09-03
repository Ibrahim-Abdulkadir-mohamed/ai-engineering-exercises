import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SCHEMA_CONTEXT = `
Waxaad tahay MongoDB query generator. Waxaad ku tarjumeysaa natural language queries JSON MongoDB query ah.

Collections:
1. movies: { title: String, director: String, releaseYear: Number, genre: String, rating: Number (0-10), description: String }
2. users: { name: String, email: String, age: Number, favorite_genre: String }
3. reviews: { movie: ObjectId, user: ObjectId, rating: Number (1-5), comment: String }

Qawaaniinta:
- Kaliya soo celi JSON valid ah, wax kale ha ku darin (ma aha markdown, ma aha sharaxaad)
- Format: { "collection": "movies|users|reviews", "operation": "find|count|aggregate", "query": {...} }
- Tusaale 1: "Show me all sci-fi movies" -> { "collection": "movies", "operation": "find", "query": { "genre": "Sci-Fi" } }
- Tusaale 2: "Find users over 25" -> { "collection": "users", "operation": "find", "query": { "age": { "$gt": 25 } } }
- Tusaale 3: "Get movies with rating above 8.5" -> { "collection": "movies", "operation": "find", "query": { "rating": { "$gt": 8.5 } } }
- Tusaale 4: "Count total movies by genre" -> { "collection": "movies", "operation": "aggregate", "query": [{ "$group": { "_id": "$genre", "count": { "$sum": 1 } } }] }
`;

export async function convertToQuery(userText: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SCHEMA_CONTEXT },
      { role: "user", content: userText },
    ],
    temperature: 0, 
  });

  const rawText = response.choices[0].message.content;

  if (!rawText) {
    throw new Error("LLM-gu jawaab ma soo celin");
  }

  return JSON.parse(rawText);
}


