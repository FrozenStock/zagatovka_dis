import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileData } from '@/types/auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const profileSchema = z.object({
  fullName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  username: z.string().min(3, "Имя пользователя должно содержать минимум 3 символа"),
  bio: z.string().max(500, "Биография не может быть длиннее 500 символов"),
  socialLinks: z.object({
    spotify: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }).optional(),
});

interface ProfileSetupFormProps {
  onSubmit: (data: ProfileData) => Promise<void>;
  isLoading?: boolean;
}

export default function ProfileSetupForm({ onSubmit, isLoading = false }: ProfileSetupFormProps) {
  const form = useForm<ProfileData>({
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

  const handleSubmit = async (data: ProfileData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Полное имя</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>О себе</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="socialLinks.spotify"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spotify</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://spotify.com/..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="socialLinks.instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://instagram.com/..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="socialLinks.twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://twitter.com/..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Сохранение..." : "Сохранить профиль"}
        </Button>
      </form>
    </Form>
  );
}
