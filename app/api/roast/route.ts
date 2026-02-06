import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "RevRoast"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a brutally honest SaaS copy expert."
          },
          {
            role: "user",
            content: `Roast the landing page of this SaaS: ${url}.
Give:
1. Score out of 100
2. What's good
3. What's confusing
4. Clear improvements`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    return NextResponse.json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    return NextResponse.json(
      { error: "AI roast failed" },
      { status: 500 }
    );
  }
}
