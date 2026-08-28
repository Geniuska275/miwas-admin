const handleDownload = async (fileUrl, fileName) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download error:', err);
  }
};


export default handleDownload