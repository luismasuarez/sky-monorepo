import React, { useState } from "react";
import { AccountType, PlanType } from "../../auth/types";

const RegisterForm: React.FC = () => {
  const [accountType, setAccountType] = useState<AccountType | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: any = {
        accountType,
        name,
        email,
        plan: PlanType.FREE,
      };
      if (accountType === AccountType.ORGANIZATION) {
        payload.organizationName = organizationName;
      }
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en el registro");
      window.location.href = data.redirect;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Registro</h2>
      <label className="block mb-2 font-medium">Tipo de cuenta</label>
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          className={`px-4 py-2 rounded border ${accountType === AccountType.ORGANIZATION ? "bg-blue-100" : ""}`}
          onClick={() => setAccountType(AccountType.ORGANIZATION)}
        >
          Organización/Equipo
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded border ${accountType === AccountType.FREELANCER ? "bg-blue-100" : ""}`}
          onClick={() => setAccountType(AccountType.FREELANCER)}
        >
          Freelancer
        </button>
      </div>
      <label className="block mb-2 font-medium">Nombre {accountType === AccountType.ORGANIZATION ? "del responsable" : "completo"}</label>
      <input
        type="text"
        className="w-full mb-4 p-2 border rounded"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <label className="block mb-2 font-medium">Email</label>
      <input
        type="email"
        className="w-full mb-4 p-2 border rounded"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      {accountType === AccountType.ORGANIZATION && (
        <>
          <label className="block mb-2 font-medium">Nombre de la organización</label>
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded"
            value={organizationName}
            onChange={e => setOrganizationName(e.target.value)}
            required
          />
        </>
      )}
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded font-semibold"
        disabled={loading}
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </form>
  );
};

export default RegisterForm;
