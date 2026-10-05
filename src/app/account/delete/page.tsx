"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const COPY = {
  en: {
    title: "Delete your account",
    intro:
      "This permanently removes your profile details, listings, posts, favorites, follows and notifications. Reviews and messages from your account may be kept without your name, as described in our Privacy Policy. This cannot be undone.",
    signedOut: "Sign in to delete your account.",
    signIn: "Sign in",
    password: "Confirm with your password",
    confirm: "I understand this cannot be undone.",
    submit: "Delete my account permanently",
    working: "Deleting...",
    wrong: "That password is not correct. Nothing was deleted.",
    admin: "Admin accounts cannot be deleted here. Write to support@getservihub.com.",
    generic:
      "Something went wrong and nothing was deleted. Please try again or write to support@getservihub.com.",
    doneTitle: "Your account has been deleted",
    doneBody: "You have been signed out. If you have questions, write to support@getservihub.com.",
    home: "Back to home",
    email: "Prefer email? Write to support@getservihub.com.",
  },
  es: {
    title: "Eliminar tu cuenta",
    intro:
      "Esto elimina de forma permanente los datos de tu perfil, tus publicaciones, favoritos, seguidos y notificaciones. Las reseñas y mensajes de tu cuenta pueden conservarse sin tu nombre, como explica nuestra Política de privacidad. No se puede deshacer.",
    signedOut: "Inicia sesión para eliminar tu cuenta.",
    signIn: "Iniciar sesión",
    password: "Confirma con tu contraseña",
    confirm: "Entiendo que esto no se puede deshacer.",
    submit: "Eliminar mi cuenta definitivamente",
    working: "Eliminando...",
    wrong: "Esa contraseña no es correcta. No se eliminó nada.",
    admin: "Las cuentas de administrador no se pueden eliminar aquí. Escribe a support@getservihub.com.",
    generic:
      "Algo salió mal y no se eliminó nada. Inténtalo de nuevo o escribe a support@getservihub.com.",
    doneTitle: "Tu cuenta fue eliminada",
    doneBody: "Cerramos tu sesión. Si tienes preguntas, escribe a support@getservihub.com.",
    home: "Volver al inicio",
    email: "¿Prefieres correo? Escribe a support@getservihub.com.",
  },
} as const;

type Status = "idle" | "working" | "done" | "error";
type ErrorKind = "wrong" | "admin" | "generic";

export default function DeleteAccountPage() {
  const { language } = useLanguage();
  const c = COPY[language === "es" ? "es" : "en"];
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setSignedIn(Boolean(data.user)));
  }, []);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmed || !password) return;
    setStatus("working");
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_my_account", { p_password: password });
    if (error) {
      setErrorKind(
        error.message.includes("wrong-password")
          ? "wrong"
          : error.message.includes("admin-account")
            ? "admin"
            : "generic"
      );
      setStatus("error");
      return;
    }
    await supabase.auth.signOut();
    setStatus("done");
  }

  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[520px] mx-auto">
        {status === "done" ? (
          <div className="text-center">
            <h1 className="text-2xl font-extrabold mb-3">{c.doneTitle}</h1>
            <p className="text-sm text-muted2 mb-6">{c.doneBody}</p>
            <Link href="/" className="text-cyan-400 font-semibold hover:underline">{c.home}</Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold mb-3">{c.title}</h1>
            <p className="text-sm text-muted2 leading-relaxed mb-8">{c.intro}</p>

            {signedIn === false ? (
              <p className="text-sm">
                {c.signedOut}{" "}
                <Link href="/login" className="text-cyan-400 font-semibold hover:underline">{c.signIn}</Link>
              </p>
            ) : (
              <form onSubmit={handleDelete} className="space-y-4">
                <div>
                  <label htmlFor="del-password" className="block text-xs font-semibold text-muted2 mb-1.5">{c.password}</label>
                  <input
                    id="del-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-bg2 border border-white/20 rounded-lg text-white text-sm outline-none focus:border-cyan-400"
                  />
                </div>

                <label className="flex items-start gap-2 text-xs text-muted2">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 w-4 h-4 flex-shrink-0" />
                  <span>{c.confirm}</span>
                </label>

                {status === "error" && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3">{c[errorKind]}</div>
                )}

                <button
                  type="submit"
                  disabled={status === "working" || !confirmed || !password || signedIn === null}
                  className="w-full py-3.5 rounded-lg bg-red-600 text-white font-bold text-sm disabled:opacity-50"
                >
                  {status === "working" ? c.working : c.submit}
                </button>

                <p className="text-xs text-muted2 text-center pt-2">{c.email}</p>
              </form>
            )}
          </>
        )}
      </div>
    </main>
  );
}
