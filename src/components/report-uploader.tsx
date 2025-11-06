 'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ReportUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: 'No file selected', description: 'Please choose a PDF or DOC to upload.' });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch('/api/reports/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, dataUri: dataUrl }),
        });
        if (res.ok) {
          toast({ title: 'Upload successful', description: `${file.name} uploaded.` });
          setFile(null);
        } else {
          toast({ variant: 'destructive', title: 'Upload failed', description: 'Server rejected the upload.' });
        }
      } catch (err) {
        toast({ variant: 'destructive', title: 'Upload error', description: 'Could not upload file.' });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <input type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFile} />
      </label>
      <div className="flex items-center gap-2">
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Report'}
        </Button>
      </div>
    </div>
  );
}
