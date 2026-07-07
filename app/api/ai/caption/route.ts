export const runtime = "nodejs";

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerEnv } from "@/lib/env";
import { getCurrentUserAndWorkspace } from "@/lib/workspace";

const fallbackVersions: Record<string, string> = {
  instagram: "Your website is your first impression. Make it sharp, fast, and built to convert. ✦\n\nGridSpell Studio creates premium websites and dashboards for businesses that want more than a template.\n\n#webdesign #branddesign #gridspellstudio",
  facebook: "A strong website helps people understand your business fast, trust your work, and take the next step. GridSpell Studio builds professional websites, dashboards, and client portals for modern businesses.",
  linkedin: "A business website should be treated like a product, not a brochure. The strongest sites combine clear positioning, fast performance, structured design, and a conversion path that makes the next step obvious. That is the GridSpell approach.",
  x: "Your website should do more than exist.\n\nIt should explain, build trust, and convert.\n\nGridSpell Studio builds structured digital experiences for businesses that want to look premium online.",
  tiktok: "POV: your business website finally looks as professional as your actual work. GridSpell Studio builds premium websites, dashboards, and portals that feel expensive and perform like products.",
  youtube: "Your website is more than a page — it is your digital sales system. In this short, we show why structure, speed, and clear design matter for local business growth.",
  pinterest: "Premium website design inspiration for modern businesses. Explore structured layouts, dark studio branding, conversion-focused sections, and clean digital systems by GridSpell Studio.",
};

function safeParseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export async function POST(request: Request) {
  const { user } = await getCurrentUserAndWorkspace();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const env = getServerEnv();
  const body = await request.json().catch(() => ({}));
  const topic = typeof body.topic === "string" ? body.topic : "GridSpell Studio website redesign";
  const baseCaption = typeof body.baseCaption === "string" ? body.baseCaption : "";
  const platforms = Array.isArray(body.platforms) ? body.platforms.filter((item) => typeof item === "string") : Object.keys(fallbackVersions);
  const brandVoice = typeof body.brandVoice === "string" ? body.brandVoice : "Premium, structured, clear, confident, modern GridSpell Studio tone.";

  if (!env.openaiApiKey) {
    return NextResponse.json({
      mode: "fallback",
      warning: "OPENAI_API_KEY is not set, so demo copy was returned.",
      versions: Object.fromEntries(platforms.map((platform) => [platform, fallbackVersions[platform] ?? fallbackVersions.linkedin])),
    });
  }

  const client = new OpenAI({ apiKey: env.openaiApiKey });

  const response = await client.responses.create({
    model: env.openaiModel,
    instructions: "You are GridPost AI, a professional social media strategist for GridSpell Studio. Return only valid JSON.",
    input: `Create platform-specific social captions.\n\nBrand voice: ${brandVoice}\nTopic: ${topic}\nBase caption: ${baseCaption}\nPlatforms: ${platforms.join(", ")}\n\nReturn JSON exactly like this shape: {"versions":{"instagram":"...","facebook":"..."},"hashtags":["..."],"hook":"..."}. Keep each platform version natural for that platform.`,
  });

  const parsed = safeParseJson(response.output_text);

  if (!parsed?.versions) {
    return NextResponse.json({
      mode: "openai_raw_fallback",
      versions: Object.fromEntries(platforms.map((platform) => [platform, response.output_text])),
    });
  }

  return NextResponse.json({ mode: "openai", ...parsed });
}
