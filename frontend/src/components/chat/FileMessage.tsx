import React, { useState } from "react";

// Mapping from MIME type prefix / full type → readable extension label
const mimeToExt: Record<string, string> = {
  "image/": "Image",
  "video/": "Video",
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/zip": "ZIP",
  "application/x-zip-compressed": "ZIP",
  "text/plain": "TXT",
};

export function getExtension(mimeType: string): string {
  for (const [key, label] of Object.entries(mimeToExt)) {
    if (mimeType.startsWith(key) || mimeType === key) return label;
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
  const [isDownloading, setIsDownloading] = useState(false);

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

  // Cloudinary attachment URL for direct force-download fallback
  const attachmentUrl = fileUrl.includes("/upload/")
    ? fileUrl.replace("/upload/", "/upload/fl_attachment/")
    : fileUrl;

  // PDFs and all other files → force-download via Fetch and Blob URL
  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);
    
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to fetch file");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || `download.${getExtension(fileType).toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed, falling back to direct attachment URL:", error);
      // Fallback: trigger Cloudinary force-download URL in new window/tab
      window.open(attachmentUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <a
      href={attachmentUrl}
      onClick={handleDownload}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#030303] border border-[#27272A] hover:border-[#34D399]/40 text-xs font-mono text-white transition-all ${
        isDownloading ? "opacity-50 cursor-wait" : ""
      }`}
    >
      <span className="text-[#34D399]">📎</span>
      <span className="truncate max-w-[200px]">
        {isDownloading ? "Downloading..." : (fileName ?? `Download ${getExtension(fileType)}`)}
      </span>
    </a>
  );
}
