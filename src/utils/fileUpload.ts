
import { supabase } from "../integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../context/AuthContext";

export type FileUploadResult = {
  success: boolean;
  filePath?: string;
  publicUrl?: string;
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
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    // Get the public URL for the file
    const publicUrl = getFileUrl(bucket, data.path);

    return { 
      success: true, 
      filePath: data.path,
      publicUrl
    };
  } catch (error) {
    console.error("Exception during file upload:", error);
    toast({
      title: "Upload Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
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
 * @param expirySeconds Number of seconds until the URL expires (default: 1 hour)
 * @returns Promise resolving to the signed URL
 */
export const getSignedFileUrl = async (
  bucket: string, 
  path: string,
  expirySeconds: number = 60 * 60
): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expirySeconds);

  if (error || !data) {
    console.error("Error creating signed URL:", error);
    toast({
      title: "Error",
      description: "Could not generate file access link",
      variant: "destructive",
    });
    return null;
  }

  return data.signedUrl;
};

/**
 * Custom hook for file uploads that integrates with the auth context
 * @returns Upload functions that automatically use the current user's ID
 */
export const useFileUpload = () => {
  const { currentUser } = useAuth();
  
  const uploadSubmission = async (file: File): Promise<FileUploadResult> => {
    if (!currentUser) {
      return { 
        success: false, 
        error: "You must be logged in to upload files" 
      };
    }
    
    return uploadFile(file, "submissions", currentUser.id);
  };
  
  const uploadExamPaper = async (file: File): Promise<FileUploadResult> => {
    if (!currentUser || currentUser.role !== "admin") {
      return { 
        success: false, 
        error: "Only administrators can upload exam papers" 
      };
    }
    
    return uploadFile(file, "exam_papers", `admin/${currentUser.id}`);
  };
  
  return {
    uploadSubmission,
    uploadExamPaper,
    getFileUrl,
    getSignedFileUrl
  };
};
