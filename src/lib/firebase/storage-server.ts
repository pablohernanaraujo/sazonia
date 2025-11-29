import { adminStorage } from './admin';

/**
 * Get the default storage bucket
 */
function getBucket() {
  return adminStorage.bucket();
}

/**
 * Generate a signed URL for downloading a file
 */
export async function getSignedDownloadUrl(
  filePath: string,
  expiresInMinutes = 60
): Promise<string> {
  const bucket = getBucket();
  const file = bucket.file(filePath);

  const [exists] = await file.exists();
  if (!exists) {
    throw new Error('File not found');
  }

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });

  return url;
}

/**
 * Generate a signed URL for uploading a file
 */
export async function getSignedUploadUrl(
  filePath: string,
  contentType: string,
  expiresInMinutes = 15
): Promise<string> {
  const bucket = getBucket();
  const file = bucket.file(filePath);

  const [url] = await file.getSignedUrl({
    action: 'write',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
    contentType,
  });

  return url;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  const bucket = getBucket();
  await bucket.file(filePath).delete();
}

/**
 * Delete multiple files from storage
 */
export async function deleteFiles(filePaths: string[]): Promise<void> {
  const bucket = getBucket();
  await Promise.all(filePaths.map((path) => bucket.file(path).delete()));
}

/**
 * Delete all files in a directory (by prefix)
 */
export async function deleteDirectory(prefix: string): Promise<void> {
  const bucket = getBucket();
  const [files] = await bucket.getFiles({ prefix });
  await Promise.all(files.map((file) => file.delete()));
}

/**
 * Copy a file to a new location
 */
export async function copyFile(
  sourcePath: string,
  destinationPath: string
): Promise<void> {
  const bucket = getBucket();
  await bucket.file(sourcePath).copy(bucket.file(destinationPath));
}

/**
 * Move a file to a new location (copy then delete)
 */
export async function moveFile(
  sourcePath: string,
  destinationPath: string
): Promise<void> {
  await copyFile(sourcePath, destinationPath);
  await deleteFile(sourcePath);
}

/**
 * Get file metadata
 */
export async function getFileMetadata(filePath: string) {
  const bucket = getBucket();
  const file = bucket.file(filePath);

  const [exists] = await file.exists();
  if (!exists) {
    return null;
  }

  const [metadata] = await file.getMetadata();
  return {
    name: metadata.name,
    size: metadata.size,
    contentType: metadata.contentType,
    created: metadata.timeCreated,
    updated: metadata.updated,
    customMetadata: metadata.metadata,
  };
}

/**
 * Update file metadata
 */
export async function updateFileMetadata(
  filePath: string,
  metadata: Record<string, string>
): Promise<void> {
  const bucket = getBucket();
  await bucket.file(filePath).setMetadata({ metadata });
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  const bucket = getBucket();
  const [exists] = await bucket.file(filePath).exists();
  return exists;
}

/**
 * List files in a directory
 */
export async function listFiles(
  prefix: string,
  maxResults = 100
): Promise<
  Array<{
    name: string;
    size: number | undefined;
    contentType: string | undefined;
    created: string | undefined;
  }>
> {
  const bucket = getBucket();
  const [files] = await bucket.getFiles({
    prefix,
    maxResults,
  });

  return files.map((file) => ({
    name: file.name,
    size: file.metadata.size as number | undefined,
    contentType: file.metadata.contentType,
    created: file.metadata.timeCreated,
  }));
}

/**
 * Get a public URL for a file (requires public access configured in storage rules)
 */
export function getPublicUrl(filePath: string): string {
  const bucket = getBucket();
  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}
