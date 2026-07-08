import { getSocialPlatform, type SocialPlatformId } from "./platforms";

export type PostMediaSummary = {
  type?: string;
  size?: number;
  url?: string;
};

export type PlatformValidationResult = {
  platform: SocialPlatformId;
  ok: boolean;
  blocking: string[];
  warnings: string[];
};

export type PlatformPostInput = {
  platform: string;
  caption: string;
  media?: PostMediaSummary[];
  link?: string;
  hasConnectedAccount?: boolean;
};

function hasAnyMedia(media: PostMediaSummary[] = []) {
  return media.length > 0;
}

function hasVideo(media: PostMediaSummary[] = []) {
  return media.some((item) => item.type?.toLowerCase().startsWith("video"));
}

export function validatePlatformPost(input: PlatformPostInput): PlatformValidationResult {
  const definition = getSocialPlatform(input.platform);

  if (!definition) {
    return {
      platform: input.platform as SocialPlatformId,
      ok: false,
      blocking: [`${input.platform} is not a supported platform.`],
      warnings: [],
    };
  }

  const caption = input.caption.trim();
  const media = input.media ?? [];
  const blocking: string[] = [];
  const warnings: string[] = [];

  if (!caption) {
    blocking.push("Caption is required.");
  }

  if (caption.length > definition.maxCaptionLength) {
    blocking.push(`${definition.label} caption is ${caption.length} characters. Keep it under ${definition.maxCaptionLength}.`);
  }

  if (definition.mediaRequirement === "required" && !hasAnyMedia(media)) {
    warnings.push(`${definition.label} usually requires media for real publishing. Add media before connecting the live API.`);
  }

  if (definition.mediaRequirement === "video_required" && !hasVideo(media)) {
    warnings.push(`${definition.label} is video-first. Add a video before live publishing.`);
  }

  if (!input.hasConnectedAccount) {
    warnings.push(`${definition.label} is not connected yet. This will demo-publish until OAuth is added.`);
  }

  if (definition.id === "x" && caption.length > 240) {
    warnings.push("X is close to the character limit. Consider shortening or turning it into a thread later.");
  }

  if (definition.id === "linkedin" && caption.length < 80) {
    warnings.push("LinkedIn usually performs better with a little more context or business insight.");
  }

  return {
    platform: definition.id,
    ok: blocking.length === 0,
    blocking,
    warnings,
  };
}

export function validatePostForPlatforms(inputs: PlatformPostInput[]) {
  const results = inputs.map(validatePlatformPost);

  return {
    ok: results.every((result) => result.ok),
    results,
    blocking: results.flatMap((result) => result.blocking.map((message) => `${result.platform}: ${message}`)),
    warnings: results.flatMap((result) => result.warnings.map((message) => `${result.platform}: ${message}`)),
  };
}
