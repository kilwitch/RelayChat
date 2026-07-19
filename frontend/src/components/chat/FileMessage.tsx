import React from "react";

// Mapping from MIME type prefix → readable extension label
const mimeToExt: Record<string, string> = {
  "image/": "Image",
  "video/": "Video",
  "application/pdf": "PDF",
};

export function getExtension(mimeType: string): string {
  for (const [key, label] of Object.entries(mimeToExt)) {
    if (mimeType.startsWith(key)) return label;
  }
  return "File";
}

export default function FileMessage({
  fileUrl,
  fileType,
  fileName,
}: {
  fileUrl: string;
  fileType: string;
  fileName?: string;
}) {
  // Render images inline
  if (fileType.startsWith("image/")) {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={fileUrl}
          alt="shared image"
          className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
        />
      </a>
    );
  }

  // Render video inline
  if (fileType.startsWith("video/")) {
    return (
      <video
        src={fileUrl}
        controls
        className="max-w-xs rounded-lg"
      />
    );
  }

  // PDFs and all other files → download link
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="flex items-center gap-2 underline text-sm"
    >
      📎 {fileName ?? `Download ${getExtension(fileType)}`}
    </a>
  );
}
