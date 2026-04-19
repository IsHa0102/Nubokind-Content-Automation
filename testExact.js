import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { blogSalesPrompt } from "./backend/promptTemplates.js";
import keywordMap from "./backend/keywordMap.js";
dotenv.config();

async function test() {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  try {
    const topic = "teething toys";
    const category = "all_teethers";
    const keywords = keywordMap[category];
    const prompt = blogSalesPrompt(topic, keywords, "https://nubokind.com");

    const res = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }]
    });
    console.log("STOP REASON:", res.stop_reason);
    console.log("TEXT LENGTH:", res.content[0].text.length);
    console.log("LAST 100 CHARS:", res.content[0].text.substring(res.content[0].text.length - 100));
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
