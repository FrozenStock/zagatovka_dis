"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Upload,
  Save,
  User,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, getLicenseAgreement } from "@/lib/supabase/actions";
import { Profile, LicenseAgreement } from "@/lib/supabase/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LicenseAgreementForm from "./LicenseAgreementForm";
import { Badge } from "@/components/ui/badge";

const profileFormSchema = z.object({
  artistName: z.string().min(2, {
    message: "Имя артиста должно содержать не менее 2 символов",
  }),
  bio: z
    .string()
    .max(500, {
      message: "Биография не должна превышать 500 символов",
    })
    .optional(),
  genre: z.string().optional(),
  email: z.string().email({
    message: "Пожалуйста, введите корректный email",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface SettingsContentProps {
  userId: string;
  profile: Profile;
}

export default function SettingsContent({
  userId,
  profile,
}: SettingsContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile.profile_image_url,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [licenseAgreement, setLicenseAgreement] =
    useState<LicenseAgreement | null>(null);

  // Password update state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Two-factor authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isTwoFactorUpdating, setIsTwoFactorUpdating] = useState(false);

  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteAccountPassword, setDeleteAccountPassword] = useState("");
  const [isAccountDeleting, setIsAccountDeleting] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(
    null,
  );

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    releaseNotifications: true,
    analyticsNotifications: true,
    paymentNotifications: true,
    marketingNotifications: false,
  });
  const [isNotificationUpdating, setIsNotificationUpdating] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(
    null,
  );
  const [notificationSuccess, setNotificationSuccess] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch license agreement
      const agreement = await getLicenseAgreement(userId);
      setLicenseAgreement(agreement);

      // Fetch user metadata for notification preferences
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.user_metadata?.notification_preferences) {
        const prefs = user.user_metadata.notification_preferences;
        setNotificationSettings({
          releaseNotifications: prefs.releases ?? true,
          analyticsNotifications: prefs.analytics ?? true,
          paymentNotifications: prefs.payments ?? true,
          marketingNotifications: prefs.marketing ?? false,
        });
      }

      // Check if 2FA is enabled
      setTwoFactorEnabled(!!user?.user_metadata?.two_factor_enabled);
    };

    fetchUserData();
  }, [userId]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      artistName: profile.artist_name || "",
      bio: profile.bio || "",
      genre: profile.genre || "",
      email: "", // Will be filled from session
    },
  });

  // Password update handler
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Новый пароль должен содержать не менее 8 символов");
      return;
    }

    setIsPasswordUpdating(true);

    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ошибка обновления пароля");
      }

      setPasswordSuccess("Пароль успешно обновлен");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setPasswordError(
        error.message || "Произошла ошибка при обновлении пароля",
      );
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  // Two-factor authentication toggle handler
  const handleToggleTwoFactor = async (enabled: boolean) => {
    setIsTwoFactorUpdating(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { two_factor_enabled: enabled },
      });

      if (error) throw error;

      setTwoFactorEnabled(enabled);

      // Add activity
      await supabase.from("user_activity").insert({
        user_id: userId,
        activity_type: "settings-updated",
        title: enabled
          ? "Двухфакторная аутентификация включена"
          : "Двухфакторная аутентификация отключена",
      });
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      setTwoFactorEnabled(!enabled); // Revert UI state
    } finally {
      setIsTwoFactorUpdating(false);
    }
  };

  // Account deletion handlers
  const handleDeleteAccountClick = () => {
    setShowDeleteConfirm(true);
    setDeleteAccountError(null);
  };

  const handleConfirmDeleteAccount = async () => {
    if (!deleteAccountPassword) return;

    setIsAccountDeleting(true);
    setDeleteAccountError(null);

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: deleteAccountPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ошибка удаления аккаунта");
      }

      // Redirect to home page after successful deletion
      router.push("/");
    } catch (error: any) {
      setDeleteAccountError(
        error.message || "Произошла ошибка при удалении аккаунта",
      );
      setIsAccountDeleting(false);
    }
  };

  // Notification settings handler
  const handleSaveNotificationSettings = async () => {
    setIsNotificationUpdating(true);
    setNotificationError(null);
    setNotificationSuccess(null);

    try {
      const response = await fetch("/api/auth/update-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          releaseNotifications: notificationSettings.releaseNotifications,
          analyticsNotifications: notificationSettings.analyticsNotifications,
          paymentNotifications: notificationSettings.paymentNotifications,
          marketingNotifications: notificationSettings.marketingNotifications,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Ошибка обновления настроек уведомлений",
        );
      }

      setNotificationSuccess("Настройки уведомлений успешно обновлены");
    } catch (error: any) {
      setNotificationError(
        error.message || "Произошла ошибка при обновлении настроек уведомлений",
      );
    } finally {
      setIsNotificationUpdating(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateProfile({
        userId,
        artistName: data.artistName,
        bio: data.bio || null,
        genre: data.genre || null,
        profileImageUrl: avatarUrl,
      });

      if (result) {
        setSuccess(true);
        router.refresh();
      } else {
        setError("Не удалось обновить профиль. Пожалуйста, попробуйте снова.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Произошла ошибка при обновлении профиля.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (
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

      const { error: uploadError, data } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError("Ошибка при загрузке изображения");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки аккаунта</h1>
        <p className="text-muted-foreground mt-1">
          Управляйте своим профилем и настройками аккаунта
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Аккаунт</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Платежи</span>
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Помощь</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Профиль артиста</CardTitle>
              <CardDescription>
                Обновите информацию о себе, которую увидят ваши слушатели
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert variant="success" className="mb-6">
                  <AlertTitle>Успешно!</AlertTitle>
                  <AlertDescription>
                    Ваш профиль был успешно обновлен.
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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={avatarUrl || undefined}
                          alt="Фото профиля"
                        />
                        <AvatarFallback className="text-2xl">
                          {profile.artist_name?.substring(0, 2) || "АР"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-center">
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                            {isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Загрузка...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4" />
                                Загрузить фото
                              </>
                            )}
                          </div>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                            disabled={isUploading}
                          />
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG или GIF. Макс. 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <FormField
                        control={form.control}
                        name="artistName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя артиста</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ваше имя или псевдоним"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Это имя будет отображаться на всех платформах.
                            </FormDescription>
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
                              <Textarea
                                placeholder="Расскажите о себе и своей музыке"
                                className="resize-none min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Максимум 500 символов.
                            </FormDescription>
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите основной жанр" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pop">Поп</SelectItem>
                                <SelectItem value="rock">Рок</SelectItem>
                                <SelectItem value="hip-hop">Хип-хоп</SelectItem>
                                <SelectItem value="electronic">
                                  Электронная
                                </SelectItem>
                                <SelectItem value="classical">
                                  Классическая
                                </SelectItem>
                                <SelectItem value="jazz">Джаз</SelectItem>
                                <SelectItem value="folk">Фолк</SelectItem>
                                <SelectItem value="other">Другое</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Выберите жанр, который лучше всего описывает вашу
                              музыку.
                            </FormDescription>
                            <FormMessage />
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
                          Сохранить изменения
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Настройки аккаунта</CardTitle>
              <CardDescription>
                Управляйте настройками безопасности вашего аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Смена пароля</h3>
                <form onSubmit={handlePasswordUpdate} className="grid gap-4">
                  <div className="grid gap-2">
                    <FormLabel htmlFor="current-password">
                      Текущий пароль
                    </FormLabel>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormLabel htmlFor="new-password">Новый пароль</FormLabel>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormLabel htmlFor="confirm-password">
                      Подтвердите пароль
                    </FormLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="mt-4"
                    disabled={isPasswordUpdating}
                  >
                    {isPasswordUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Обновление...
                      </>
                    ) : (
                      "Обновить пароль"
                    )}
                  </Button>
                </form>
                {passwordError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                {passwordSuccess && (
                  <Alert variant="success" className="mt-4">
                    <AlertTitle>Успешно!</AlertTitle>
                    <AlertDescription>{passwordSuccess}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">
                  Двухфакторная аутентификация
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Защитите свой аккаунт с помощью 2FA
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Добавьте дополнительный уровень безопасности к вашему
                      аккаунту
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={handleToggleTwoFactor}
                    disabled={isTwoFactorUpdating}
                  />
                </div>
                {twoFactorEnabled && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm mb-2">
                      Отсканируйте QR-код с помощью приложения аутентификации:
                    </p>
                    <div className="flex justify-center mb-4">
                      <div className="w-48 h-48 bg-white p-2 rounded-lg">
                        {/* Placeholder for QR code */}
                        <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                          <p className="text-xs text-center text-muted-foreground">
                            QR-код будет доступен в следующей версии
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium text-destructive">
                  Опасная зона
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Удалить аккаунт</p>
                    <p className="text-sm text-muted-foreground">
                      Удаление аккаунта приведет к потере всех данных
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccountClick}
                    disabled={isAccountDeleting}
                  >
                    {isAccountDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Удаление...
                      </>
                    ) : (
                      "Удалить аккаунт"
                    )}
                  </Button>
                </div>
                {showDeleteConfirm && (
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm mb-4 text-destructive font-medium">
                      Для подтверждения удаления введите ваш пароль:
                    </p>
                    <div className="space-y-4">
                      <Input
                        type="password"
                        placeholder="Введите пароль"
                        value={deleteAccountPassword}
                        onChange={(e) =>
                          setDeleteAccountPassword(e.target.value)
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          onClick={handleConfirmDeleteAccount}
                          disabled={!deleteAccountPassword || isAccountDeleting}
                        >
                          Подтвердить удаление
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isAccountDeleting}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {deleteAccountError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{deleteAccountError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <LicenseAgreementForm
            userId={userId}
            existingAgreement={licenseAgreement}
          />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>
                Настройте, какие уведомления вы хотите получать
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email уведомления</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Новые релизы</p>
                      <p className="text-sm text-muted-foreground">
                        Получать уведомления о статусе ваших релизов
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.releaseNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          releaseNotifications: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Аналитика</p>
                      <p className="text-sm text-muted-foreground">
                        Еженедельные отчеты о вашей статистике
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.analyticsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          analyticsNotifications: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Платежи</p>
                      <p className="text-sm text-muted-foreground">
                        Уведомления о платежах и выплатах
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          paymentNotifications: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Маркетинговые сообщения</p>
                      <p className="text-sm text-muted-foreground">
                        Новости и специальные предложения
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          marketingNotifications: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveNotificationSettings}
                disabled={isNotificationUpdating}
              >
                {isNotificationUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  "Сохранить настройки"
                )}
              </Button>
            </CardFooter>
            {notificationError && (
              <div className="px-6 pb-6">
                <Alert variant="destructive">
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{notificationError}</AlertDescription>
                </Alert>
              </div>
            )}
            {notificationSuccess && (
              <div className="px-6 pb-6">
                <Alert variant="success">
                  <AlertTitle>Успешно!</AlertTitle>
                  <AlertDescription>{notificationSuccess}</AlertDescription>
                </Alert>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Платежи и подписка</CardTitle>
              <CardDescription>
                Управляйте вашим тарифным планом и платежной информацией
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Текущий план</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Профессиональный</p>
                      <p className="text-sm text-muted-foreground">
                        400₽ / месяц
                      </p>
                    </div>
                    <Badge>Активен</Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">Включает:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Неограниченные релизы
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Расширенная аналитика
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        95% ставка роялти
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline">Изменить план</Button>
                    <Button variant="destructive">Отменить подписку</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">Способ оплаты</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-background p-2 rounded">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">Visa •••• 4242</p>
                        <p className="text-sm text-muted-foreground">
                          Истекает 12/2025
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Изменить
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">История платежей</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Профессиональный план</p>
                        <p className="text-sm text-muted-foreground">
                          15 мая 2024
                        </p>
                      </div>
                      <p className="font-medium">400₽</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Профессиональный план</p>
                        <p className="text-sm text-muted-foreground">
                          15 апреля 2024
                        </p>
                      </div>
                      <p className="font-medium">400₽</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Профессиональный план</p>
                        <p className="text-sm text-muted-foreground">
                          15 марта 2024
                        </p>
                      </div>
                      <p className="font-medium">400₽</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="mt-6">
          <Card className="dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Центр помощи</CardTitle>
              <CardDescription>
                Получите ответы на ваши вопросы и поддержку
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Часто задаваемые вопросы
                </h3>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium">Как загрузить новый релиз?</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Перейдите в раздел "Релизы" и нажмите кнопку "Новый
                      релиз". Заполните необходимую информацию и загрузите
                      файлы.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium">Как получить выплаты?</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Выплаты производятся автоматически каждый месяц на
                      указанные вами реквизиты в разделе "Платежи".
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium">
                      Как изменить информацию о профиле?
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Вы можете изменить информацию о профиле в разделе
                      "Профиль" настроек аккаунта.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-medium">Связаться с поддержкой</h3>
                <p className="text-muted-foreground">
                  Если у вас возникли вопросы или проблемы, свяжитесь с нашей
                  службой поддержки.
                </p>
                <Button>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Написать в поддержку
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
