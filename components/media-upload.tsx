"use client";

import { FormEvent, useEffect, useState } from "react";

type MediaAsset = {
  id: string;
  name: string;
  file_type: string;
  file_size: number;
  public_url: string | null;
  tags: string[] | null;
  created_at: string;
};

function formatSize(bytes: number) {
  if (!Number.isFinite(bytes)) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaUpload({ fallbackItems }: { fallbackItems: { name: string; type: string; size: string; tag: string }[] }) {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [tag, setTag] = useState("GridSpell Asset");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadMedia() {
    const response = await fetch("/api/media");
    if (!response.ok) return;
    const result = await response.json();
    setMedia(result.media ?? []);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Choose a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tag", tag);

    const response = await fetch("/api/media", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Upload failed.");
      return;
    }

    setMessage("Media uploaded to Appwrite Storage.");
    setFile(null);
    await loadMedia();
  }

  const hasRealMedia = media.length > 0;

  return (
    <div className="stack">
      <form className="upload-panel" onSubmit={onSubmit}>
        <div className="field" style={{ margin: 0 }}>
          <label htmlFor="media-file">Upload to Appwrite Storage</label>
          <input
            className="input"
            id="media-file"
            type="file"
            accept="image/*,video/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label htmlFor="media-tag">Tag</label>
          <input className="input" id="media-tag" value={tag} onChange={(event) => setTag(event.target.value)} />
        </div>
        <button className="btn" type="submit" disabled={loading}>{loading ? "Uploading..." : "Upload media"}</button>
        {message && <p className="form-message success">{message}</p>}
        {error && <p className="form-message error">{error}</p>}
      </form>

      <div className="media-grid">
        {hasRealMedia ? media.map((item) => (
          <article className="media-card" key={item.id}>
            <div className="media-thumb real-media-thumb">
              {item.public_url && item.file_type.startsWith("image/") ? <img src={item.public_url} alt={item.name} /> : null}
            </div>
            <span className="platform-pill">{item.tags?.[0] ?? "Uploaded"}</span>
            <h3 style={{ margin: "12px 0 5px" }}>{item.name}</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>{item.file_type} · {formatSize(item.file_size)}</p>
          </article>
        )) : fallbackItems.map((item) => (
          <article className="media-card" key={item.name}>
            <div className="media-thumb" />
            <span className="platform-pill">{item.tag}</span>
            <h3 style={{ margin: "12px 0 5px" }}>{item.name}</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>{item.type} · {item.size}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
