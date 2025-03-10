"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, Save, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LicenseAgreement } from "@/lib/supabase/types";

const licenseFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "ФИО должно содержать не менее 2 символов",
  }),
  address: z.string().min(5, {
    message: "Адрес должен содержать не менее 5 символов",
  }),
  passportNumber: z.string().min(6, {
    message: "Номер паспорта должен содержать не менее 6 символов",
  }),
  bankDetails: z.string().optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "Вы должны согласиться с условиями лицензионного соглашения",
  }),
});

type LicenseFormValues = z.infer<typeof licenseFormSchema>;

interface LicenseAgreementFormProps {
  userId: string;
  existingAgreement?: LicenseAgreement | null;
}

export default function LicenseAgreementForm({
  userId,
  existingAgreement = null,
}: LicenseAgreementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(
    existingAgreement?.signature_url || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: {
      fullName: existingAgreement?.full_name || "",
      address: existingAgreement?.address || "",
      passportNumber: existingAgreement?.passport_number || "",
      bankDetails: existingAgreement?.bank_details || "",
      agreedToTerms: existingAgreement?.agreed_to_terms || false,
    },
  });

  const onSubmit = async (data: LicenseFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();

      const licenseData = {
        user_id: userId,
        full_name: data.fullName,
        address: data.address,
        passport_number: data.passportNumber,
        bank_details: data.bankDetails || null,
        signature_url: signatureUrl,
        agreed_to_terms: data.agreedToTerms,
        updated_at: new Date().toISOString(),
      };

      let result;

      if (existingAgreement) {
        // Update existing agreement
        const { error: updateError } = await supabase
          .from("license_agreements")
          .update(licenseData)
          .eq("id", existingAgreement.id);

        if (updateError) throw updateError;
        result = true;
      } else {
        // Create new agreement
        const { error: insertError } = await supabase
          .from("license_agreements")
          .insert(licenseData);

        if (insertError) throw insertError;
        result = true;
      }

      if (result) {
        setSuccess(true);
        // Add activity
        await supabase.from("user_activity").insert({
          user_id: userId,
          activity_type: "license-agreement",
          title: existingAgreement
            ? "Обновлен лицензионный договор"
            : "Заполнен лицензионный договор",
        });
      }
    } catch (err) {
      console.error("Error saving license agreement:", err);
      setError("Произошла ошибка при сохранении лицензионного договора.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignatureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();

      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/signature-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("signatures")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("signatures").getPublicUrl(filePath);

      setSignatureUrl(publicUrl);
    } catch (error) {
      console.error("Error uploading signature:", error);
      setError("Ошибка при загрузке подписи");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Лицензионный договор</CardTitle>
        <CardDescription>
          Заполните данные для лицензионного договора с нашим сервисом
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert variant="success" className="mb-6">
            <AlertTitle>Успешно!</AlertTitle>
            <AlertDescription>
              Лицензионный договор был успешно{" "}
              {existingAgreement ? "обновлен" : "сохранен"}.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ФИО полностью</FormLabel>
                      <FormControl>
                        <Input placeholder="Иванов Иван Иванович" {...field} />
                      </FormControl>
                      <FormDescription>
                        Укажите ваше полное имя как в паспорте
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passportNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Серия и номер паспорта</FormLabel>
                      <FormControl>
                        <Input placeholder="1234 567890" {...field} />
                      </FormControl>
                      <FormDescription>
                        Укажите серию и номер вашего паспорта
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Адрес регистрации</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Укажите ваш полный адрес регистрации
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="bankDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Банковские реквизиты (необязательно)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Номер карты или банковского счета"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Укажите реквизиты для получения выплат
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Подпись</FormLabel>
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                    {signatureUrl ? (
                      <div className="mb-4">
                        <img
                          src={signatureUrl}
                          alt="Ваша подпись"
                          className="max-h-24 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 h-24 w-full flex items-center justify-center border-2 border-dashed rounded-md">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <label
                      htmlFor="signature-upload"
                      className="cursor-pointer"
                    >
                      <Button
                        type="button"
                        variant="outline"
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
                            {signatureUrl
                              ? "Обновить подпись"
                              : "Загрузить подпись"}
                          </>
                        )}
                      </Button>
                      <input
                        id="signature-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSignatureUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <FormDescription className="text-center mt-2">
                      Загрузите изображение вашей подписи (JPG, PNG)
                    </FormDescription>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="agreedToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Я согласен с условиями лицензионного договора
                        </FormLabel>
                        <FormDescription>
                          Нажимая на эту кнопку, вы подтверждаете, что
                          ознакомились и согласны с условиями лицензионного
                          договора.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Сохранить договор
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
