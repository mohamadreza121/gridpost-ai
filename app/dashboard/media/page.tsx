import { PageTitle, Panel } from "@/components/ui";
import { MediaUpload } from "@/components/media-upload";
import { mediaItems } from "@/lib/mock-data";

export default function MediaPage() {
  return (
    <>
      <PageTitle
        eyebrow="Asset library"
        title="Media built for every channel"
        description="Upload reusable visuals, videos, case-study covers, social graphics, and brand assets into Appwrite Storage."
        action={<span className="status-pill status-posted"><span className="status-dot" />Storage ready</span>}
      />
      <Panel title="Approved and draft assets" hint="Real uploads save to the Appwrite Storage bucket and media_assets table. Demo assets show until you upload files.">
        <MediaUpload fallbackItems={mediaItems} />
      </Panel>
    </>
  );
}
