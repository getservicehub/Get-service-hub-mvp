"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [city, setCity] = useState("San Diego");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

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

    const { data } = await supabase
      .from("profiles")
      .select("role, full_name, business_name, service_type, phone, city, avatar_url, license_number, is_verified")
      .eq("id", user.id)
      .single();

    if (data) {
      setRole(data.role || "");
      setFullName(data.full_name || "");
      setBusinessName(data.business_name || "");
      setServiceType(data.service_type || "");
      setPhone(data.phone || "");
      setLicenseNumber(data.license_number || "");
      setIsVerified(data.is_verified || false);
      setCity(data.city || "San Diego");
      setCurrentAvatarUrl(data.avatar_url);
    }

    setPageLoading(false);
  };const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in");
      setSaving(false);
      return;
    }

    let avatarUrl = currentAvatarUrl;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `avatars/${user.id}-${Date.now()}.${fileExt}`;

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
        service_type: role === "provider" ? serviceType : null,
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

    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };if (pageLoading) {
    return (
      <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
        <div className="max-w-[500px] mx-auto text-muted2 text-sm">Loading account...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[500px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">My Account</div>
        <h1 className="text-3xl font-extrabold mb-8">Edit Profile</h1>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}
        {saved && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg p-3 mb-4">Profile updated successfully</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-card border border-white/[.08] flex items-center justify-center text-3xl flex-shrink-0">
              {avatarPreview && <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />}
              {!avatarPreview && currentAvatarUrl && <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />}
              {!avatarPreview && !currentAvatarUrl && <span>👤</span>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted2 mb-1.5">Profile Photo</label>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} className="text-xs text-muted2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Email</label>
            <input type="email" value={email} disabled className="w-full px-4 py-3 bg-white/[.03] border border-white/10 rounded-lg text-muted2 text-sm outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Full Name</label>
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="6195551234" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted2 mb-1.5">City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
          </div>

          {role === "provider" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Business Name</label>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">Service Type</label>
                <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted2 mb-1.5">License Number (optional)</label>
                <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="e.g. CSLB #1234567" className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400" />
                {isVerified && <div className="text-[11px] text-green-400 font-bold mt-1.5">✓ Verified</div>}
                {!isVerified && licenseNumber && <div className="text-[11px] text-muted2 mt-1.5">Pending verification</div>}
              </div>
            </>
          )}

          <button type="submit" disabled={saving} className="w-full py-3.5 rounded-lg gradient-bg text-white font-bold text-sm disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}