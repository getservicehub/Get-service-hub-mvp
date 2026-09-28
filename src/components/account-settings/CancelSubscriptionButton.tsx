'use client';

import { useState } from 'react';

// Coloca este componente en tu página de Account Settings.
// AJUSTAR: el endpoint asume que tienes una sesión de Supabase Auth activa
// (usa las cookies/headers que ya manejes en tus otras llamadas a /api).

interface CancelSubscriptionButtonProps {
  currentPlan: string; // ej. "plus"
  onCancelled?: () => void;
}

export default function CancelSubscriptionButton({ currentPlan, onCancelled }: CancelSubscriptionButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (currentPlan === 'free') return null; // nada que cancelar

  async function handleCancel() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/account/cancel-subscription', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo cancelar la suscripción.');
      }
      onCancelled?.();
      setConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    } finally {
      setLoading(false);
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-red-600 hover:underline"
      >
        Cancelar suscripción
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <p className="text-sm text-gray-700">
        Tu suscripción se cancelará al final de tu periodo de facturación actual. No se te
        cobrará de nuevo. Tu cuenta y tu historial en GetServiHub se mantienen — solo vuelves
        al plan gratuito.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="bg-red-600 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Cancelando...' : 'Sí, cancelar'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="text-sm text-gray-600 px-4 py-2"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
