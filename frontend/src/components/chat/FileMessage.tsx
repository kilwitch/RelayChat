import React from "react";

// Map common MIME types to file extensions
const mimeToExt: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "video/mp4": ".mp4",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

function getExtension(fileType: string): string {
  return mimeToExt[fileType] ?? "";
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
  // If it's an image, render it directly
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

  // For PDFs and other files, fetch as blob to force download
  // (the HTML download attribute is ignored on cross-origin URLs like Cloudinary)
  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      // Re-create blob with correct MIME type so the OS can open it
      const typedBlob = new Blob([blob], { type: fileType });
      const blobUrl = URL.createObjectURL(typedBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      // Build a proper filename with extension
      const ext = getExtension(fileType);
      link.download = fileName ?? `download${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 underline text-sm hover:opacity-80 transition-opacity"
    >
      📎 {fileName ?? `Download file (${getExtension(fileType) || fileType})`}
    </button>
  );
}
