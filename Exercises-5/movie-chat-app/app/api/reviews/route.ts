import Review from "@/models/Review";

export async function GET() {
    try {
        const reviews = await Review.find().populate("movie", "title").populate("user", "name email");
        return new Response(JSON.stringify({ success: true, count: reviews.length, data: reviews }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Wax baa qaldamay marka reviews la soo qaadanayay" }), { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const review = await Review.create(body);
        return new Response(JSON.stringify({ success: true, data: review }), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
    }
}