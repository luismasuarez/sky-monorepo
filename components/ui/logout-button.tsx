
"use client";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/signin" });
  };
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleLogout}
    >
      <IconLogout className="w-5 h-5" />
      Cerrar sesión
    </Button>
  );
}
