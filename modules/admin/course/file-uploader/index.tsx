'use client';

import { FileRejection, useDropzone } from 'react-dropzone';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { EmptyState, ErrorState } from './render-state';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';

const ERROR_MAP: Record<string, string> = {
  'too-many-files': 'Too many files, only 1 file is allowed',
  'file-too-large': 'File too large, maximum size is 5MB',
  'file-invalid-type': 'Invalid file, only images are allowed',
};

interface FileUploaderProps {
  maxSize: number;
}

type FileState = {
  id: string | null;
  file: File | null;
  type: 'image' | 'video' | Blob;
  uploading: boolean;
  progress: number;
  key?: string;
  deleting: boolean;
  error: boolean;
  objectUrl?: string;
};

export function FileUploader({ maxSize }: FileUploaderProps) {
  const [file, setFile] = useState<FileState>({
    id: null,
    file: null,
    type: 'image',
    uploading: false,
    progress: 0,
    deleting: false,
    error: false,
  });

  const uploadFile = (file: File) => {
    setFile((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
    } catch {
      setFile((prev) => ({
        ...prev,
        uploading: false,
        error: true,
      }));
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile({
        id: uuid(),
        file,
        type: 'image',
        uploading: false,
        progress: 0,
        deleting: false,
        error: false,
        objectUrl: URL.createObjectURL(file),
      });
    }
  };

  const rejectedFiles = (fileRejections: FileRejection[]) => {
    console.log('fileRejections', JSON.stringify(fileRejections, null, 2));

    if (fileRejections.length) {
      const shownErrors = new Set<string>();

      fileRejections.forEach(({ errors }) => {
        const code = errors[0]?.code ?? 'unknown-error';

        if (code && ERROR_MAP[code] && !shownErrors.has(code)) {
          toast.error('Error', {
            description: ERROR_MAP[code] ?? 'Unknown error occured',
          });
          shownErrors.add(code);
        }
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
    maxSize,
    onDropRejected: rejectedFiles,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'hover:bg-muted/50 relative w-full rounded-lg border-2 border-dashed bg-transparent p-0 text-center ring-0 transition-colors duration-200 focus:outline-none',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
      )}
    >
      <input {...getInputProps()} className="sr-only" />

      <EmptyState isDragActive={isDragActive} maxSize={maxSize} />
      {/* <ErrorState /> */}
    </Card>
  );
}
