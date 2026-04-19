async function generateContent() {
  const topic = document.getElementById("topic").value;
  const category = document.getElementById("category").value;

  const res = await fetch("http://localhost:5000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ topic, category })
  });

  const data = await res.json();

  document.getElementById("blogOutput").innerText = data.blog;
  document.getElementById("mediumOutput").innerText = data.medium;
}