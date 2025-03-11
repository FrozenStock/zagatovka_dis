"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProfileFormData } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileSetupFormProps {
  onSubmit: (data: ProfileFormData) => Promise<void>;
}

const profileSchema = z.object({
  fullName: z.string().min(2, "Минимальная длина имени 2 символа"),
  username: z.string().min(3, "Минимальная длина имени пользователя 3 символа"),
  bio: z.string().max(500, "Максимальная длина био 500 символов"),
  socialLinks: z.object({
    spotify: z.string().url().or(z.string().length(0)),
    instagram: z.string().url().or(z.string().length(0)),
    twitter: z.string().url().or(z.string().length(0)),
  }),
});

export default function ProfileSetupForm({ onSubmit }: ProfileSetupFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      username: "",
      bio: "",
      socialLinks: {
        spotify: "",
        instagram: "",
        twitter: "",
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields implementation */}
      </form>
    </Form>
  );
}
