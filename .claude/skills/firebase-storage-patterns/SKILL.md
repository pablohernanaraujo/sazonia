---
name: firebase-storage-patterns
description: Firebase Storage patterns for file uploads, downloads, image optimization, and secure file handling. Use when working with file uploads, image processing, download URLs, storage security rules, or file management.
---

# Firebase Storage Patterns

This Skill covers Firebase Storage patterns for handling file uploads, downloads, image optimization, and secure file management in Next.js applications.

## When to Use This Skill

- Implementing file uploads
- Generating download URLs
- Image optimization and resizing
- Secure file access
- Progress tracking for uploads
- File management operations

## Setup Patterns

### Pattern 1: Storage Client Setup

```typescript
// src/lib/firebase/storage.ts
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { app } from './client';

export const storage = getStorage(app);

// Helper to get storage reference
export function getStorageRef(path: string) {
  return ref(storage, path);
}
```

### Pattern 2: Storage Admin Setup

```typescript
// src/lib/firebase/storage-admin.ts
import { getStorage } from 'firebase-admin/storage';
import { adminApp } from './admin';

export const adminStorage = getStorage(adminApp);
export const bucket = adminStorage.bucket();
```

## Upload Patterns

### Pattern 3: Basic File Upload with Progress

```typescript
// src/hooks/useFileUpload.ts
'use client';

import { useState, useCallback } from 'react';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from '@/lib/firebase/storage';
import { useAuth } from '@/contexts/AuthContext';

interface UploadState {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error' | 'paused';
  downloadURL: string | null;
  error: Error | null;
}

export function useFileUpload() {
  const { user } = useAuth();
  const [state, setState] = useState<UploadState>({
    progress: 0,
    status: 'idle',
    downloadURL: null,
    error: null,
  });

  const upload = useCallback(
    async (file: File, path?: string): Promise<string> => {
      if (!user) throw new Error('Must be authenticated');

      const filePath = path || `uploads/${user.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setState({
              progress,
              status: snapshot.state === 'paused' ? 'paused' : 'uploading',
              downloadURL: null,
              error: null,
            });
          },
          (error) => {
            setState({
              progress: 0,
              status: 'error',
              downloadURL: null,
              error,
            });
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setState({
              progress: 100,
              status: 'success',
              downloadURL,
              error: null,
            });
            resolve(downloadURL);
          }
        );
      });
    },
    [user]
  );

  const reset = useCallback(() => {
    setState({
      progress: 0,
      status: 'idle',
      downloadURL: null,
      error: null,
    });
  }, []);

  return { ...state, upload, reset };
}
```

### Pattern 4: Image Upload with Validation

```typescript
// src/hooks/useImageUpload.ts
'use client';

import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/storage';
import { useAuth } from '@/contexts/AuthContext';

interface ImageUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  path?: string;
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSizeMB: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};

export function useImageUpload(options: ImageUploadOptions = {}) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const config = { ...DEFAULT_OPTIONS, ...options };

  const validateImage = useCallback(
    (file: File): string | null => {
      if (!config.allowedTypes?.includes(file.type)) {
        return `Invalid file type. Allowed: ${config.allowedTypes?.join(', ')}`;
      }

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > (config.maxSizeMB || 5)) {
        return `File too large. Maximum size: ${config.maxSizeMB}MB`;
      }

      return null;
    },
    [config]
  );

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      if (!user) throw new Error('Must be authenticated');

      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        throw new Error(validationError);
      }

      setUploading(true);
      setError(null);
      setProgress(0);

      try {
        const ext = file.name.split('.').pop();
        const path = config.path || `images/${user.uid}/${Date.now()}.${ext}`;
        const storageRef = ref(storage, path);

        const uploadTask = uploadBytesResumable(storageRef, file, {
          contentType: file.type,
          customMetadata: {
            uploadedBy: user.uid,
            originalName: file.name,
          },
        });

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              setProgress(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
            },
            (err) => {
              setError(err.message);
              setUploading(false);
              reject(err);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              setUploading(false);
              resolve(url);
            }
          );
        });
      } catch (err) {
        setUploading(false);
        throw err;
      }
    },
    [user, validateImage, config.path]
  );

  return { uploadImage, progress, error, uploading };
}
```

### Pattern 5: Multiple File Upload

```typescript
// src/hooks/useMultiFileUpload.ts
'use client';

import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/storage';
import { useAuth } from '@/contexts/AuthContext';

interface FileUploadStatus {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  downloadURL?: string;
  error?: string;
}

export function useMultiFileUpload() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileUploadStatus[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]): Promise<string[]> => {
      if (!user) throw new Error('Must be authenticated');

      const filesArray = Array.from(fileList);
      setUploading(true);

      // Initialize file statuses
      setFiles(
        filesArray.map((file) => ({
          file,
          progress: 0,
          status: 'pending',
        }))
      );

      const uploadPromises = filesArray.map(async (file, index) => {
        const path = `uploads/${user.uid}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, path);

        // Update status to uploading
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: 'uploading' as const } : f
          )
        );

        return new Promise<string>((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setFiles((prev) =>
                prev.map((f, i) => (i === index ? { ...f, progress } : f))
              );
            },
            (error) => {
              setFiles((prev) =>
                prev.map((f, i) =>
                  i === index
                    ? { ...f, status: 'error' as const, error: error.message }
                    : f
                )
              );
              reject(error);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              setFiles((prev) =>
                prev.map((f, i) =>
                  i === index
                    ? { ...f, status: 'success' as const, downloadURL: url }
                    : f
                )
              );
              resolve(url);
            }
          );
        });
      });

      try {
        const urls = await Promise.all(uploadPromises);
        setUploading(false);
        return urls;
      } catch (error) {
        setUploading(false);
        throw error;
      }
    },
    [user]
  );

  const reset = useCallback(() => {
    setFiles([]);
  }, []);

  return { uploadFiles, files, uploading, reset };
}
```

## Server-Side Patterns

### Pattern 6: Signed Upload URLs

```typescript
// src/app/api/storage/upload-url/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/firebase/auth-server';
import { bucket } from '@/lib/firebase/storage-admin';

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { filename, contentType } = await request.json();

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: 'Filename and contentType required' },
      { status: 400 }
    );
  }

  const path = `uploads/${session.uid}/${Date.now()}_${filename}`;
  const file = bucket.file(path);

  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  return NextResponse.json({
    uploadUrl: signedUrl,
    filePath: path,
  });
}
```

### Pattern 7: Signed Download URLs

```typescript
// src/lib/firebase/storage-server.ts
import { bucket } from './storage-admin';

export async function getSignedDownloadUrl(
  filePath: string,
  expiresInMinutes = 60
): Promise<string> {
  const file = bucket.file(filePath);

  const [exists] = await file.exists();
  if (!exists) {
    throw new Error('File not found');
  }

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });

  return url;
}

// For protected files that shouldn't have public URLs
export async function getProtectedFileUrl(
  filePath: string,
  userId: string
): Promise<string> {
  // Verify user owns the file (check metadata or path)
  const file = bucket.file(filePath);
  const [metadata] = await file.getMetadata();

  if (metadata.metadata?.ownerId !== userId) {
    throw new Error('Unauthorized');
  }

  return getSignedDownloadUrl(filePath, 5); // Short-lived URL
}
```

### Pattern 8: Server-Side File Operations

```typescript
// src/lib/firebase/storage-server.ts
import { bucket } from './storage-admin';

// Delete a file
export async function deleteFile(filePath: string): Promise<void> {
  await bucket.file(filePath).delete();
}

// Delete multiple files
export async function deleteFiles(filePaths: string[]): Promise<void> {
  await Promise.all(filePaths.map((path) => bucket.file(path).delete()));
}

// Delete all files in a directory
export async function deleteDirectory(prefix: string): Promise<void> {
  const [files] = await bucket.getFiles({ prefix });
  await Promise.all(files.map((file) => file.delete()));
}

// Copy a file
export async function copyFile(
  sourcePath: string,
  destinationPath: string
): Promise<void> {
  await bucket.file(sourcePath).copy(bucket.file(destinationPath));
}

// Move a file
export async function moveFile(
  sourcePath: string,
  destinationPath: string
): Promise<void> {
  await copyFile(sourcePath, destinationPath);
  await deleteFile(sourcePath);
}

// Get file metadata
export async function getFileMetadata(filePath: string) {
  const file = bucket.file(filePath);
  const [metadata] = await file.getMetadata();
  return metadata;
}

// List files in directory
export async function listFiles(prefix: string, maxResults = 100) {
  const [files] = await bucket.getFiles({
    prefix,
    maxResults,
  });

  return files.map((file) => ({
    name: file.name,
    size: file.metadata.size,
    contentType: file.metadata.contentType,
    created: file.metadata.timeCreated,
  }));
}
```

## Image Processing Patterns

### Pattern 9: Client-Side Image Compression

```typescript
// src/utils/imageCompression.ts
interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }

            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, `.${format}`),
              { type: `image/${format}` }
            );
            resolve(compressedFile);
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}
```

### Pattern 10: Image Upload with Compression

```typescript
// src/hooks/useCompressedImageUpload.ts
'use client';

import { useCallback, useState } from 'react';
import { useImageUpload } from './useImageUpload';
import { compressImage } from '@/utils/imageCompression';

interface CompressedUploadOptions {
  compress?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export function useCompressedImageUpload(options: CompressedUploadOptions = {}) {
  const {
    compress = true,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
  } = options;
  const { uploadImage, progress, error, uploading } = useImageUpload();
  const [compressing, setCompressing] = useState(false);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      let fileToUpload = file;

      if (compress && file.type.startsWith('image/')) {
        setCompressing(true);
        try {
          fileToUpload = await compressImage(file, {
            maxWidth,
            maxHeight,
            quality,
          });
        } finally {
          setCompressing(false);
        }
      }

      return uploadImage(fileToUpload);
    },
    [compress, maxWidth, maxHeight, quality, uploadImage]
  );

  return {
    upload,
    progress,
    error,
    uploading,
    compressing,
    processing: compressing || uploading,
  };
}
```

## Storage Security Rules

### Pattern 11: Basic User Storage Rules

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // User's private files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }

    // Public uploads (images only, max 5MB)
    match /public/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### Pattern 12: Advanced Storage Rules

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isImageType() {
      return request.resource.contentType.matches('image/(png|jpeg|jpg|gif|webp)');
    }

    function isDocumentType() {
      return request.resource.contentType.matches('application/pdf')
        || request.resource.contentType.matches('application/msword')
        || request.resource.contentType.matches('application/vnd.openxmlformats.*');
    }

    function isValidSize(maxMB) {
      return request.resource.size < maxMB * 1024 * 1024;
    }

    // Profile avatars
    match /avatars/{userId}/{fileName} {
      allow read: if true; // Public avatars
      allow write: if isOwner(userId)
        && isImageType()
        && isValidSize(2)
        && fileName.matches('avatar\\.(png|jpg|jpeg|webp)');
    }

    // User documents
    match /documents/{userId}/{docId}/{fileName} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId)
        && (isImageType() || isDocumentType())
        && isValidSize(10);
    }

    // Shared files (check Firestore for permissions)
    match /shared/{fileId} {
      allow read: if isAuthenticated()
        && firestore.exists(/databases/(default)/documents/fileAccess/$(request.auth.uid)/files/$(fileId));

      allow write: if isAuthenticated()
        && firestore.get(/databases/(default)/documents/files/$(fileId)).data.ownerId == request.auth.uid;
    }

    // Temporary uploads (auto-cleaned)
    match /temp/{userId}/{fileName} {
      allow read, write: if isOwner(userId)
        && isValidSize(50);
    }
  }
}
```

## Component Patterns

### Pattern 13: File Upload Component

```typescript
// src/components/FileUpload.tsx
"use client";

import { useRef, useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  onUpload,
  accept = "*",
  maxSizeMB = 10,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { upload, progress, status, error } = useFileUpload();

  const handleFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File must be smaller than ${maxSizeMB}MB`);
      return;
    }

    try {
      const url = await upload(file);
      onUpload(url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center
        transition-colors cursor-pointer
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${status === "uploading" ? "pointer-events-none opacity-50" : ""}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {status === "uploading" ? (
        <div className="space-y-2">
          <p>Uploading... {Math.round(progress)}%</p>
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="bg-blue-600 h-2 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-600">
            Drag & drop a file here, or click to select
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Max size: {maxSizeMB}MB
          </p>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error.message}</p>}
    </div>
  );
}
```

### Pattern 14: Image Preview with Upload

```typescript
// src/components/ImageUploadPreview.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useCompressedImageUpload } from "@/hooks/useCompressedImageUpload";

interface ImageUploadPreviewProps {
  currentImage?: string;
  onUpload: (url: string) => void;
}

export function ImageUploadPreview({
  currentImage,
  onUpload,
}: ImageUploadPreviewProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, progress, processing, error } = useCompressedImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const url = await upload(file);
      onUpload(url);
    } catch (err) {
      setPreview(currentImage || null);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Click to upload
          </div>
        )}

        {processing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-sm">
              {Math.round(progress)}%
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
```

## Best Practices

1. **Always validate files** before upload (type, size)
2. **Compress images** on client before upload
3. **Use signed URLs** for sensitive files
4. **Clean up unused files** periodically
5. **Set proper security rules** in Storage
6. **Track upload progress** for better UX
7. **Handle offline scenarios** gracefully
8. **Use appropriate content types** for files

## Related Resources

- `.claude/skills/firebase-client-patterns/SKILL.md` - Client patterns
- `.claude/skills/firebase-ssr-patterns/SKILL.md` - Server patterns
- `.claude/rules/firebase-security.md` - Security rules
- Firebase Storage docs: https://firebase.google.com/docs/storage
