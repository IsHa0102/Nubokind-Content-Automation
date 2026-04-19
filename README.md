# Nubokind Content Assistant (NCA)

An AI-powered content generation tool that creates SEO-optimized blog posts and Medium articles for the Nubokind brand using Claude (Anthropic).

## What it does

- Generates full HTML blog posts (General, Scientific, or Sales style)
- Generates Medium-style articles (Story, Science, or Soft Sales style)
- Both pieces are generated simultaneously for a given topic and category

## Tech Stack

- **Backend:** Node.js, Express
- **AI:** Anthropic Claude (claude-haiku-4-5-20251001)
- **Frontend:** Vanilla HTML/CSS/JS

## Project Structure

```
├── backend/
│   ├── server.js           # Express server and API route
│   ├── promptTemplates.js  # All Claude prompt templates
│   └── keywordMap.js       # Category → keyword mapping
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── .env                    # Local only — never commit this
```

## Local Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
```

2. Create a `.env` file in the root:

```
ANTHROPIC_API_KEY=your_api_key_here
```

3. Start the server:

```bash
npm start
```

4. Open [http://localhost:5000](http://localhost:5000)

## Deployment

Deployed on [Render](https://render.com) as a Node web service.

- **Build command:** `npm install`
- **Start command:** `node backend/server.js`
- Set `ANTHROPIC_API_KEY` as an environment variable in Render's dashboard.