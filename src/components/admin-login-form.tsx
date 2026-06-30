"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, LogIn, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "No se pudo iniciar sesion.");

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-2 text-sm font-bold text-obsidian">
        Usuario
        <span className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-charcoal/45" />
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="pl-11"
            autoComplete="username"
            autoFocus
            required
          />
        </span>
      </label>

      <label className="grid gap-2 text-sm font-bold text-obsidian">
        Contrasena
        <span className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-charcoal/45" />
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="pl-11"
            autoComplete="current-password"
            required
          />
        </span>
      </label>

      {message && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{message}</p>}

      <Button type="submit" variant="gold" disabled={loading} className="mt-1 w-full">
        <LogIn className="size-4" />
        {loading ? "Ingresando..." : "Ingresar al administrador"}
      </Button>
    </form>
  );
}
