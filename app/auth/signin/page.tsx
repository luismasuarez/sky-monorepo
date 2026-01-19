"use client";
import { LoginForm } from "@/components/auth/login-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ mode: "onBlur" });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (result?.error) {
        setLoginError(result.error);
      } else if (result?.ok) {
        router.replace("/");
      } else {
        setLoginError("Error al iniciar sesión");
      }
    } catch (err) {
      setLoginError("Error inesperado al iniciar sesión");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      <LoginForm />
    </div>
  );
}
