export const platforms = [
  { id: "instagram", label: "Instagram", handle: "@gridspellstudio", status: "Connected", tone: "Visual, sharp, hashtag-friendly" },
  { id: "facebook", label: "Facebook", handle: "GridSpell Studio", status: "Connected", tone: "Local business friendly" },
  { id: "linkedin", label: "LinkedIn", handle: "GridSpell Studio", status: "Connected", tone: "Professional, educational" },
  { id: "x", label: "X", handle: "@gridspellstudio", status: "Needs review", tone: "Short, punchy, thread-ready" },
  { id: "tiktok", label: "TikTok", handle: "@gridspellstudio", status: "Demo mode", tone: "Hook-first video caption" },
  { id: "youtube", label: "YouTube", handle: "GridSpell Studio", status: "Demo mode", tone: "Searchable title + description" },
  { id: "pinterest", label: "Pinterest", handle: "GridSpell Studio", status: "Demo mode", tone: "Visual, link-driven" },
];

export const upcomingPosts = [
  { title: "5 signs your website is losing customers", time: "Today · 10:00 AM", status: "Scheduled", platforms: ["LinkedIn", "Instagram", "Facebook"] },
  { title: "Before/after redesign carousel", time: "Today · 2:30 PM", status: "Review", platforms: ["Instagram", "Pinterest"] },
  { title: "Why fast websites convert better", time: "Tomorrow · 9:15 AM", status: "Draft", platforms: ["LinkedIn", "X"] },
  { title: "Client portal launch teaser", time: "Friday · 11:00 AM", status: "Scheduled", platforms: ["TikTok", "YouTube"] },
] as const;

export const campaigns = [
  { name: "Website Authority Sprint", goal: "Generate leads for business website packages", progress: "68%", posts: 18, status: "Active" },
  { name: "Client Portal Showcase", goal: "Show dashboard and portal capabilities", progress: "42%", posts: 12, status: "Active" },
  { name: "Local SEO Education", goal: "Attract local businesses needing visibility", progress: "25%", posts: 20, status: "Planning" },
];

export const mediaItems = [
  { name: "Dashboard hero mockup", type: "Image", size: "1920×1200", tag: "Approved" },
  { name: "Mobile preview screens", type: "Image", size: "1080×1350", tag: "Approved" },
  { name: "GridSpell logo animation", type: "Video", size: "9:16", tag: "Draft" },
  { name: "Case study cover", type: "Image", size: "1200×630", tag: "Approved" },
  { name: "Website speed reel", type: "Video", size: "9:16", tag: "Review" },
  { name: "Pricing card graphic", type: "Image", size: "1080×1080", tag: "Approved" },
  { name: "Before after carousel", type: "Image set", size: "4 slides", tag: "Draft" },
  { name: "Grid system texture", type: "Image", size: "4K", tag: "Approved" },
];

export const analyticsBars = [64, 82, 46, 72, 96, 58, 88, 66, 74, 52, 91, 80];

export const calendarPosts = [
  { day: 6, label: "LinkedIn article" },
  { day: 7, label: "IG carousel" },
  { day: 8, label: "X thread" },
  { day: 10, label: "TikTok hook" },
  { day: 13, label: "YouTube Short" },
  { day: 15, label: "Pinterest pin" },
  { day: 17, label: "Facebook post" },
  { day: 20, label: "Case study" },
  { day: 23, label: "Campaign recap" },
  { day: 27, label: "Offer post" },
];
