import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const IdentifyInput = z.object({
  imageBase64: z.string().min(50).max(8_000_000),
  mimeType: z.string().regex(/^image\//),
});

export const identifyPlant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => IdentifyInput.parse(input))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY missing");

    const { generateText } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-2.5-flash");

    const prompt = `You are a botanist specializing in Himalayan flora. Identify the plant in the image.
Return ONLY a compact JSON object with keys: species (Latin binomial), common_name, confidence (one of: low, medium, high), note (one sentence about conservation status or medicinal use if applicable). No prose, no markdown.`;

    const { text } = await generateText({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image",
              image: `data:${data.mimeType};base64,${data.imageBase64}`,
            } as never,
          ],
        },
      ],
    });

    // Parse JSON tolerantly
    let parsed: { species?: string; common_name?: string; confidence?: string; note?: string } = {};
    try {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    } catch {
      parsed = { note: text.slice(0, 300) };
    }

    // Save to history (don't store the image itself for now — just the result)
    const { supabase, userId } = context;
    await supabase.from("plant_identifications").insert({
      user_id: userId,
      species: parsed.species ?? null,
      confidence: parsed.confidence ?? null,
      note: parsed.note ?? null,
    });

    return parsed;
  });
