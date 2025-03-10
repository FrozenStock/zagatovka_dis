"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { createRelease } from "@/lib/supabase/actions";
import { Loader2, Upload, Music, Calendar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const releaseFormSchema = z.object({
  title: z.string().min(2, {
    message: "Название релиза должно содержать не менее 2 символов",
  }),
  releaseDate: z.string().min(1, {
    message: "Пожалуйста, выберите дату релиза",
  }),
  status: z.string(),
  genre: z.string().optional(),
  description: z
    .string()
    .max(1000, {
      message: "Описание не должно превышать 1000 символов",
    })
    .optional(),
  releaseType: z.string().optional(),
});

type ReleaseFormValues = z.infer<typeof releaseFormSchema>;

interface NewReleaseFormProps {
  userId: string;
}

export default function NewReleaseForm({ userId }: NewReleaseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverArtUrl, setCoverArtUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ReleaseFormValues>({
    resolver: zodResolver(releaseFormSchema),
    defaultValues: {
      title: "",
      releaseDate: new Date().toISOString().split("T")[0],
      status: "draft",
      genre: "",
      description: "",
      releaseType: "single",
    },
  });

  const onSubmit = async (data: ReleaseFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const release = await createRelease({
        userId,
        title: data.title,
        releaseDate: data.releaseDate,
        status: data.status,
        genre: data.genre,
        description: data.description,
        releaseType: data.releaseType,
        coverArtUrl: coverArtUrl,
      });

      if (release) {
        router.push(`/dashboard/releases`);
      } else {
        setError("Не удалось создать релиз. Пожалуйста, попробуйте снова.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error creating release:", err);
      setError("Произошла ошибка при создании релиза.");
      setIsLoading(false);
    }
  };

  const handleCoverArtUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();

      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("release-artwork")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("release-artwork").getPublicUrl(filePath);

      setCoverArtUrl(publicUrl);
    } catch (error) {
      console.error("Error uploading cover art:", error);
      setError("Ошибка при загрузке обложки");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Создать новый релиз</h1>
        <p className="text-muted-foreground mt-1">
          Заполните информацию о вашем новом релизе
        </p>
      </div>

      <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Информация о релизе</CardTitle>
          <CardDescription>
            Введите основные данные о вашем релизе
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
                  <div className="w-full aspect-square bg-muted rounded-md overflow-hidden relative flex items-center justify-center">
                    {coverArtUrl ? (
                      <img
                        src={coverArtUrl}
                        alt="Cover Art"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <label
                      htmlFor="cover-art-upload"
                      className="cursor-pointer w-full"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Загрузка...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Загрузить обложку
                          </>
                        )}
                      </Button>
                      <input
                        id="cover-art-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverArtUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Рекомендуемый размер: 3000x3000 пикселей, JPG или PNG
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название релиза</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Введите название релиза"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Название вашего альбома, EP или сингла
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="releaseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тип релиза</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип релиза" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Сингл</SelectItem>
                              <SelectItem value="ep">EP</SelectItem>
                              <SelectItem value="album">Альбом</SelectItem>
                              <SelectItem value="compilation">
                                Сборник
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Жанр</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите жанр" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pop">Поп</SelectItem>
                              <SelectItem value="rock">Рок</SelectItem>
                              <SelectItem value="hip-hop">Хип-хоп</SelectItem>
                              <SelectItem value="electronic">
                                Электронная
                              </SelectItem>
                              <SelectItem value="rnb">R&B</SelectItem>
                              <SelectItem value="jazz">Джаз</SelectItem>
                              <SelectItem value="classical">
                                Классическая
                              </SelectItem>
                              <SelectItem value="folk">Фолк</SelectItem>
                              <SelectItem value="metal">Метал</SelectItem>
                              <SelectItem value="reggae">Регги</SelectItem>
                              <SelectItem value="country">Кантри</SelectItem>
                              <SelectItem value="blues">Блюз</SelectItem>
                              <SelectItem value="other">Другое</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дата релиза</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="date" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Когда вы хотите выпустить этот релиз
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание релиза</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Расскажите о вашем релизе"
                            className="resize-none min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Информация о релизе, которая будет отображаться на
                          стриминговых платформах
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Статус релиза</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите статус релиза" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Черновик</SelectItem>
                            <SelectItem value="scheduled">
                              Запланирован
                            </SelectItem>
                            <SelectItem value="published">
                              Опубликован
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Статус определяет видимость вашего релиза
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/releases")}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    "Создать релиз"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
