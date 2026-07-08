export type SocialPlatformId = "instagram" | "facebook" | "linkedin" | "x" | "tiktok" | "youtube" | "pinterest";

export type PlatformMediaRequirement = "optional" | "required" | "video_required";

export type SocialPlatformDefinition = {
  id: SocialPlatformId;
  label: string;
  handleLabel: string;
  tone: string;
  oauthReady: boolean;
  mediaRequirement: PlatformMediaRequirement;
  maxCaptionLength: number;
  supportsImages: boolean;
  supportsVideo: boolean;
  supportsLinks: boolean;
  supportsCarousels: boolean;
  notes: string[];
};

export const SOCIAL_PLATFORMS: SocialPlatformDefinition[] = [
  {
    id: "instagram",
    label: "Instagram",
    handleLabel: "@gridspellstudio",
    tone: "Visual, hook-first, hashtag-friendly",
    oauthReady: false,
    mediaRequirement: "required",
    maxCaptionLength: 2200,
    supportsImages: true,
    supportsVideo: true,
    supportsLinks: false,
    supportsCarousels: true,
    notes: ["Business or Creator account required for API publishing.", "Media must be uploaded before real publishing."],
  },
  {
    id: "facebook",
    label: "Facebook",
    handleLabel: "GridSpell Studio",
    tone: "Community-focused and clear",
    oauthReady: false,
    mediaRequirement: "optional",
    maxCaptionLength: 63206,
    supportsImages: true,
    supportsVideo: true,
    supportsLinks: true,
    supportsCarousels: false,
    notes: ["Facebook Pages publishing will be connected through Meta OAuth."],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handleLabel: "GridSpell Studio",
    tone: "Professional, educational, authority-building",
    oauthReady: true,
    mediaRequirement: "optional",
    maxCaptionLength: 3000,
    supportsImages: true,
    supportsVideo: true,
    supportsLinks: true,
    supportsCarousels: false,
    notes: ["Best first real integration for GridSpell business content."],
  },
  {
    id: "x",
    label: "X",
    handleLabel: "@gridspellstudio",
    tone: "Short, punchy, thread-ready",
    oauthReady: false,
    mediaRequirement: "optional",
    maxCaptionLength: 280,
    supportsImages: true,
    supportsVideo: true,
    supportsLinks: true,
    supportsCarousels: false,
    notes: ["Longer content should become a thread in a later phase."],
  },
  {
    id: "tiktok",
    label: "TikTok",
    handleLabel: "@gridspellstudio",
    tone: "Hook-led, creator-style, fast",
    oauthReady: false,
    mediaRequirement: "video_required",
    maxCaptionLength: 2200,
    supportsImages: true,
    supportsVideo: true,
    supportsLinks: false,
    supportsCarousels: false,
    notes: ["Direct public posting often requires platform review."],
  },
  {
    id: "youtube",
    label: "YouTube",
    handleLabel: "GridSpell Studio",
    tone: "Searchable title and description focused",
    oauthReady: false,
    mediaRequirement: "video_required",
    maxCaptionLength: 5000,
    supportsImages: false,
    supportsVideo: true,
    supportsLinks: true,
    supportsCarousels: false,
    notes: ["This adapter will target Shorts/video uploads later."],
  },
  {
    id: "pinterest",
    label: "Pinterest",
    handleLabel: "GridSpell Studio",
    tone: "Searchable, visual, link-friendly",
    oauthReady: false,
    mediaRequirement: "required",
    maxCaptionLength: 500,
    supportsImages: true,
    supportsVideo: true,
    supportsLinks: true,
    supportsCarousels: false,
    notes: ["Pins work best with destination links and boards."],
  },
];

export const SOCIAL_PLATFORM_IDS = SOCIAL_PLATFORMS.map((platform) => platform.id);

export function getSocialPlatform(id: string) {
  return SOCIAL_PLATFORMS.find((platform) => platform.id === id);
}

export function isSocialPlatformId(value: string): value is SocialPlatformId {
  return SOCIAL_PLATFORM_IDS.includes(value as SocialPlatformId);
}
