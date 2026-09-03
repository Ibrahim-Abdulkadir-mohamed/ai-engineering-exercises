import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Joke from "@/models/Joke";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("q");

    if (!keyword) {
      return new Response(
        JSON.stringify({ success: false, error: "'q' waa waajib (query parameter)" }),
        { status: 400 }
      );
    }

    const jokes = await Joke.find({
      text: { $regex: new RegExp(keyword, "i") },
    });

    return new Response(
      JSON.stringify({ success: true, count: jokes.length, data: jokes }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Wax baa qaldamay" }),
      { status: 500 }
    );
  }
}