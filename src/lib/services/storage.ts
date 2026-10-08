import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase/client";

export type ImageFolder = "hero" | "mangrove" | "river-mouth" | "arikamedu" | "fishing-harbour" | "packages" | "gallery";

export function uploadImage(file: File, folder: ImageFolder, onProgress?: (pct: number) => void) {
  if (!file.type.startsWith("image/")) throw new Error("Only images are allowed.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Image must be under 8 MB.");
  const path = `images/${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
  const task = uploadBytesResumable(ref(storage, path), file, { contentType: file.type });
  return new Promise<{ url: string; path: string }>((resolve, reject) => {
    task.on("state_changed",
      (s) => onProgress?.(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
      reject,
      async () => resolve({ url: await getDownloadURL(task.snapshot.ref), path }));
  });
}
export const removeImage = (path: string) => deleteObject(ref(storage, path));