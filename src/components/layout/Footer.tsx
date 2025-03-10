import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Music,
  Mail,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface FooterProps {
  showFullFooter?: boolean;
}

const Footer = ({ showFullFooter = true }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="container mx-auto px-4 py-8">
        {showFullFooter && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Дистрибуция музыки</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/features"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Возможности
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Цены
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/platforms"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Поддерживаемые платформы
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/success-stories"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Истории успеха
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Ресурсы</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/blog"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Блог
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/help-center"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Центр поддержки
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guides"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Руководства для артистов
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Часто задаваемые вопросы
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Компания</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/about"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      О нас
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/careers"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Карьера
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Контакты
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/press"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Пресса
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Оставайтесь на связи</h3>
                <p className="text-muted-foreground">
                  Подпишитесь на нашу рассылку для получения обновлений и
                  инсайтов музыкальной индустрии.
                </p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Ваш email адрес"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button type="submit" size="sm">
                    Подписаться
                  </Button>
                </div>
                <div className="flex space-x-4 pt-2">
                  <Link href="https://facebook.com" aria-label="Facebook">
                    <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                  </Link>
                  <Link href="https://twitter.com" aria-label="Twitter">
                    <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                  </Link>
                  <Link href="https://instagram.com" aria-label="Instagram">
                    <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                  </Link>
                  <Link href="https://youtube.com" aria-label="YouTube">
                    <Youtube className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                  </Link>
                </div>
              </div>
            </div>

            <Separator className="my-8" />
          </>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Vibrancy Music
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex space-x-6">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Условия использования
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Политика конфиденциальности
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Политика использования файлов cookie
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Vibrancy Music. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
