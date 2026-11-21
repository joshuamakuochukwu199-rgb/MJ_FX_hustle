export async function onRequestPost({ request, env }) {
  try {
    if (!env.GEMINI_API_KEY) {
      return json({ error: "Server setup is incomplete: GEMINI_API_KEY is not configured." }, 500);
    }

    const body = await request.json();
    if (!Array.isArray(body.images) || body.images.length < 1 || body.images.length > 5) {
      return json({ error: "Upload between 1 and 5 screenshots." }, 400);
    }

    const parts = [{
      text: `You are MJ FX Hustle, an educational chart-reading assistant.
Review all supplied screenshots together, but do not assume they show the same instrument or timeframe.
For each image, report only what is visibly supported:
- Market/instrument symbol and timeframe, and chart date/time if legible. If not visible, say "not readable".
- Visible trend/structure observations and possible BOS, CHOCH, HH, HL, LH, LL. Mark uncertain interpretations as tentative.
- Possible buy-side/sell-side liquidity, equal highs/lows, and possible liquidity sweeps.
- Possible bullish/bearish order blocks and fair value gaps.
- Visible support/resistance areas as approximate prices only when the price scale is readable.
- Whether premium/discount can be assessed from a clearly visible dealing range.
- Whether EMA 50/200, MACD, RSI, or Volume Profile (POC, VAH, VAL) are actually visible; describe only what can be read.
- Conflicts between screenshots, missing context, and image-quality limitations.

Do not produce a buy/sell/hold decision, trade direction recommendation, entry price, stop-loss, take-profit, risk/reward target, or instruction to place a trade. Do not invent exact prices or indicator values. Explain that screenshots are static and do not establish live market conditions. End with a short checklist of what the learner should verify on the original chart.

Use clear headings and plain language. Treat this as chart-reading education, not financial advice.`
    }];

    for (const image of body.images) {
      if (!image || !["image/jpeg", "image/png", "image/webp"].includes(image.mimeType) ||
          typeof image.data !== "string" || image.data.length > 7_000_000) {
        return json({ error: "An image is invalid or too large. Try smaller screenshots." }, 400);
      }
      parts.push({ inline_data: { mime_type: image.mimeType, data: image.data } });
    }

    const apiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        encodeURIComponent(env.GEMINI_API_KEY),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 3500 }
        })
      }
    );

    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return json({ error: result?.error?.message || "The AI service could not process the screenshots." }, 502);
    }
    const analysis = (result.candidates?.[0]?.content?.parts || [])
      .map(part => part.text || "").join("\n").trim();
    if (!analysis) return json({ error: "The AI service returned no readable chart notes." }, 502);
    return json({ analysis });
  } catch (error) {
    return json({ error: "Request failed. Check your connection and try again." }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}