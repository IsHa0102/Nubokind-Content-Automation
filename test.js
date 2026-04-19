async function test() {
  const res = await fetch("http://localhost:5000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: "teething toys", category: "all_teethers", blogType: "sales", mediumType: "story" })
  });
  const data = await res.json();
  console.log("BLOG:", data.blog.substring(data.blog.length - 200));
  console.log("BLOG LENGTH:", data.blog.length);
  console.log("MEDIUM:", data.medium.substring(data.medium.length - 200));
  console.log("MEDIUM LENGTH:", data.medium.length);
}
test();
