import { connectDB } from '@/lib/db';
import Movie from  '../../../models/Movie';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const movies = await Movie.find();

    return NextResponse.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Wax baa qaldamay marka movies la soo qaadanayay' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const movie = await Movie.create(body);

    return NextResponse.json(
      { success: true, data: movie },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}