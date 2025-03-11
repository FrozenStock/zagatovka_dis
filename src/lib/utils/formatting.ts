export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ru-RU').format(num);
};

export const getPlatformColor = (platform: string): string => {
  const colorMap = {
    'Spotify': 'bg-green-500',
    'Apple Music': 'bg-pink-500',
    'YouTube Music': 'bg-red-500'
  } as const;
  
  return colorMap[platform as keyof typeof colorMap] || 'bg-blue-500';
};