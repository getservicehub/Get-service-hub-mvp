"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SAN_DIEGO_COUNTY_CITIES } from "@/lib/services/cities";

type Category = { id: string; name: string; icon: string };

export default function NewServicePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [city, setCity] = useState("San Diego");
  const [priceFrom, setPriceFrom] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [espanol, setEspanol] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("categories").select("id, name, icon").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, [supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in");
      setLoading(false);
      return;
    }

    let imageUrl: string | null = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("service-images").upload(fileName, imageFile);

      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("service-images").getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("services").insert({
      provider_id: user.id,
      category_id: categoryId,
      title,
      description,
      city,
      price_from: priceFrom ? parseFloat(priceFrom) : null,
      emergency,
      espanol,
      image_url: imageUrl,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5 flex items-center justify-center">
        <div className="max-w-[400px] text-center">
          <div className="text-5xl mb-5">🎉</div>
          <h1 className="text-2xl font-extrabold mb-3">Service Published!</h1>
          <p className="text-muted2 text-sm">Redirecting to your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[500px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Provider Dashboard</div>
        <h1 className="text-3xl font-extrabold mb-8">Publish a New Service</h1>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Service Photo</label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-[180px] object-cover rounded-lg mb-3" />
              ) : (
                <div className="w-full h-[100px] flex items-center justify-center text-4xl text-muted2 mb-2">📷</div>
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="text-xs text-muted2 w-full" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Service Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mobile Oil Change" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Category</label>
            <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400">
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your service..." rows={4} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">City</label>
            <select required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400">
              {SAN_DIEGO_COUNTY_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Starting Price (optional)</label>
            <input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="50" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-muted2">
              <input type="checkbox" checked={emergency} onChange={(e) => setEmergency(e.target.checked)} />
              24/7 Emergency
            </label>
            <label className="flex items-center gap-2 text-sm text-muted2">
              <input type="checkbox" checked={espanol} onChange={(e) => setEspanol(e.target.checked)} />
              Se habla espanol
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
            {loading ? "Publishing..." : "Publish Service"}
          </button>
        </form>
      </div>
    </main>
  );
}
