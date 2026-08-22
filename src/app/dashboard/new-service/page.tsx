"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SAN_DIEGO_COUNTY_CITIES } from "@/lib/services/cities";
import { CategoryIcon } from "@/lib/services/categoryIcons";
import { Upload, MessageCircle, Clock, ShieldCheck, ArrowRight, Lock } from "lucide-react";

type Category = { id: string; name: string; icon: string };

const DESCRIPTION_LIMIT = 500;
const DESCRIPTION_MIN = 40;

export default function NewServicePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [city, setCity] = useState("San Diego");
  const [pricingType, setPricingType] = useState<"starting_at" | "fixed" | "quote">("starting_at");
  const [priceFrom, setPriceFrom] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [espanol, setEspanol] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("categories").select("id, name, icon").then(({ data }) => {
      if (data) setCategories(data);
    });

    supabase.auth.getUser().then(({ data: authData }) => {
      if (authData.user) {
        supabase
          .from("profiles")
          .select("business_name, full_name, business_hours, is_verified")
          .eq("id", authData.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setBusinessName(data.business_name || data.full_name || "");
              setBusinessHours(data.business_hours || "");
              setIsVerified(data.is_verified || false);
            }
          });
      }
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

    if (description.trim().length < DESCRIPTION_MIN) {
      setError(`Description must be at least ${DESCRIPTION_MIN} characters`);
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
      title: title.trim(),
      description: description.trim(),
      city,
      pricing_type: pricingType,
      price_from: pricingType !== "quote" && priceFrom ? parseFloat(priceFrom) : null,
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

  const completenessItems = [
    !!imagePreview,
    title.trim().length > 0,
    categoryId.length > 0,
    description.trim().length >= DESCRIPTION_MIN,
    pricingType === "quote" || priceFrom.length > 0,
  ];
  const completenessPct = Math.round((completenessItems.filter(Boolean).length / completenessItems.length) * 100);

  const selectedCategory = categories.find((c) => c.id === categoryId);

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
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-1">Create a Service</h1>
            <p className="text-sm text-muted2">Show customers exactly what you do.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-muted2 mb-1">Service Completeness</div>
              <div className="flex items-center gap-2">
                <div className="w-28 h-1.5 bg-bg2 rounded-full overflow-hidden">
                  <div className="h-full gradient-bg" style={{ width: `${completenessPct}%` }} />
                </div>
                <span className="text-sm font-extrabold text-cyan-400">{completenessPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6 items-start">
          <div className="space-y-5">

            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-cyan-400/15 text-cyan-400 text-xs font-extrabold flex items-center justify-center flex-shrink-0">1</span>
                <span className="text-sm font-extrabold">Service</span>
              </div>
              <p className="text-xs text-muted2 mb-4 ml-8">What are you offering?</p>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Service Photo</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-[180px] object-cover rounded-lg mb-3" />
                  ) : (
                    <div className="w-full h-[100px] flex flex-col items-center justify-center gap-1.5 text-muted2 mb-2">
                      <Upload className="w-6 h-6" />
                      <span className="text-xs">Drag & drop or click to browse</span>
                    </div>
                  )}
                  <label className="inline-block px-4 py-2 rounded-lg gradient-bg text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-all">
                    {imagePreview ? "Replace Photo" : "Upload Service Photo"}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted2 mb-1.5">Service Name</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mobile Oil Change" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted2 mb-1.5">Category</label>
                  <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400">
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-cyan-400/15 text-cyan-400 text-xs font-extrabold flex items-center justify-center flex-shrink-0">2</span>
                <span className="text-sm font-extrabold">Details</span>
              </div>
              <p className="text-xs text-muted2 mb-4 ml-8">Help customers understand the service.</p>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Description</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_LIMIT))} placeholder="Describe your service..." rows={4} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                <div className="text-right text-[11px] text-muted2 mt-1">{description.length} / {DESCRIPTION_LIMIT}</div>
              </div>

              <label className="block text-xs font-semibold text-muted2 mb-1.5">How do you price this service?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <button type="button" onClick={() => setPricingType("starting_at")} className={pricingType === "starting_at" ? "text-left p-3 rounded-lg border-2 border-cyan-400 bg-cyan-400/10" : "text-left p-3 rounded-lg border-2 border-white/10"}>
                  <div className="text-sm font-bold">Starting at</div>
                  <div className="text-[11px] text-muted2">Set a minimum price</div>
                </button>
                <button type="button" onClick={() => setPricingType("fixed")} className={pricingType === "fixed" ? "text-left p-3 rounded-lg border-2 border-cyan-400 bg-cyan-400/10" : "text-left p-3 rounded-lg border-2 border-white/10"}>
                  <div className="text-sm font-bold">Fixed price</div>
                  <div className="text-[11px] text-muted2">One flat rate</div>
                </button>
                <button type="button" onClick={() => setPricingType("quote")} className={pricingType === "quote" ? "text-left p-3 rounded-lg border-2 border-cyan-400 bg-cyan-400/10" : "text-left p-3 rounded-lg border-2 border-white/10"}>
                  <div className="text-sm font-bold">Quote required</div>
                  <div className="text-[11px] text-muted2">Custom pricing</div>
                </button>
              </div>

              {pricingType !== "quote" && (
                <div>
                  <label className="block text-xs font-semibold text-muted2 mb-1.5">{pricingType === "starting_at" ? "Starting Price" : "Price"}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted2 text-sm">$</span>
                    <input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="50" className="w-full pl-8 pr-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-cyan-400/15 text-cyan-400 text-xs font-extrabold flex items-center justify-center flex-shrink-0">3</span>
                <span className="text-sm font-extrabold">Availability</span>
              </div>
              <p className="text-xs text-muted2 mb-4 ml-8">Set expectations before customers contact you.</p>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-muted2 mb-1.5">City</label>
                <select required value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400">
                  {SAN_DIEGO_COUNTY_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="bg-bg2 rounded-lg p-3.5 mb-4 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold">Availability</div>
                  <div className="text-[11px] text-muted2">{businessHours || "Not set - update your business hours in your profile"}</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <label className="flex-1 flex items-center gap-2.5 p-3 rounded-lg border border-white/10 cursor-pointer">
                  <input type="checkbox" checked={emergency} onChange={(e) => setEmergency(e.target.checked)} />
                  <div>
                    <div className="text-xs font-bold">24/7 Emergency</div>
                    <div className="text-[11px] text-muted2">Available all day, every day</div>
                  </div>
                </label>
                <label className="flex-1 flex items-center gap-2.5 p-3 rounded-lg border border-white/10 cursor-pointer">
                  <input type="checkbox" checked={espanol} onChange={(e) => setEspanol(e.target.checked)} />
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Se habla espanol</div>
                    <div className="text-[11px] text-muted2">Service available in Spanish</div>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
              {loading ? "Publishing..." : "Publish Service"}
            </button>
          </div>

          <div className="hidden lg:block sticky top-[100px]">
            <div className="bg-card border border-cyan-400/20 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/[.08] flex items-center gap-2">
                <span className="text-cyan-400">👁</span>
                <div>
                  <div className="text-xs font-extrabold">Live Preview</div>
                  <div className="text-[10px] text-muted2">This is how customers will see your service.</div>
                </div>
              </div>

              <div className="w-full h-[180px] flex items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#0D1A2E] overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : selectedCategory ? (
                  <CategoryIcon name={selectedCategory.name} className="w-12 h-12 text-cyan-400" />
                ) : (
                  <div className="text-muted2 text-xs">Add a photo to preview</div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-base font-extrabold">{title || "Service Name"}</div>
                  {isVerified && <span className="flex-shrink-0 text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>}
                </div>
                {businessName && <div className="text-xs text-cyan-400 mb-2">{businessName}</div>}
                <div className="text-[11px] text-muted2 mb-3">{selectedCategory?.name || "Category"} - {city}</div>

                {description && <p className="text-xs text-muted2 mb-3 line-clamp-3">{description}</p>}

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {pricingType !== "quote" && priceFrom && (
                    <span className="text-[11px] font-bold bg-bg2 px-2.5 py-1 rounded-lg">{pricingType === "starting_at" ? `Starting at $${priceFrom}` : `$${priceFrom}`}</span>
                  )}
                  {pricingType === "quote" && <span className="text-[11px] font-bold bg-bg2 px-2.5 py-1 rounded-lg">Quote required</span>}
                  {espanol && <span className="text-[11px] font-bold bg-bg2 px-2.5 py-1 rounded-lg">Espanol</span>}
                  {emergency && <span className="text-[11px] font-bold bg-bg2 px-2.5 py-1 rounded-lg">24/7</span>}
                </div>

                <div className="w-full py-2.5 rounded-lg gradient-bg text-white font-bold text-xs text-center flex items-center justify-center gap-1.5">View Service <ArrowRight className="w-3.5 h-3.5" /></div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 justify-center mt-3 text-[11px] text-muted2"><Lock className="w-3 h-3" /> Your information is safe and secure</div>
          </div>
        </form>
      </div>
    </main>
  );
}
