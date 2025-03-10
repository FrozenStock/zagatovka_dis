import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Ошибка аутентификации
          </CardTitle>
          <CardDescription>
            Возникла проблема с вашим запросом аутентификации.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Это может быть связано с истекшей или недействительной ссылкой, или
            с техническими проблемами в нашей службе аутентификации.
          </p>

          <div className="space-y-2">
            <p className="font-medium">Что вы можете сделать:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Попробуйте войти снова</li>
              <li>Очистите куки браузера и попробуйте снова</li>
              <li>
                Если вы сбрасывали пароль, запросите новую ссылку для сброса
              </li>
              <li>
                Обратитесь в службу поддержки, если проблема не устраняется
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild className="flex-1">
              <Link href="/login">Вернуться к входу</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">На главную страницу</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
