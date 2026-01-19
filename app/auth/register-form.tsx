
'use client';
import { registerUser } from './actions';
import { useState } from 'react';

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    setSuccess(null);
    const result = await registerUser(formData);
    if (result?.error) setError(result.error);
    else setSuccess('Registro exitoso.');
  }

  return (
    <form action={action} className="space-y-4 max-w-sm mx-auto">
      <input name="fullName" placeholder="Nombre completo" className="input input-bordered w-full" required />
      <input name="email" type="email" placeholder="Email" className="input input-bordered w-full" required />
      <input name="password" type="password" placeholder="Contraseña" className="input input-bordered w-full" required />
      <button type="submit" className="btn btn-primary w-full">Registrarse</button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
    </form>
  );
}
