import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { convertToQuery } from "@/lib/ai";
import Movie from "@/models/Movie";
import User from "@/models/User";
import Review from "@/models/Review";

const COLLECTIONS: Record<string, any> = {
  movies: Movie,
  users: User,
  reviews: Review,
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { query: userQuery } = body;

    if (!userQuery || typeof userQuery !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "'query' waa waajib oo waa inuu noqdaa qoraal" }),
        { status: 400 }
      );
    }

    const parsed = await convertToQuery(userQuery);

    const { collection, operation, query } = parsed;

    if (!COLLECTIONS[collection]) {
      return new Response(
        JSON.stringify({ success: false, error: `Collection aan la ogolayn: ${collection}` }),
        { status: 400 }
      );
    }

    const Model = COLLECTIONS[collection];

    let result;
    if (operation === "find") {
      result = await Model.find(query);
    } else if (operation === "count") {
      result = await Model.countDocuments(query);
    } else if (operation === "aggregate") {
      result = await Model.aggregate(query);
    } else {
      return new Response(
        JSON.stringify({ success: false, error: `Operation aan la ogolayn: ${operation}` }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        meta: { collection, operation, interpretedQuery: query },
        count: Array.isArray(result) ? result.length : undefined,
        data: result,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Wax baa qaldamay" }),
      { status: 500 }
    );
  }
}