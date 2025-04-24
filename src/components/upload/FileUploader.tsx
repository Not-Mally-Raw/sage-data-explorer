
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface FileUploaderProps {
  onFileSelect?: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSizeMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  acceptedFileTypes = [".csv", ".pdf"],
  maxFileSizeMB = 10,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const maxFileSize = maxFileSizeMB * 1024 * 1024; // Convert MB to bytes

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSize) {
      setFileError(`File size exceeds the limit of ${maxFileSizeMB} MB.`);
      return false;
    }

    // Check file type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (
      !acceptedFileTypes.some((type) =>
        type.toLowerCase().includes(fileExtension)
      )
    ) {
      setFileError(
        `Invalid file type. Accepted types: ${acceptedFileTypes.join(", ")}`
      );
      return false;
    }

    setFileError(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        if (onFileSelect) {
          onFileSelect(file);
        }
        toast({
          title: "File selected",
          description: `${file.name} has been selected.`,
        });
      } else {
        e.target.value = ""; // Reset input
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        if (onFileSelect) {
          onFileSelect(file);
        }
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded.`,
        });
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg transition-all",
            dragActive
              ? "border-primary bg-muted/50"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            selectedFile && "border-green-500 bg-green-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-3 rounded-full bg-muted">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <p className="text-sm font-medium">Drag & drop or click to upload</p>
                  <p className="text-xs text-muted-foreground">
                    Upload your CSV or PDF financial documents
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  className="relative"
                >
                  Select File
                  <input
                    ref={inputRef}
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept={acceptedFileTypes.join(",")}
                  />
                </Button>
                <p className="text-xs text-muted-foreground">
                  Max file size: {maxFileSizeMB} MB
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 w-full">
              <div className="p-3 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center justify-between w-full max-w-sm border rounded-lg p-3 bg-white">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[180px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-3">
                <Button size="sm" onClick={() => inputRef.current?.click()}>
                  Change File
                </Button>
                <Button variant="default" size="sm">
                  Process File
                </Button>
              </div>
            </div>
          )}
        </div>

        {fileError && (
          <div className="mt-4 p-3 text-sm bg-red-50 text-red-600 border border-red-200 rounded-md">
            {fileError}
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Supported File Formats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="mr-3 p-1.5 bg-blue-100 rounded-md">
                <File size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">CSV Files</p>
                <p className="text-xs text-muted-foreground">
                  Structured financial data
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <div className="mr-3 p-1.5 bg-red-100 rounded-md">
                <File size={16} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">PDF Files</p>
                <p className="text-xs text-muted-foreground">
                  Bank statements, invoices
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
