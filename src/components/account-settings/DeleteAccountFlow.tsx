'use client';

import { useState } from 'react';

// Coloca este componente en Account Settings, separado visualmente del botón
// de cancelar suscripción (son dos acciones distintas, no las mezcles en UI).

export default function DeleteAccountFlow() {
  const [step, setStep] = useState<'idle' | 'explain' | 'confirm' | 'done'>('idle');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo procesar la eliminación.');
      }
      setStep('done');
      // Redirigir a logout / home después de unos segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'idle') {
    return (
      <button onClick={() => setStep('explain')} className="text-sm text-red-700 hover:underline">
        Eliminar mi cuenta
      </button>
    );
  }

  if (step === 'explain') {
    return (
      <div className="border border-red-200 rounded-lg p-4 space-y-3 bg-red-50">
        <p className="text-sm text-gray-800 font-medium">Esto es permanente. Antes de continuar:</p>
        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li>Tu información personal (nombre, contacto, perfil) se elimina.</li>
          <li>Cualquier suscripción activa se cancela automáticamente.</li>
          <li>
            Si completaste trabajos verificados en la plataforma, ese historial se conserva de
            forma anonimizada (sin tu información personal) porque otros usuarios dependen de
            esa señal de confianza.
          </li>
          <li>Procesamos tu solicitud dentro de los plazos descritos en nuestra Privacy Policy.</li>
        </ul>
        <div className="flex gap-3">
          <button
            onClick={() => setStep('confirm')}
            className="bg-red-700 text-white text-sm px-4 py-2 rounded"
          >
            Entiendo, continuar
          </button>
          <button onClick={() => setStep('idle')} className="text-sm text-gray-600 px-4 py-2">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="border border-red-200 rounded-lg p-4 space-y-3 bg-red-50">
        <label className="text-sm text-gray-700 block">
          Confirma tu contraseña para verificar tu identidad:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 text-sm"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading || !password}
            className="bg-red-700 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Eliminando...' : 'Eliminar mi cuenta permanentemente'}
          </button>
          <button onClick={() => setStep('idle')} disabled={loading} className="text-sm text-gray-600 px-4 py-2">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <p className="text-sm text-green-700">
      Tu cuenta fue eliminada. Te enviamos un correo de confirmación. Redirigiendo...
    </p>
  );
}
