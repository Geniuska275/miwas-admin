import { toast } from "react-toastify";


const handleDownload = async (fileUrl, fileName) => {
 
  try {
    toast.info("downloading pdf")
    const response = await fetch(fileUrl);
    if (!response.ok) {
      toast.error("failed")
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
    toast.success("pdf downloaded")
  } catch (err) {
    console.error('Download error:', err);
    toast.error("failed")
  }
};


export default handleDownload