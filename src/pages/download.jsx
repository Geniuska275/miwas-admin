import React from 'react';

// Generic download handler - works for any image URL
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
  }
}

// Single downloadable image component
function DownloadableImage({ file, baseUrl }) {
    console.log(file,baseUrl)
  if (!file) return null;

  const src = baseUrl + file.path;
  console.log("src:",src)

  const handleDownload = (e) => {
    e.stopPropagation();
    downloadImage(src, file.originalName);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={src}
        alt={file.originalName}
        style={{ maxWidth: '250px', display: 'block', borderRadius: 8 }}
      />
      <button
        onClick={handleDownload}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '6px 10px',
          cursor: 'pointer',
          fontSize: 12,
        }}
      >
        Download
      </button>
    </div>
  );
}

// Example usage rendering file, file2, file3 from your object
function ImageGallery({ record, baseUrl = 'http://localhost:5000' }) {
  const files = [record.file, record.file2, record.file3].filter(Boolean);

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {files.map((file, i) => (
        <DownloadableImage key={file.fileName || i} file={file} baseUrl={baseUrl} />
      ))}
    </div>
  );
}

export default ImageGallery;
export { DownloadableImage, downloadImage };