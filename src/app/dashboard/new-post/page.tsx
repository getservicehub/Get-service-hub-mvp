"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewPostPage() {
  const [caption, setCaption] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selected = Array.from(files).slice(0, 3);
    setImageFiles(selected);
    setImagePreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (imageFiles.length === 0) {
      setError("Please select at least one photo");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in");
      setLoading(false);
      return;
    }

    const uploadedUrls: string[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("service-images").upload(fileName, file);

      if (uploadError) {
        setError("Upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("service-images").getPublicUrl(fileName);
      uploadedUrls.push(urlData.publicUrl);
    }

    const { data: newPost, error: insertError } = await supabase
      .from("posts")
      .insert({ provider_id: user.id, image_url: uploadedUrls[0], caption })
      .select("id")
      .single();

    if (insertError || !newPost) {
      setError(insertError?.message || "Failed to create post");
      setLoading(false);
      return;
    }

    if (uploadedUrls.length > 1) {
      const extraImages = uploadedUrls.slice(1).map((url, idx) => ({
        post_id: newPost.id,
        image_url: url,
        display_order: idx + 1,
      }));
      await supabase.from("post_images").insert(extraImages);
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/gallery"), 1500);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5 flex items-center justify-center">
        <div className="max-w-[400px] text-center">
          <div className="text-5xl mb-5">📸</div>
          <h1 className="text-2xl font-extrabold mb-3">Photo Posted!</h1>
          <p className="text-muted2 text-sm">Redirecting to the gallery...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[500px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Work Gallery</div>
        <h1 className="text-3xl font-extrabold mb-8">Share Your Work</h1>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Photos (up to 3)</label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {imagePreviews.map((preview, i) => (
                    <img key={i} src={preview} alt={`Preview ${i + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                  ))}
                </div>
              )}
              {imagePreviews.length === 0 && (
                <div className="w-full h-[140px] flex items-center justify-center text-4xl text-muted2 mb-2">📷</div>
              )}
              <label className="inline-block px-4 py-2 rounded-lg gradient-bg text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-all">
                Choose Photos
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Caption</label>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Tell the story behind this work..." rows={3} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
            {loading ? "Posting..." : "Post to Gallery"}
          </button>
        </form>
      </div>
    </main>
  );
}
