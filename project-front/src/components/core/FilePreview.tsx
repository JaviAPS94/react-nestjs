import { useState, useEffect } from "react";
import { FiFileText, FiAlertCircle, FiDownload } from "react-icons/fi";
import mammoth from "mammoth";

type FilePreviewProps = {
  file: File;
  className?: string;
  inModal?: boolean;
};

export function FilePreview({
  file,
  className = "",
  inModal = false,
}: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setHtmlContent(null);

    // For images, create a data URL
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        setLoading(false);
      };
      reader.onerror = () => {
        setError("No se pudo cargar la vista previa de la imagen");
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
    // For PDFs, create a blob URL
    else if (file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setLoading(false);

      // Clean up the URL when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    // For DOCX, convert to HTML using mammoth.js
    else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;

          // Convert DOCX to HTML
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setHtmlContent(result.value);
          setLoading(false);
        } catch (err) {
          setError("No se pudo convertir el archivo DOCX para la vista previa");
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError("No se pudo leer el archivo DOCX");
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);

      // Also create a blob URL for download option
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);

      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    } else {
      setError("Vista previa no disponible para este tipo de archivo");
      setLoading(false);
    }
  }, [file]);

  // Height classes based on whether in modal or not
  const heightClass = inModal ? "h-[70vh]" : "h-64";

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center ${heightClass} bg-gray-100 rounded-md ${className}`}
      >
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Cargando vista previa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center ${heightClass} bg-gray-100 rounded-md ${className}`}
      >
        <div className="text-center text-red-500">
          <FiAlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!previewUrl && !htmlContent) {
    return (
      <div
        className={`flex items-center justify-center ${heightClass} bg-gray-100 rounded-md ${className}`}
      >
        <div className="text-center text-gray-500">
          <FiFileText className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No hay vista previa disponible</p>
        </div>
      </div>
    );
  }

  // Render based on file type
  if (file.type.startsWith("image/")) {
    return (
      <div className={`bg-gray-100 rounded-md overflow-hidden ${className}`}>
        <img
          src={previewUrl || "/placeholder.svg"}
          alt="Preview"
          className={`max-w-full mx-auto object-contain ${
            inModal ? "max-h-[70vh]" : "max-h-64"
          }`}
        />
      </div>
    );
  }

  if (file.type === "application/pdf") {
    return (
      <div
        className={`bg-gray-100 rounded-md overflow-hidden ${
          inModal ? "h-[70vh]" : "h-64"
        } ${className}`}
      >
        <iframe
          src={`${previewUrl}#view=FitH`}
          className="w-full h-full border-0"
          title="PDF Preview"
        />
      </div>
    );
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return (
      <div className={`bg-gray-100 rounded-md overflow-hidden ${className}`}>
        {htmlContent ? (
          <div className="p-4">
            <div
              className={`bg-white p-6 rounded shadow-sm ${
                inModal ? "max-h-[60vh]" : "max-h-64"
              } overflow-auto`}
            >
              <div
                className="docx-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
            {previewUrl && (
              <div className="mt-4 text-center">
                <a
                  href={previewUrl}
                  download={file.name}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  <FiDownload className="h-4 w-4" />
                  Descargar original
                </a>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex items-center justify-center ${
              inModal ? "h-[70vh]" : "h-64"
            }`}
          >
            <div className="text-center text-gray-500">
              <FiFileText className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">
                No se puede obtener una vista previa del contenido DOCX
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${heightClass} bg-gray-100 rounded-md ${className}`}
    >
      <div className="text-center text-gray-500">
        <FiFileText className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">
          Vista previa no disponible para este tipo de archivo
        </p>
      </div>
    </div>
  );
}
