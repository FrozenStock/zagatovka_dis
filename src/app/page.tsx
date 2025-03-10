import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white dark:from-[#0f0720] dark:via-[#120826] dark:to-[#1a0a3a]">
        {/* Hero Section */}
        <header className="w-full py-6 px-4 md:px-8 lg:px-12 border-b border-purple-800/30">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-white"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                Vibrancy Music
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm text-purple-200 hover:text-white transition-colors"
              >
                Возможности
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-purple-200 hover:text-white transition-colors"
              >
                Цены
              </Link>
              <Link
                href="#testimonials"
                className="text-sm text-purple-200 hover:text-white transition-colors"
              >
                Отзывы
              </Link>
              <Link
                href="#faq"
                className="text-sm text-purple-200 hover:text-white transition-colors"
              >
                FAQ
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-purple-200 hover:text-white hover:bg-purple-800/50"
                >
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white border-none">
                  Регистрация
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"
                style={{ animationDuration: "8s" }}
              ></div>
              <div
                className="absolute bottom-20 right-10 w-80 h-80 bg-violet-600/20 rounded-full filter blur-3xl animate-pulse"
                style={{ animationDuration: "10s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-600/10 rounded-full filter blur-3xl animate-pulse"
                style={{ animationDuration: "12s" }}
              ></div>
            </div>

            <div className="container mx-auto relative z-10">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
                  Раскройте свой музыкальный потенциал
                </h1>
                <p className="text-lg md:text-xl text-purple-200 mb-8">
                  Современная платформа для независимых артистов для
                  распространения, управления и монетизации своей музыки на всех
                  основных стриминговых сервисах.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white border-none text-lg py-6 px-8">
                    Начать бесплатно
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-300 hover:bg-purple-800/30 text-lg py-6 px-8"
                  >
                    Узнать больше
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-800/50 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-white mb-2">
                    100K+
                  </div>
                  <div className="text-purple-300">Артистов</div>
                </div>
                <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-800/50 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-white mb-2">150+</div>
                  <div className="text-purple-300">Стран</div>
                </div>
                <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-800/50 rounded-xl p-6 text-center transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-white mb-2">50+</div>
                  <div className="text-purple-300">Платформ</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="py-20 px-4 md:px-8 lg:px-12 bg-black/30"
          >
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                  Почему стоит выбрать нашу платформу
                </h2>
                <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                  Всё необходимое для распространения вашей музыки и роста
                  аудитории
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Feature 1 */}
                <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6 hover:bg-purple-900/30 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-purple-400"
                    >
                      <path d="M21 15V6" />
                      <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                      <path d="M12 12H3" />
                      <path d="M16 6H3" />
                      <path d="M12 18H3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Простое управление релизами
                  </h3>
                  <p className="text-purple-200">
                    Загружайте музыку, добавляйте метаданные и распространяйте
                    на все основные стриминговые платформы всего в несколько
                    кликов.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6 hover:bg-purple-900/30 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-purple-400"
                    >
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Комплексная аналитика
                  </h3>
                  <p className="text-purple-200">
                    Отслеживайте свои показатели с помощью подробной статистики
                    прослушиваний, демографии аудитории и отчетов о доходах.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6 hover:bg-purple-900/30 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-purple-400"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                      <path d="M6 15h1" />
                      <path d="M11 15h1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Прозрачные платежи
                  </h3>
                  <p className="text-purple-200">
                    Получайте свои гонорары быстро благодаря нашей прозрачной
                    платежной системе и подробной разбивке доходов.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6 hover:bg-purple-900/30 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-purple-400"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Глобальная дистрибуция
                  </h3>
                  <p className="text-purple-200">
                    Охватите поклонников по всему миру с дистрибуцией на более
                    чем 150 стриминговых сервисах и цифровых музыкальных
                    магазинах.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section
            id="testimonials"
            className="py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-20 right-10 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse"
                style={{ animationDuration: "15s" }}
              ></div>
              <div
                className="absolute bottom-20 left-10 w-80 h-80 bg-violet-600/10 rounded-full filter blur-3xl animate-pulse"
                style={{ animationDuration: "12s" }}
              ></div>
            </div>

            <div className="container mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                  Что говорят артисты о нас
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-purple-900/30 backdrop-blur-sm p-6 rounded-xl border border-purple-800/30 transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                        alt="Artist avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="italic mb-4 text-purple-200">
                    "Vibrancy Music помог мне охватить поклонников в странах, о
                    которых я даже не мечтала. Мои прослушивания увеличились на
                    300% всего за три месяца!"
                  </p>
                  <h4 className="font-semibold text-white">Сара Д.</h4>
                  <p className="text-sm text-purple-300">
                    Независимый автор-исполнитель
                  </p>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-purple-900/30 backdrop-blur-sm p-6 rounded-xl border border-purple-800/30 transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
                        alt="Artist avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="italic mb-4 text-purple-200">
                    "Панель аналитики дает мне информацию, которой у меня
                    никогда не было раньше. Теперь я точно знаю, на чем
                    сосредоточить свои маркетинговые усилия."
                  </p>
                  <h4 className="font-semibold text-white">Марк Т.</h4>
                  <p className="text-sm text-purple-300">
                    Продюсер электронной музыки
                  </p>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-purple-900/30 backdrop-blur-sm p-6 rounded-xl border border-purple-800/30 transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
                        alt="Artist avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="italic mb-4 text-purple-200">
                    "От планирования релизов до сбора роялти, Vibrancy Music
                    оптимизировал весь мой музыкальный бизнес. Я не могла быть
                    счастливее!"
                  </p>
                  <h4 className="font-semibold text-white">Елена Р.</h4>
                  <p className="text-sm text-purple-300">Лидер инди-группы</p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section
            id="pricing"
            className="py-20 px-4 md:px-8 lg:px-12 bg-black/40"
          >
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                  Простые, прозрачные цены
                </h2>
                <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                  Выберите план, который соответствует этапу вашей карьеры и
                  потребностям в дистрибуции
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Plan */}
                <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-800/30 rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <div className="p-6 border-b border-purple-800/30">
                    <h3 className="text-xl font-bold text-white">Начальный</h3>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-bold text-white">
                        200₽
                      </span>
                      <span className="text-purple-300">/релиз</span>
                    </div>
                    <p className="text-purple-300">
                      Идеально для новых артистов
                    </p>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        2 релиза в год
                      </li>
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        Базовая аналитика
                      </li>
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        90% ставка роялти
                      </li>
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        Стандартная поддержка
                      </li>
                    </ul>
                    <Button className="mt-6 w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white border-none">
                      Начать
                    </Button>
                  </div>
                </div>

                {/* Pro Plan */}
                <div className="bg-purple-900/30 backdrop-blur-sm border-2 border-purple-500 rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 relative z-10 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    ПОПУЛЯРНЫЙ
                  </div>
                  <div className="p-6 border-b border-purple-800/30">
                    <h3 className="text-xl font-bold text-white">
                      Профессиональный
                    </h3>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-bold text-white">
                        400₽
                      </span>
                      <span className="text-purple-300">/месяц</span>
                    </div>
                    <p className="text-purple-300">Для растущих артистов</p>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        Приоритетная поддержка
                      </li>
                    </ul>
                    <Button className="mt-6 w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white border-none">
                      Начать
                    </Button>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-800/30 rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <div className="p-6 border-b border-purple-800/30">
                    <h3 className="text-xl font-bold text-white">Годовой</h3>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-bold text-white">
                        3600₽
                      </span>
                      <span className="text-purple-300">/год</span>
                    </div>
                    <p className="text-purple-300">Экономия 25%</p>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        Полный набор аналитики
                      </li>
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        100% ставка роялти
                      </li>
                      <li className="flex items-center text-purple-200">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
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
                        Приоритетная поддержка 24/7
                      </li>
                    </ul>
                    <Button className="mt-6 w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white border-none">
                      Выбрать план
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-purple-900 to-violet-900 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-10"></div>
            </div>

            <div className="container mx-auto relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Готовы развивать свою музыкальную карьеру?
              </h2>
              <p className="text-xl mb-8 text-purple-200 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам артистов, которые расширяют свою
                аудиторию и увеличивают свои доходы с помощью нашей платформы.
              </p>
              <Link href="/register">
                <Button className="py-6 px-8 bg-white hover:bg-purple-100 text-purple-900 text-lg font-bold rounded-full">
                  Начать бесплатный период
                </Button>
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-black/50 border-t border-purple-800/30 py-12 px-4 md:px-8 lg:px-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-white"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                    Vibrancy Music
                  </span>
                </div>
                <p className="text-purple-300 text-sm">
                  Современная платформа для независимых артистов для
                  распространения, управления и монетизации своей музыки.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">
                  Дистрибуция музыки
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Возможности
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Цены
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Поддерживаемые платформы
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Истории успеха
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Ресурсы</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Блог
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Центр поддержки
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Руководства для артистов
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Часто задаваемые вопросы
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Компания</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      О нас
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Карьера
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Контакты
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-purple-300 hover:text-white transition-colors text-sm"
                    >
                      Пресса
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-purple-800/30 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-purple-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Vibrancy Music. Все права
                защищены.
              </p>
              <div className="flex space-x-6">
                <Link
                  href="#"
                  className="text-purple-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-purple-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-purple-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-purple-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
