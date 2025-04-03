
import { supabase } from "../integrations/supabase/client";

export type FileUploadResult = {
  success: boolean;
  filePath?: string;
  error?: string;
};

/**
 * Uploads a file to Supabase storage
 * @param file The file to upload
 * @param bucket The storage bucket to upload to
 * @param path The path within the bucket (e.g. user ID)
 * @returns Object containing success status and file path or error
 */
export const uploadFile = async (
  file: File,
  bucket: "exam_papers" | "submissions",
  path: string
): Promise<FileUploadResult> => {
  try {
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${path}/${Date.now()}.${fileExt}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return { success: false, error: error.message };
    }

    return { success: true, filePath: data.path };
  } catch (error) {
    console.error("Exception during file upload:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Gets a public URL for a file
 * @param bucket The storage bucket
 * @param path The file path within the bucket
 * @returns The public URL as a string
 */
export const getFileUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Gets a signed URL for a file (for private buckets)
 * @param bucket The storage bucket
 * @param path The file path within the bucket
 * @returns Promise resolving to the signed URL
 */
export const getSignedFileUrl = async (bucket: string, path: string): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60); // 1 hour expiry

  if (error || !data) {
    console.error("Error creating signed URL:", error);
    return null;
  }

  return data.signedUrl;
};
