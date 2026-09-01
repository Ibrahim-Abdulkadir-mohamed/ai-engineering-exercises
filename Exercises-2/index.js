
require("dotenv").config();

const OpenAI = require("openai");
const fs = require("fs");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const theme = "A Somali developer coding at night,";

  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt: theme,
    size: "1024x1024",
  });

  const image = result.data[0].b64_json;

  fs.writeFileSync( "image.png", Buffer.from(image, "base64"));

  const metadata = { model: "gpt-image-1",  prompt: theme,
    image: {
      fileName: "image.png",
      format: "PNG",
      width: 1024,
      height: 1024,
      size: "1024x1024",
    },

    generation: {
      createdAt: new Date().toISOString(),
      provider: "OpenAI",
      type: "image-generation",
    },
  };

  fs.writeFileSync("metadata.json", JSON.stringify(metadata, null, 2)
  );

  console.log("Image and detailed metadata saved!");
}

main();



