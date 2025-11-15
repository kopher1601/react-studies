import supabase from "@/lib/supabase.ts";
import { BUCKET_NAME } from "@/lib/constants.ts";

export async function uploadImage({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);
  if (error) {
    console.error(error);
    throw error;
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data?.path);

  return publicUrl;
}
