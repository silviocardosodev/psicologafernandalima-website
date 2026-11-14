"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { login, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

const inputClass =
  "mt-1.5 h-12 w-full rounded-2xl border border-line-control bg-white px-4 text-[16px] text-ink hover:border-line-hover focus:border-primary focus:shadow-focus focus:outline-none";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-ink">
          E-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Senha
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>
      {state.error && (
        <p role="alert" className="rounded-2xl bg-danger-bg px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={pending} className="w-full">
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
        Entrar
      </Button>
    </form>
  );
}
