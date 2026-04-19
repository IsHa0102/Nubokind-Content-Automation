import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  try {
    const res = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 8000,
      messages: [{ role: "user", content: "Write a very long essay about teething toys, at least 3000 words. Keep going until you finish." }]
    });
    console.log("STOP REASON:", res.stop_reason);
    console.log("TEXT LENGTH:", res.content[0].text.length);
    console.log("LAST 100 CHARS:", res.content[0].text.substring(res.content[0].text.length - 100));
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
