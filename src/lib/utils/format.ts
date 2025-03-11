import { Release, BadgeVariant } from "@/types/releases";

export const getStatusLabel = (status: Release['status']): string => {
  const statusMap: Record<Release['status'], string> = {
    published: "Опубликован",
    scheduled: "Запланирован",
    rejected: "Отклонен",
    draft: "Черновик"
  };
  return statusMap[status];
};

export const getStatusVariant = (status: Release['status']): BadgeVariant => {
  const variantMap: Record<Release['status'], BadgeVariant> = {
    published: "default",
    scheduled: "outline",
    rejected: "destructive",
    draft: "secondary"
  };
  return variantMap[status];
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};