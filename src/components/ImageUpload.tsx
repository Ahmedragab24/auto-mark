"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, ImagePlus, Loader } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImagesUploaded: (files: File[]) => void;
  maxFiles?: number;
  title?: string;
  subTitle?: string;
}

export function ImageUpload({
  onImagesUploaded,
  maxFiles = 20,
  title,
  subTitle,
}: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean[]>([]);

  const checkImageReadability = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve(false);
      reader.readAsDataURL(file);
    });
  }, []);

  // Update files state and notify parent separately
  const updateFiles = useCallback(
    (newFiles: File[]) => {
      setFiles(newFiles);
      // Use setTimeout to avoid state updates during render
      setTimeout(() => {
        onImagesUploaded(newFiles);
      }, 0);
    },
    [onImagesUploaded]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const readableFiles: File[] = [];
      for (const file of acceptedFiles) {
        const isReadable = await checkImageReadability(file);
        if (isReadable) {
          readableFiles.push(file);
        } else {
          toast({
            title: "خطأ",
            description: `الملف ${file.name} غير قابل للقراءة. يرجى المحاولة بصورة أخرى.`,
            variant: "destructive",
          });
        }
      }

      const newFiles = [...files, ...readableFiles].slice(0, maxFiles);
      updateFiles(newFiles);
      setLoading((prev) => [
        ...prev,
        ...new Array(readableFiles.length).fill(true),
      ]);
    },
    [files, maxFiles, updateFiles, checkImageReadability]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
    },
    maxFiles,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = useCallback(
    (fileToRemove: File, event: React.MouseEvent) => {
      event.stopPropagation();
      const newFiles = files.filter((f) => f.name !== fileToRemove.name);
      updateFiles(newFiles);
      setLoading((prev) =>
        prev.filter(
          (_, index) =>
            index !== files.findIndex((f) => f.name === fileToRemove.name)
        )
      );
    },
    [files, updateFiles]
  );

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleImageLoad = useCallback((index: number) => {
    setLoading((prev) => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  }, []);

  const uploadBoxStyle = {
    width: "100%",
    aspectRatio: "16/9",
  };

  return (
    <div className="w-full">
      <div className="text-right mb-2">
        <h3 className="text-sm mb-2">{title}</h3>
        <p className="text-xs text-gray-500">{subTitle}</p>
      </div>
      {files.length === 0 ? (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-400 transition-colors overflow-hidden"
          style={uploadBoxStyle}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <ImagePlus className="w-12 h-12 text-gray-400" />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <>
                <p className="text-xs md:text-sm font-medium text-gray-500">
                  <span className="text-primary mx-1">Upload a file</span>
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div key={file.name} className="relative" style={uploadBoxStyle}>
              {loading[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 rounded-2xl">
                  <Loader className="w-8 h-8 text-primary animate-spin" />
                </div>
              )}
              <Image
                src={previewUrls[index] || "/placeholder.svg"}
                alt={`Uploaded ${index + 1}`}
                fill
                className={`w-full h-full object-contain rounded-2xl border-2 border-dashed border-gray-300 ${
                  loading[index] ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => handleImageLoad(index)}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-20 w-7 h-7"
                onClick={(event) => removeFile(file, event)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div
                {...getRootProps()}
                className="absolute inset-0 cursor-pointer z-0"
              >
                <input {...getInputProps()} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
