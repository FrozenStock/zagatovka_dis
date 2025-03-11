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
  artistName: z.string().min(2, 'Минимальная длина имени 2 символа'),
  bio: z.string().max(500, 'Максимальная длина био 500 символов'),
  profileImage: z.any().nullable(),
  genre: z.string().min(1, 'Выберите жанр'),
  socialLinks: z.object({
    spotify: z.string().url('Введите корректный URL').or(z.string().length(0)),
    instagram: z.string().url('Введите корректный URL').or(z.string().length(0)),
    twitter: z.string().url('Введите корректный URL').or(z.string().length(0)),
  }),
});

interface ProfileSetupFormProps {
  onSubmit: (data: ProfileData) => Promise<void>;
  isLoading?: boolean;
}

export default function ProfileSetupForm({ onSubmit, isLoading = false }: ProfileSetupFormProps) {
  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      artistName: '',
      bio: '',
      profileImage: null,
      genre: '',
      socialLinks: {
        spotify: '',
        instagram: '',
        twitter: '',
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
          name="artistName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя артиста</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ваше сценическое имя" />
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
              <FormLabel>Биография</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Расскажите о себе" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profileImage"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Фото профиля</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files?.[0] || null)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Основной жанр</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Например: Hip-Hop" />
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
