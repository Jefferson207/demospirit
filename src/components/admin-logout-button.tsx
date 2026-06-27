"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <Button type="button" variant="ghost" onClick={logout}>
      <LogOut className="size-4" />
      Cerrar sesion
    </Button>
  );
}
