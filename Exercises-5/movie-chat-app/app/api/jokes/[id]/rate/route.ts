import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Joke from "@/models/Joke";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { action } = body; 

    if (action !== "upvote" && action !== "downvote") {
      return new Response(
        JSON.stringify({ success: false, error: "'action' waa inuu noqdaa 'upvote' ama 'downvote'" }),
        { status: 400 }
      );
    }

    const updateField = action === "upvote" ? "upvotes" : "downvotes";

    const joke = await Joke.findByIdAndUpdate(
      id,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!joke) {
      return new Response(
        JSON.stringify({ success: false, error: "Joke lama helin" }),
        { status: 404 }
      );
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