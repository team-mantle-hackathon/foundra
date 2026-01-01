import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `
You are a professional real estate investment risk assessment engine.

Your task is to evaluate a real estate project based on the provided documents
and produce a CONSISTENT, EXPLAINABLE risk grading and numeric risk score.

You MUST follow the rules below.

––––––––––––––––––––
RISK DIMENSIONS (score each 0–100):
1. Legal Risk
   - land ownership clarity
   - permits & zoning
   - disputes / litigation
2. Financial Risk
   - budget realism
   - funding gap
   - cost breakdown clarity
3. Operational Risk
   - construction timeline realism
   - contractor credibility
   - execution complexity
4. Market Risk
   - location demand
   - comparable pricing
   - exit liquidity
5. Documentation Completeness
   - missing or unclear documents
   - inconsistency between documents

––––––––––––––––––––
SCORING RULES:
- Each dimension MUST be scored 0–100
- Final riskScore = AVERAGE of all dimensions (rounded to nearest integer)
- Higher score = LOWER risk (100 = very safe, 0 = extremely risky)

––––––––––––––––––––
RISK GRADE RULES:
- A = riskScore ≥ 80
- B = 65–79
- C = 45–64
- D = < 45

––––––––––––––––––––
MISSING DOCUMENTS:
- If any critical document is missing, list it clearly
- Missing documents MUST reduce Documentation Completeness score
- If core legal, permit, and site feasibility documents are complete and verified,
lack of market or financial projections should reduce confidence moderately,
not severely.

––––––––––––––––––––
OUTPUT FORMAT:
Return ONLY valid JSON, no markdown, no explanation text.

{
  "riskGrade": "A|B|C|D",
  "riskScore": number,
  "dimensionScores": {
    "legal": number,
    "financial": number,
    "operational": number,
    "market": number,
    "documentation": number
  },
  "keyRisks": string[],
  "missingDocs": string[]
}
`.trim();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      throw new Error("POST only");
    }

    const body = await req.json();
    const documents = body?.documents;

    if (!Array.isArray(documents) || documents.length === 0) {
      throw new Error("documents[] required");
    }

    // Build user prompt
    const userPrompt = documents
      .map((d: any) => {
        const name = d?.name ?? "unknown";
        const text = typeof d?.text === "string" ? d.text : "";
        return `DOCUMENT: ${name}\nCONTENT:\n${text}`;
      })
      .join("\n\n---\n\n");

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("GROQ_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          temperature: 0.2,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Groq error: ${t}`);
    }

    const json = await res.json();
    const raw = json?.choices?.[0]?.message?.content;

    if (typeof raw !== "string") {
      throw new Error("Invalid Groq response");
    }

    // Strict JSON parse
    const result = JSON.parse(raw.trim());

    // Minimal sanity checks (anti halu)
    const ds = result.dimensionScores || {};
    const avg =
      Math.round(
        (
          Number(ds.legal ?? 0) +
          Number(ds.financial ?? 0) +
          Number(ds.operational ?? 0) +
          Number(ds.market ?? 0) +
          Number(ds.documentation ?? 0)
        ) / 5
      );

    // Enforce consistency
    result.riskScore = avg;
    if (avg >= 80) result.riskGrade = "A";
    else if (avg >= 65) result.riskGrade = "B";
    else if (avg >= 45) result.riskGrade = "C";
    else result.riskGrade = "D";

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
