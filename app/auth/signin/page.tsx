'use client';
import { LoginForm } from '@/components';

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="glass-light dark:glass-dark rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
