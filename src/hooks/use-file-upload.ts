'use client';

import { useCallback, useRef, useState } from 'react';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTask,
} from 'firebase/storage';

import { useAuth } from '@/contexts/auth-context';
import { getClientStorage } from '@/lib/firebase/client';
import type { UploadProgress, UploadStatus } from '@/lib/firebase/types';

interface UseFileUploadResult {
  uploadFile: (file: File, path?: string) => Promise<string>;
  deleteFile: (url: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  progress: UploadProgress | null;
  error: Error | null;
  reset: () => void;
}

/**
 * Hook for file uploads with progress tracking and pause/resume
 *
 * @returns Upload functions, progress state, and controls
 *
 * @example
 * ```tsx
 * const { uploadFile, progress, error } = useFileUpload();
 *
 * const handleUpload = async (file: File) => {
 *   const url = await uploadFile(file, `images/${userId}`);
 *   console.log("Uploaded to:", url);
 * };
 * ```
 */
export function useFileUpload(): UseFileUploadResult {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const uploadTaskRef = useRef<UploadTask | null>(null);

  const uploadFile = useCallback(
    async (file: File, customPath?: string): Promise<string> => {
      if (!user) {
        throw new Error('Must be logged in to upload files');
      }

      const path = customPath || `uploads/${user.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(getClientStorage(), path);

      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTaskRef.current = uploadTask;

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progressPercent =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            let status: UploadStatus = 'uploading';
            if (snapshot.state === 'paused') {
              status = 'paused';
            }

            setProgress({
              progress: progressPercent,
              status,
            });
          },
          (err) => {
            if (err.code === 'storage/canceled') {
              setProgress({ progress: 0, status: 'idle' });
            } else {
              setError(err);
              setProgress({ progress: 0, status: 'error' });
            }
            uploadTaskRef.current = null;
            reject(err);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setProgress({ progress: 100, status: 'success' });
            uploadTaskRef.current = null;
            resolve(downloadURL);
          }
        );
      });
    },
    [user]
  );

  const deleteFile = useCallback(async (url: string) => {
    const fileRef = ref(getClientStorage(), url);
    await deleteObject(fileRef);
  }, []);

  const pause = useCallback(() => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.resume();
    }
  }, []);

  const cancel = useCallback(() => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.cancel();
    }
  }, []);

  const reset = useCallback(() => {
    setProgress(null);
    setError(null);
    uploadTaskRef.current = null;
  }, []);

  return {
    uploadFile,
    deleteFile,
    pause,
    resume,
    cancel,
    progress,
    error,
    reset,
  };
}
