
require("dotenv").config();

const OpenAI = require("openai");
const fs = require("fs");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createVoice(text, voice, instruction, fileName) {
  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: voice,
    input: text,
    instructions: instruction,
  });

  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(fileName, buffer);

  console.log(`${fileName} saved!`);
}

async function main() {
  await createVoice(
    "Hello! Today we are going to talk about artificial intelligence.",
    "alloy",
    "Speak with excitement and enthusiasm.",
    "speaker-1.mp3"
  );

  await createVoice(
    "That sounds interesting. I am happy to learn about it!",
    "nova",
    "Speak in a happy and friendly way.",
    "speaker-2.mp3"
  );

  console.log("Conversation completed!");
}

main();
