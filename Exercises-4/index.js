
require("dotenv").config();

const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const topic  = "Full stack and AI engineering";

  try {
    // 1. CREATE CONTENT
    console.log("Creating content...");

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `
      Create content about ${topic}. Give me: 1. Short article 2. Short summary
       3. Social media post
      `,
    });

    const content = response.output_text;

    console.log("Content created!");

    fs.mkdirSync("content-suite", { recursive: true, });

    fs.writeFileSync("content-suite/content.txt", content);

    console.log("Content saved!");

    // 2. IMAGE
    const createImage = true;

    if (createImage) {
      console.log("Creating image...");

      const image = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `Create a professional image about ${topic}`,
        size: "1024x1024",
      });

      const imageData = image.data[0].b64_json;

      fs.writeFileSync(
        "content-suite/image.png",
        Buffer.from(imageData, "base64")
      );

      console.log("Image saved!");
    }

    // 3. AUDIO 
    const createAudio = true;

    if (createAudio) {
      console.log("Creating audio...");

      const audio = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: content,
      });

      const audioData = Buffer.from(
        await audio.arrayBuffer()
      );

      fs.writeFileSync(
        "content-suite/audio.mp3",
        audioData
      );

      console.log("Audio saved!");
    }

    console.log("\n Content suite completed!");
  } catch (error) {
    console.log(" Something went wrong:");
    console.log(error.message);
  }
}

main();
