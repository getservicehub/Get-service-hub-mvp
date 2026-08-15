"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, MapPin, ExternalLink } from "lucide-react";

  const [userId, setUserId] = useState("");
export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [city, setCity] = useState("San Diego");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [serviceCount, setServiceCount] = useState(0);
  const [completenessPct, setCompletenessPct] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!initialSnapshot) return;
    const current = JSON.stringify({ fullName, businessName, phone, licenseNumber, city });
    setHasChanges(current !== initialSnapshot);
  }, [fullName, businessName, phone, licenseNumber, city, initialSnapshot]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setEmail(user.email || "");
    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("role, full_name, business_name, phone, city, avatar_url, license_number, is_verified")
      .eq("id", user.id)
      .single();

    if (data) {
      setRole(data.role);
      setFullName(data.full_name || "");
      setBusinessName(data.business_name || "");
      setPhone(data.phone || "");
      setCity(data.city || "San Diego");
      setCurrentAvatarUrl(data.avatar_url);
      setLicenseNumber(data.license_number || "");
      setIsVerified(data.is_verified || false);
      setInitialSnapshot(JSON.stringify({ fullName: data.full_name, businessName: data.business_name, phone: data.phone, licenseNumber: data.license_number, city: data.city }));

      if (data.role === "provider") {
        const { data: services } = await supabase.from("services").select("id, categories(name)").eq("provider_id", user.id);
        if (services) {
          setServiceCount(services.length);
          if (services.length > 0) setCategory((services[0] as any).categories?.name || "");
        }

        const { data: completeness } = await supabase.from("provider_profile_completeness").select("completeness_pct").eq("provider_id", user.id).maybeSingle();
        if (completeness) setCompletenessPct(completeness.completeness_pct);
      }
    }

    setPageLoading(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let avatarUrl = currentAvatarUrl;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("service-images").upload(fileName, avatarFile);
      if (uploadError) {
        setError("Photo upload failed: " + uploadError.message);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("service-images").getPublicUrl(fileName);
      avatarUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        business_name: role === "provider" ? businessName : null,
        phone,
        city,
        avatar_url: avatarUrl,
        license_number: licenseNumber,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setInitialSnapshot(JSON.stringify({ fullName, businessName, phone, licenseNumber, city }));
    setSaved(true);
    setSaving(false);
    setCurrentAvatarUrl(avatarUrl);
    setTimeout(() => setSaved(false), 3000);
  };

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[900px] mx-auto text-muted2 text-sm">Loading your profile...</div>
      </main>
    );
  }

  const displayName = role === "provider" ? (businessName || fullName) : fullName;
  const isPublished = serviceCount > 0;

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-1">{role === "provider" ? "Edit Business Profile" : "Account"}</h1>
        <p className="text-sm text-muted2 mb-6">{role === "provider" ? "Manage how your business appears to customers." : "Manage your account information."}</p>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="bg-card border border-white/[.08] rounded-2xl p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-bg2 border border-white/10 flex items-center justify-center text-xl font-extrabold flex-shrink-0">
                  {avatarPreview || currentAvatarUrl ? (
                    <img src={avatarPreview || currentAvatarUrl || ""} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{displayName?.[0] || "?"}</span>
                  )}
                </div>
                <div>
                  <div className="text-lg font-extrabold">{displayName || "Your Name"}</div>
                  {role === "provider" && <div className="text-xs text-muted2">{category}{category && city ? " - " : ""}{city}</div>}
                  <div className="flex items-center gap-2 mt-1">
                    {role === "provider" && isPublished && <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">● Published</span>}
                    {isVerified && <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>}
                  </div>
                </div>
              </div>

              <label className="inline-block px-4 py-2 rounded-lg gradient-bg text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-all w-fit">Choose Photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} className="hidden" /></label>

              {role === "provider" && (
                <div className="md:ml-auto flex flex-col gap-2 items-start md:items-end">
                  <div className="text-xs text-muted2">Profile Completeness</div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1.5 bg-bg2 rounded-full overflow-hidden">
                      <div className="h-full gradient-bg" style={{ width: `${completenessPct}%` }} />
                    </div>
                    <span className="text-sm font-extrabold text-cyan-400">{completenessPct}%</span>
                  </div>
                  {userId && <Link href={`/provider/${userId}`} target="_blank" className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1 mt-1">View Public Profile <ExternalLink className="w-3 h-3" /></Link>}
                </div>
              )}
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3">{error}</div>}
          {saved && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg p-3">Changes saved successfully.</div>}

          {role === "provider" ? (
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400 mb-4">Business Information</div>
              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Business Name</label>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
              </div>
            </div>
          ) : (
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400 mb-4">Your Information</div>
              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
              </div>
            </div>
          )}

          <div className="bg-card border border-white/[.08] rounded-2xl p-5">
            <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400 mb-4">Contact & Location</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5 flex items-center gap-1">Email (private) 🔒</label>
                <input type="email" value={email} disabled className="w-full px-4 py-3 bg-bg2/50 border border-white/10 rounded-lg text-muted2 text-sm outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
              </div>
            </div>
          </div>

          {role === "provider" && (
            <div className="bg-card border border-white/[.08] rounded-2xl p-5">
              <div className="text-xs font-bold tracking-[1px] uppercase text-cyan-400 mb-4">Verification & Licenses</div>

              {isVerified && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3.5 flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-green-400">Business Verified</div>
                    <div className="text-xs text-muted2">Your license has been reviewed and confirmed.</div>
                  </div>
                </div>
              )}

              <label className="block text-xs font-semibold text-muted2 mb-1.5">License Number (optional)</label>
              <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="e.g. CSLB #1234567" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
              {isVerified && <div className="text-[11px] text-amber-400 mt-1.5">Changing this number will require re-verification.</div>}
              {!isVerified && licenseNumber && <div className="text-[11px] text-muted2 mt-1.5">Pending verification</div>}
            </div>
          )}

          <button type="submit" disabled={saving} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 md:left-[72px] bg-amber-400 text-[#1a1206] px-5 py-3 flex items-center justify-center gap-3 z-50 text-sm font-bold">
          ⚠️ You have unsaved changes
        </div>
      )}
    </main>
  );
}
