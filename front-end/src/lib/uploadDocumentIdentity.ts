// utils/uploadDocumentIdentity.ts
import { supabase } from "@/lib/supabase";

export async function uploadDocumentIdentity(params: {
  userId: string;
  file: File;
}) {
  const { userId, file } = params;

  const ext = file.name.split(".").pop() || "bin";
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
  const filePath = `document-identity/${userId}/${crypto.randomUUID()}.${safeExt}`;

  const { data, error } = await supabase.storage
    .from("kyc-manual")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

  if (error) throw error;

  const { data: pub } = supabase.storage.from("kyc-manual").getPublicUrl(data.path);
  const publicUrl = pub.publicUrl;

  return { path: data.path, publicUrl };
}
