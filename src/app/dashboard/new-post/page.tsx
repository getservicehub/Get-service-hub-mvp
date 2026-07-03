"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewPostPage() {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("Please select a photo");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in");
      setLoading(false);
      return;
    }

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `posts/${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("service-images").upload(fileName, imageFile);

    if (uploadError) {
      setError("Upload failed: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("service-images").getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("posts").insert({
      provider_id: user.id,
      image_url: urlData.publicUrl,
      caption,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
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
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Photo</label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full h-[240px] object-cover rounded-lg mb-3" />
              )}
              {!imagePreview && (
                <div className="w-full h-[140px] flex items-center justify-center text-4xl text-muted2 mb-2">📷</div>
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="text-xs text-muted2 w-full" />
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
