// Colocar en: src/app/delete-account/page.tsx
//
// Esta página pública cumple el requisito de Google Play (link web que funcione
// SIN tener la cuenta iniciada ni la app instalada) y también sirve como canal
// adicional para CCPA. Usa confirmación por correo porque no hay sesión iniciada
// — nunca proceses un delete solo con un email escrito en un formulario público,
// cualquiera podría escribir el correo de otra persona.

'use client';

import { useState } from 'react';

export default function DeleteAccountRequestPage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/account/delete-request-public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Error al enviar la solicitud.');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    }
  }

  if (submitted) {
    return (
      <main className="max-w-md mx-auto py-16 px-4">
        <h1 className="text-xl font-semibold mb-4">Solicitud recibida</h1>
        <p className="text-gray-700">
          Si ese correo corresponde a una cuenta de GetServiHub, te enviamos un enlace para
          confirmar la eliminación. Revisa tu bandeja de entrada (y spam).
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-xl font-semibold mb-2">Eliminar mi cuenta de GetServiHub</h1>
      <p className="text-gray-600 text-sm mb-6">
        Usa esta página si no tienes acceso a la app o quieres solicitar la eliminación de tu
        cuenta sin iniciar sesión.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm">
          Correo de tu cuenta
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Motivo (opcional)
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="bg-red-700 text-white text-sm px-4 py-2 rounded">
          Solicitar eliminación
        </button>
      </form>
    </main>
  );
}
