import { NextResponse } from "next/server";
import { searchMoviesByTitle } from "@/lib/api/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json([]);
  }

  const filmes = await searchMoviesByTitle(query);

  return NextResponse.json(filmes.slice(0, 5));
}
