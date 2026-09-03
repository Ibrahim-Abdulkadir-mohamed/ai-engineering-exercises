import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import MovieCache from "@/models/MovieCache";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = "http://www.omdbapi.com/";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const year = searchParams.get("year");

    if (!title) {
      return new Response(
        JSON.stringify({ success: false, error: "'title' waa waajib" }),
        { status: 400 }
      );
    }

    const cached = await MovieCache.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") }, 
    });

    if (cached) {
      return new Response(
        JSON.stringify({ success: true, source: "cache", data: cached }),
        { status: 200 }
      );
    }

    const url = `${OMDB_BASE_URL}?t=${encodeURIComponent(title)}${year ? `&y=${year}` : ""}&apikey=${OMDB_API_KEY}`;
    const response = await fetch(url);
    const omdbData = await response.json();

    if (omdbData.Response === "False") {
      return new Response(
        JSON.stringify({ success: false, error: omdbData.Error || "Filim lama helin" }),
        { status: 404 }
      );
    }

    const newCache = await MovieCache.create({
      imdbID: omdbData.imdbID,
      title: omdbData.Title,
      year: omdbData.Year,
      genre: omdbData.Genre,
      director: omdbData.Director,
      actors: omdbData.Actors,
      plot: omdbData.Plot,
      poster: omdbData.Poster,
      imdbRating: omdbData.imdbRating,
      runtime: omdbData.Runtime,
    });

    return new Response(
      JSON.stringify({ success: true, source: "omdb", data: newCache }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Wax baa qaldamay" }),
      { status: 500 }
    );
  }
}