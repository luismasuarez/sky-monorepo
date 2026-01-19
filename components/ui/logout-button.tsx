"use client";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
    >
      <IconLogout className="w-5 h-5" />
      Cerrar sesión
    </Button>
  );
}
