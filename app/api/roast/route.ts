import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await req.json(); // read body (URL not used yet)

    return NextResponse.json({
      score: "7/10",
      good: [
        "Clear headline",
        "Strong value proposition",
      ],
      confusing: [
        "CTA could be more prominent",
      ],
      improvements: [
        "Add testimonials",
        "Clarify pricing earlier",
      ],
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
