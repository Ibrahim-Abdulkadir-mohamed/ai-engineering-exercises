
require("dotenv").config();
const OpenAI = require("openai");
const readline = require("readline");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter a topic: ", async (topic) => {
  console.log("\n--- Blog Outline ---\n");

  const stream = await client.responses.create({
    model: "gpt-5-mini",
    input: `Create a blog post outline about ${topic}`,
    stream: true,
  });

  let outline = "";

  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      process.stdout.write(event.delta);
      outline += event.delta;
    }
  }

  const summary = await client.responses.create({
    model: "gpt-5-mini",
    input: `Summarize this outline in exactly 2 sentences:\n${outline}`,
  });

  console.log("\n\n--- Summary ---");
  console.log(summary.output_text);

  rl.question("\nAsk a follow-up question: ", async (question) => {
    const answer = await client.responses.create({
      model: "gpt-5-mini",
      input: `Topic: ${topic}\nQuestion: ${question}`,
    });

    console.log("\n--- Answer ---");
    console.log(answer.output_text);

    rl.close();
  });
});

