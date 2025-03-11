export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

export const getStatusLabel = (status: Release['status']): string => {
  const statusMap = {
    published: "Опубликован",
    scheduled: "Запланирован",
    rejected: "Отклонен",
    draft: "Черновик"
  };
  return statusMap[status] || status;
};

export const getStatusVariant = (status: Release['status']): string => {
  const variantMap = {
    published: "default",
    scheduled: "outline",
    rejected: "secondary",
    draft: "secondary"
  };
  return variantMap[status] || "secondary";
};