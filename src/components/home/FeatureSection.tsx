import React from "react";
import { motion } from "framer-motion";
import { Music, Upload, BarChart, CreditCard } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({
  icon = <Music className="h-10 w-10 text-primary" />,
  title = "Feature Title",
  description = "Feature description goes here.",
}: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg overflow-hidden">
        <CardHeader>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Узнать больше
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface FeatureSectionProps {
  title?: string;
  subtitle?: string;
  features?: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

const FeatureSection = ({
  title = "Почему стоит выбрать нашу платформу",
  subtitle = "Всё необходимое для распространения вашей музыки и роста аудитории",
  features = [
    {
      icon: <Upload className="h-10 w-10 text-primary" />,
      title: "Простое управление релизами",
      description:
        "Загружайте музыку, добавляйте метаданные и распространяйте на все основные стриминговые платформы всего в несколько кликов.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Комплексная аналитика",
      description:
        "Отслеживайте свои показатели с помощью подробной статистики прослушиваний, демографии аудитории и отчетов о доходах.",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Прозрачные платежи",
      description:
        "Получайте свои гонорары быстро благодаря нашей прозрачной платежной системе и подробной разбивке доходов.",
    },
    {
      icon: <Music className="h-10 w-10 text-primary" />,
      title: "Глобальная дистрибуция",
      description:
        "Охватите поклонников по всему миру с дистрибуцией на более чем 150 стриминговых сервисах и цифровых музыкальных магазинах.",
    },
  ],
}: FeatureSectionProps) => {
  return (
    <section className="w-full bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight">{title}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="px-8">
            Начните сегодня
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
