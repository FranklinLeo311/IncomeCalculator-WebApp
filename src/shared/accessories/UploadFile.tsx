import { TrashCan, Upload } from "@carbon/icons-react";
import { Loading } from "@carbon/react";
import { useState, useRef, useMemo } from "react";
import { formatBytes } from "../utils/formatFunctions";

interface FileUploadProps {
  handleChange: (file: File | null) => void;
  onFileRemove?: () => void;
  formats?: string;
  disabled?: boolean;
  maxSizeMB?: number;
  error?: string | null;
  title?: string;
  helperText?: string;
  className?: string;
  uploadDelay?: number;
  name: string;
}

const FileUpload = ({
  handleChange,
  onFileRemove,
  formats = "*",
  disabled = false,
  maxSizeMB,
  error = null,
  title = "Click or drag & drop to upload",
  helperText,
  className = "",
  name,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState("");
  const [internalError, setInternalError] = useState<string | null>(null);

  const displayError = useMemo(() => {
      return internalError || error;
    }, [internalError, error]),
    isUploading = useMemo(
      () => processingStatus === "uploading",
      [processingStatus]
    );

  const validateFile = (file: File): string | null => {
    if (formats !== "*" && inputRef.current?.accept) {
      const acceptedTypes = inputRef.current.accept.split(",");
      const isValid = acceptedTypes.some((type) => {
        const trimmed = type.trim();
        return (
          file.type === trimmed ||
          (trimmed.endsWith("/*") &&
            file.type.startsWith(trimmed.replace("/*", "")))
        );
      });

      if (!isValid) return `File type ${file.type} is not supported.`;
    }

    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxSizeMB}MB limit.`;
    }

    return null;
  };

  const processFile = async (file: File) => {
    setInternalError(null);
    setProcessingStatus("uploading");

    const validationError = validateFile(file);
    if (validationError) {
      setInternalError(validationError);
      setProcessingStatus("");
      return;
    }

    setUploadedFile(file);
    handleChange({ name, value: file } as any);

    setProcessingStatus("uploaded");

    // Optional delay (simulate network or processing delay)
    // if (uploadDelay) await new Promise((res) => setTimeout(res, uploadDelay));
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setInternalError("No file selected.");
      e.target.value = "";
      return;
    }

    processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (disabled || uploadedFile) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) {
      setInternalError("No file was dropped.");
      return;
    }

    processFile(file);
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setInternalError(null);
    setProcessingStatus("");
    handleChange(null);
    onFileRemove?.();
  };

  return (
    <div className={`mb-2 ${className}`}>
      <label
        htmlFor={name}
        onDrop={handleDrop}
        onDragOver={(e) => {
          if (!disabled) e.preventDefault();
        }}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
        className={`relative flex flex-col items-center gap-y-1 justify-center rounded-md p-3 transition-all border cursor-pointer bg-[var(--cds-field)] ${
          disabled
            ? "border-[var(--rl-gray-border)] cursor-not-allowed opacity-60"
            : displayError
            ? "border-[var(--rl-red)] border-2 border-dashed"
            : "border-[var(--rl-gray-border)] "
        }`}
      >
        <p
          className={`${
            displayError ? "text-[var(--rl-red)]" : "text-gray-600"
          } text-sm`}
        >
          {title}
        </p>

        {helperText && (
          <p className="text-[var(--rl-blue)] text-[10px] w-fit">
            {helperText}
          </p>
        )}

        {displayError && (
          <div className="text-[var(--rl-red)] text-[10px] mb-1">
            {displayError}
          </div>
        )}

        <input
          ref={inputRef}
          id={name}
          name={name}
          type="file"
          className="hidden"
          accept={formats}
          onChange={onInputChange}
          disabled={disabled}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="bg-gray-100 px-4 py-1  overflow-hidden !rounded-sm border border-[var(--rl-gray-border)] shadow-md cursor-pointer hover:px-5 transition-all duration-100 ease-in-out disabled:cursor-not-allowed disabled:hover:px-5"
          aria-label="Upload file"
        >
          {isUploading ? (
            <Loading small withOverlay={false} style={{ zoom: 0.8 }} />
          ) : (
            <Upload size={15} color={disabled ? "#9ca3af" : "var(--rl-blue)"} />
          )}
        </button>
      </label>

      {uploadedFile && (
        <div className="mt-2 flex items-center justify-between gap-2 text-sm bg-[var(--cds-field)] border border-[var(--rl-gray-border)] p-2 rounded-md">
          <div className="flex gap-1 flex-row text-[12px]">
            <span>
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <Loading small withOverlay={false} />
                  Uploading...
                </span>
              ) : (
                uploadedFile.name
              )}
            </span>
            <span>|</span>
            <span>{formatBytes(uploadedFile.size)}</span>
          </div>
          <div className="cursor-pointer">
            <TrashCan size={16} color="var(--rl-red)" onClick={handleRemove} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
