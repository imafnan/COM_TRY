import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("API KEY 👉", process.env.OPENAI_API_KEY);

  const { messages } = await req.json();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
    }),
  });

  const data = await res.json();

  if (data.error) {
    return NextResponse.json({
      reply: `❌ OpenAI error: ${data.error.message}`,
    });
  }

  return NextResponse.json({
    reply: data.choices?.[0]?.message?.content || "❌ No reply",
  });
}
