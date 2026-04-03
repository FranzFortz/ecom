// src/features/info/components/ContactForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

type Form = { name: string; email: string; message: string };

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>();

  function onSubmit(data: Form) {
    console.info("Contact demo (no backend):", data);
    setSent(true);
    reset();
  }

  if (sent) {
    return (
      <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        Thanks — your message was recorded in the browser only (demo). No email
        was sent.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        {...register("name", { required: "Required" })}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register("email", { required: "Required" })}
        error={errors.email?.message}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-stone-800">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          {...register("message", { required: "Required" })}
        />
        {errors.message ? (
          <p className="text-sm text-red-600">{errors.message.message}</p>
        ) : null}
      </div>
      <Button type="submit">Send message</Button>
    </form>
  );
}
