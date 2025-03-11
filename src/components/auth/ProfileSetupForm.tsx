import React, { useState, useEffect } from "react";
import { Upload, Music, Link as LinkIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ProfileSetupFormProps {
  onSubmit?: (data: ProfileFormData) => void;
  isLoading?: boolean;
}

interface ProfileFormData {
  artistName: string;
  bio: string;
  profileImage: File | null;
  profileImageUrl: string | null;
  genre: string;
  socialLinks: {
    spotify: string;
    instagram: string;
    twitter: string;
  };
}

const ProfileSetupForm = ({
  onSubmit = () => {},
  isLoading = false,
}: ProfileSetupFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    artistName: "",
    bio: "",
    profileImage: null,
    profileImageUrl: null,
    genre: "",
    socialLinks: {
      spotify: "",
      instagram: "",
      twitter: "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, profileImageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-background border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Заполните профиль артиста
        </CardTitle>
        <CardDescription>
          Настройте свой профиль, чтобы помочь фанатам найти вашу музыку
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="artistName">Имя артиста</Label>
            <Input
              id="artistName"
              name="artistName"
              placeholder="Ваш сценический псевдоним или название группы"
              value={formData.artistName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Биография</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Расскажите о себе и своей музыке"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileImage">Фото профиля</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() =>
                    document.getElementById("profileImage")?.click()
                  }
                >
                  <Upload className="w-4 h-4" />
                  Загрузить изображение
                </Button>
                <Input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Рекомендуется: квадратный JPG или PNG, не менее 500x500px
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Основной жанр</Label>
            <Select
              value={formData.genre}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, genre: value }))
              }
            >
              <SelectTrigger id="genre">
                <SelectValue placeholder="Выберите жанр" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="hiphop">Hip Hop</SelectItem>
                <SelectItem value="rnb">R&B</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="classical">Classical</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="folk">Folk</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Ссылки на соцсети</Label>

            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
              <Input
                name="spotify"
                placeholder="Ссылка на профиль Spotify"
                value={formData.socialLinks.spotify}
                onChange={handleSocialLinkChange}
              />
            </div>

            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
              <Input
                name="instagram"
                placeholder="Ссылка на профиль Instagram"
                value={formData.socialLinks.instagram}
                onChange={handleSocialLinkChange}
              />
            </div>

            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
              <Input
                name="twitter"
                placeholder="Ссылка на профиль Twitter/X"
                value={formData.socialLinks.twitter}
                onChange={handleSocialLinkChange}
              />
            </div>
          </div>

          <CardFooter className="px-0 pt-4 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Завершить настройку"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSetupForm;
