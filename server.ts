import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial body parsing middleware
  app.use(express.json());

  // Keep-alive/health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Fractional CFO AI advisor proxy using Google Gen AI SDK
  app.post("/api/advisor/summary", async (req, res: any) => {
    try {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(400).json({
          error: "Missing GEMINI_API_KEY",
          message: "A GEMINI_API_KEY secret is required on the server to run custom AI analysis. Please configure it in your Secrets panel in the Google AI Studio settings.",
        });
      }

      const { transactions, customPrompt } = req.body;
      if (!transactions || !Array.isArray(transactions)) {
        return res.status(400).json({
          error: "Invalid input",
          message: "Request must include an array of transactions in the body.",
        });
      }

      // Initialize Google Gen AI client lazily
      const ai = new GoogleGenAI({ apiKey: key });

      // Generate a comprehensive, premium analysis
      let prompt = `You are an elite, highly experienced Fractional CFO and business advisor.
Analyze the following financial transactions for Zyncast, a small business, and write a professional, highly strategic response.

Current Transactions Data:
${JSON.stringify(transactions, null, 2)}
`;

      if (customPrompt) {
        prompt += `
The business owner has asked the following specific CFO query:
"${customPrompt}"

Please address this query directly, providing computed figures, logical estimates, and clear actionable steps based on the transactions data. Use markdown formatting for headings and lists. Keep the tone expert, supportive, objective, and extremely precise.`;
      } else {
        prompt += `
Structure your response with:
1. **Executive Summary**: A concise, polished paragraph outlining the financial health, key strengths, and overall trajectory.
2. **Key Strategic Recommendations**: 3 clear bullet points focusing on cost reduction, growth scaling, tax planning, or capital allocation. Include specific figures or percentages based on the data.
3. **Cash Runway & Capital Health**: A quick sentence about their runway and safety margin.

Keep the tone expert, supportive, objective, and extremely precise. Use markdown for headings and bullet points. Do not mention system-internal terms or file names.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({
        error: "Gemini API call failed",
        message: err.message || "An error occurred while calling the Gemini model.",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
