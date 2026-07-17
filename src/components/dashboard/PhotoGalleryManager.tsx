"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Photo = {
  id: string;
  image_url: string;
};

type Props = {
  serviceId: string;
};

export default function PhotoGalleryManager({ serviceId }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadPhotos();
  }, [serviceId]);

  const loadPhotos = async () => {
    const { data } = await supabase.from("service_photos").select("id, image_url").eq("service_id", serviceId).order("display_order");
    if (data) setPhotos(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError("");
    setUploading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in");
      setUploading(false);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/gallery-${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("service-images").upload(fileName, file);

      if (uploadError) {
        setError("Upload failed: " + uploadError.message);
        continue;
      }

      const { data: urlData } = supabase.storage.from("service-images").getPublicUrl(fileName);

      await supabase.from("service_photos").insert({
        service_id: serviceId,
        image_url: urlData.publicUrl,
      });
    }

    await loadPhotos();
    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (photoId: string) => {
    await supabase.from("service_photos").delete().eq("id", photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  return (
    <div className="border-t border-amber-400/10 pt-5 mt-5">
      <div className="text-[10px] font-bold tracking-[1px] uppercase text-amber-400 mb-3">📸 Gallery Photos (Plus/Elite)</div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-2.5 mb-3">{error}</div>}

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group">
            <img src={photo.image_url} alt="Gallery" className="w-full h-full object-cover" />
            <button onClick={() => handleDelete(photo.id)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}
      </div>

      <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleUpload} disabled={uploading} className="text-xs text-muted2 w-full" />
      {uploading && <div className="text-xs text-muted2 mt-2">Uploading...</div>}
    </div>
  );
}
