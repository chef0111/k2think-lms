import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn, formatBytes } from '@/lib/utils';
import { ImageIcon, UploadIcon } from 'lucide-react';

interface EmptyStateProps {
  isDragActive: boolean;
  maxSize: number;
}

export function EmptyState({ isDragActive, maxSize }: EmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className={cn(
            'size-16 rounded-full',
            isDragActive ? 'bg-primary/10' : 'bg-muted'
          )}
        >
          <ImageIcon
            className={cn(
              'size-6',
              isDragActive ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </EmptyMedia>
        <EmptyTitle className="text-lg font-semibold">
          Upload thumbnail image
        </EmptyTitle>
        <EmptyDescription>
          Drag and drop an image here or click to browse <br />
          PNG, JPG, GIF or WEBP up to {formatBytes(maxSize)}
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button
          type="button"
          variant="secondary"
          className="border-border border"
        >
          <UploadIcon /> Select File
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function ErrorState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="bg-destructive/15 size-16 rounded-full"
        >
          <ImageIcon className="text-destructive size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-destructive text-lg font-semibold">
          Upload image failed
        </EmptyTitle>
        <EmptyDescription>
          Something went wrong! Please try again.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button
          type="button"
          variant="secondary"
          className="border-border border"
        >
          <UploadIcon />
          Retry upload
        </Button>
      </EmptyContent>
    </Empty>
  );
}
