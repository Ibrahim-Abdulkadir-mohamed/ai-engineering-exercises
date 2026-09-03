import User from "@/models/User";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";


export async function GET() {
    try {
        await connectDB();
        const users = await User.find();
        return new Response(JSON.stringify({ success: true, count: users.length, data: users }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Wax baa qaldamay marka users la soo qaadanayay" }), { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const user = await User.create(body);
        return new Response(JSON.stringify({ success: true, data: user }), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
    }
}