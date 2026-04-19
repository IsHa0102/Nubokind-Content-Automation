import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

async function testDirect() {
  const blogPrompt = "Write a 3000 word essay about teething toys. Include 5 H2 sections, 2 tables, 5 FAQs, product cards, etc.";
  const res = await fetch("https://api.vestauth.com/v1/messages", { // or api.anthropic.com
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 8000,
      messages: [{ role: "user", content: blogPrompt }]
    })
  });
  const data = await res.json();
  console.log("RESPONSE:", data);
}
testDirect();
