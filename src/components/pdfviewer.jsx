export default function PdfViewer({ url }) {
  const pdfUrl = `/api/pdf/${url}`;

  return (
    <iframe
      src={pdfUrl}
      title="PDF Viewer"
      width="100%"
      height="600px"
      style={{ border: 'none' }}
    />
  );
}

