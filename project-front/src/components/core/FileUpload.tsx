"use client";

import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  FiUpload,
  FiX,
  FiFile,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiPaperclip,
} from "react-icons/fi";
import classnames from "classnames";
import { Modal } from "./Modal";
import { FilePreview } from "./FilePreview";

export type FileUploadHandle = {
  clearFile: () => void;
};

type FileUploadProps = {
  onFileUpload?: (file: File) => Promise<void>;
  onFileSelect?: (file: File | null) => void;
  showUploadButton?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  existingFileUrl?: string;
  existingFileName?: string;
  onExistingFileRemoved?: () => void;
  initialFile?: File | null;
  disabled?: boolean;
};

type UploadStatus = "idle" | "uploading" | "success" | "error";

export const FileUpload = forwardRef<FileUploadHandle, FileUploadProps>(
  function FileUpload(
    {
      onFileUpload,
      onFileSelect,
      showUploadButton = false,
      accept = "image/*,application/pdf,.docx",
      maxSize = 5 * 1024 * 1024, // 5MB default
      className,
      existingFileUrl,
      existingFileName,
      onExistingFileRemoved,
      initialFile,
      disabled,
    },
    ref
  ) {
    const [file, setFile] = useState<File | null>(initialFile || null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [hasExistingFile, setHasExistingFile] = useState(
      !!existingFileUrl && !initialFile
    );

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle existing file URL changes
    useEffect(() => {
      if (!file) {
        setHasExistingFile(!!existingFileUrl);
      }
    }, [existingFileUrl, file]);

    // Handle initial file changes
    useEffect(() => {
      if (initialFile) {
        processInitialFile(initialFile);
      }
    }, [initialFile]);

    // Process initial file
    const processInitialFile = (fileToProcess: File) => {
      // Check file size
      if (fileToProcess.size > maxSize) {
        setErrorMessage(
          `El archivo es demasiado grande. El tamaño máximo es ${
            maxSize / (1024 * 1024)
          }MB.`
        );
        return;
      }

      setFile(fileToProcess);
      setHasExistingFile(false);

      // Notify parent component about file selection
      if (onFileSelect) {
        onFileSelect(fileToProcess);
      }

      // Create preview for images
      if (fileToProcess.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(fileToProcess);
      } else {
        setPreview(null);
      }
    };

    // Expose the clearFile method to parent components
    useImperativeHandle(ref, () => ({
      clearFile: () => {
        clearFile();
      },
    }));

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      processFile(selectedFile);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files?.[0];
      processFile(droppedFile);
    };

    const processFile = (selectedFile?: File) => {
      if (!selectedFile) return;

      // Check file size
      if (selectedFile.size > maxSize) {
        setErrorMessage(
          `El archivo es demasiado grande. El tamaño máximo es ${
            maxSize / (1024 * 1024)
          }MB.`
        );
        return;
      }

      // Reset states
      setErrorMessage(null);
      setFile(selectedFile);
      setUploadStatus("idle");
      setIsPreviewModalOpen(false);
      setHasExistingFile(false);

      // Notify parent component about file selection
      if (onFileSelect) {
        onFileSelect(selectedFile);
      }

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    };

    const handleUpload = async () => {
      if (!file || !onFileUpload) return;

      try {
        setUploadStatus("uploading");

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + 10;
            if (newProgress >= 100) {
              clearInterval(progressInterval);
            }
            return newProgress < 100 ? newProgress : 100;
          });
        }, 300);

        await onFileUpload(file);

        clearInterval(progressInterval);
        setProgress(100);
        setUploadStatus("success");
      } catch {
        setUploadStatus("error");
        setErrorMessage("No se pudo cargar el archivo. Inténtalo de nuevo.");
      }
    };

    const clearFile = () => {
      setFile(null);
      setPreview(null);
      setProgress(0);
      setUploadStatus("idle");
      setErrorMessage(null);
      setIsPreviewModalOpen(false);
      setHasExistingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Notify parent component that file has been cleared
      if (onFileSelect) {
        onFileSelect(null);
      }
      // Notify parent that existing file was removed
      if (hasExistingFile && onExistingFileRemoved) {
        onExistingFileRemoved();
      }
    };

    const openPreviewModal = () => {
      setIsPreviewModalOpen(true);
    };

    const closePreviewModal = () => {
      setIsPreviewModalOpen(false);
    };

    // Determine if we can preview the file (either new upload or existing file)
    const canPreview =
      (file &&
        (file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type.startsWith("image/"))) ||
      (hasExistingFile &&
        existingFileUrl &&
        (existingFileUrl.endsWith(".pdf") ||
          existingFileUrl.endsWith(".docx") ||
          existingFileUrl.endsWith(".jpg") ||
          existingFileUrl.endsWith(".jpeg") ||
          existingFileUrl.endsWith(".png") ||
          existingFileUrl.endsWith(".gif")));

    // Get file name to display
    const displayFileName = file
      ? file.name
      : existingFileName || existingFileUrl?.split("/").pop() || "File";

    // Get file extension for icon display
    const getFileExtension = () => {
      if (file) return file.name.split(".").pop()?.toLowerCase();
      if (existingFileUrl)
        return existingFileUrl.split(".").pop()?.toLowerCase();
      return "";
    };

    const fileExt = getFileExtension();
    const isImage = file
      ? file.type.startsWith("image/")
      : ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt || "");
    const isPdf = file ? file.type === "application/pdf" : fileExt === "pdf";

    return (
      <div className={classnames("w-full mx-auto", className)}>
        {!file && !hasExistingFile ? (
          <div
            className={classnames(
              "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
              {
                "border-blue-500 bg-blue-50": isDragging,
                "border-gray-300 hover:border-blue-300 hover:bg-gray-50":
                  !isDragging,
              }
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={accept}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FiUpload className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-medium text-lg">Subir un archivo</h3>
              <p className="text-sm text-gray-500">
                Arrastre y suelte o haga clic para explorar
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Formatos aceptados: {accept.replace(/,/g, ", ")}
              </p>
              <p className="text-xs text-gray-500">
                Tamaño máximo: {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Archivo seleccionado</h3>
              <div className="flex items-center">
                {canPreview && (
                  <button
                    onClick={openPreviewModal}
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 mr-1"
                    title="Preview file"
                  >
                    <FiEye className="h-4 w-4" />
                  </button>
                )}
                {!disabled && (
                  <button
                    onClick={clearFile}
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                    title="Remove file"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Show preview for new image uploads */}
            {preview ? (
              <div className="relative aspect-video mb-4 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="File preview"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : hasExistingFile && isImage && existingFileUrl ? (
              <div className="relative aspect-video mb-4 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={existingFileUrl || "/placeholder.svg"}
                  alt="File preview"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 mb-4 bg-gray-100 rounded-md">
                {hasExistingFile ? (
                  <FiPaperclip className="h-8 w-8 text-blue-500" />
                ) : (
                  <FiFile className="h-8 w-8 text-blue-500" />
                )}
                <div className="overflow-hidden">
                  <p className="font-medium truncate">{displayFileName}</p>
                  {file && (
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                  {hasExistingFile && (
                    <p className="text-xs text-gray-500">Archivo existente</p>
                  )}
                </div>
              </div>
            )}

            {uploadStatus === "idle" &&
              showUploadButton &&
              onFileUpload &&
              file && (
                <button
                  onClick={handleUpload}
                  className="w-full py-2 px-4 rounded-md font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  Cargar archivo
                </button>
              )}

            {uploadStatus === "uploading" && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-gray-500">
                  Subiendo... {progress}%
                </p>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600 p-2 bg-green-50 rounded">
                <FiCheckCircle className="h-5 w-5" />
                <p className="text-sm font-medium">
                  ¡Archivo cargado exitosamente!
                </p>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600 p-2 bg-red-50 rounded">
                <FiAlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Preview Modal */}
            <Modal
              isOpen={isPreviewModalOpen}
              onClose={closePreviewModal}
              title={displayFileName}
              size="full"
            >
              {file ? (
                <FilePreview file={file} inModal={true} />
              ) : hasExistingFile && existingFileUrl ? (
                <div className="h-[70vh] bg-gray-100 rounded-md overflow-hidden">
                  {isPdf ? (
                    <iframe
                      src={`${existingFileUrl}#view=FitH`}
                      className="w-full h-full border-0"
                      title="PDF Preview"
                    />
                  ) : isImage ? (
                    <div className="flex items-center justify-center h-full">
                      <img
                        src={existingFileUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <FiFile className="h-16 w-16 text-blue-500 mb-4" />
                      <p className="text-lg font-medium mb-2">
                        {displayFileName}
                      </p>
                      <a
                        href={existingFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Abrir archivo
                      </a>
                    </div>
                  )}
                </div>
              ) : null}
            </Modal>
          </div>
        )}

        {errorMessage && !file && !hasExistingFile && (
          <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
        )}
      </div>
    );
  }
);
