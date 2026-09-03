import { connectDB } from "@/lib/db";
import Joke from "@/models/Joke";
import { FALLBACK_JOKES } from "@/lib/fallbackJokes";

export async function GET() {
  try {
    await connectDB();

    let jokeText: string;
    let jokeId: string;
    let source: string;

    try {
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      jokeText = data.joke;
      jokeId = data.id;
      source = "api";
    } catch (apiError) {
      const randomFallback = FALLBACK_JOKES[Math.floor(Math.random() * FALLBACK_JOKES.length)];
      jokeText = randomFallback.text;
      jokeId = `local-${Date.now()}`;
      source = "local";
    }

    let joke = await Joke.findOne({ joke_id: jokeId });

    if (!joke) {
      joke = await Joke.create({
        joke_id: jokeId,
        text: jokeText,
        category: "dad",
        source: source,
      });
    }

    return new Response(
      JSON.stringify({ success: true, data: joke }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Wax baa qaldamay" }),
      { status: 500 }
    );
  }
}