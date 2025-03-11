import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSession, getProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  DollarSign,
  Wallet,
  BadgeDollarSign,
  CreditCardIcon,
  BanknoteIcon,
  ArrowUpRight,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function PaymentPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const profile = await getProfile();

  if (!profile) {
    redirect("/profile-setup");
  }

  // Mock data for earnings
  const earnings = {
    total: 1245.78,
    available: 845.32,
    pending: 400.46,
    lastPayout: 350.0,
    lastPayoutDate: "2024-05-15",
  };

  // Mock data for payment methods
  const paymentMethods = [
    {
      id: "pm_1",
      type: "bank_account",
      name: "Сбербанк",
      last4: "4567",
      isDefault: true,
    },
  ];

  // Mock data for transactions
  const transactions = [
    {
      id: "tr_1",
      date: "2024-05-15",
      amount: 350.0,
      status: "completed",
      type: "payout",
      description: "Выплата за апрель 2024",
    },
    {
      id: "tr_2",
      date: "2024-04-15",
      amount: 275.5,
      status: "completed",
      type: "payout",
      description: "Выплата за март 2024",
    },
    {
      id: "tr_3",
      date: "2024-03-15",
      amount: 320.25,
      status: "completed",
      type: "payout",
      description: "Выплата за февраль 2024",
    },
  ];

  // Mock data for subscription plans
  const subscriptionPlans = [
    {
      id: "plan_basic",
      name: "Базовый",
      price: 0,
      features: [
        "2 релиза в год",
        "Дистрибуция на основные платформы",
        "Базовая аналитика",
        "Комиссия 15%",
      ],
      current: true,
    },
    {
      id: "plan_pro",
      name: "Про",
      price: 9.99,
      features: [
        "Неограниченное количество релизов",
        "Дистрибуция на все платформы",
        "Расширенная аналитика",
        "Комиссия 10%",
        "Приоритетная поддержка",
      ],
      current: false,
    },
    {
      id: "plan_premium",
      name: "Премиум",
      price: 19.99,
      features: [
        "Неограниченное количество релизов",
        "Дистрибуция на все платформы",
        "Полная аналитика и отчеты",
        "Комиссия 5%",
        "Приоритетная поддержка 24/7",
        "Продвижение релизов",
      ],
      current: false,
    },
  ];

  return (
    <DashboardLayout
      user={{
        name:
          profile.artist_name || session.user.email?.split("@")[0] || "Артист",
        email: session.user.email || "",
        avatar: profile.profile_image_url || undefined,
      }}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Финансы</h1>
          <p className="text-muted-foreground mt-1">
            Управляйте доходами, выплатами и подпиской
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${earnings.total.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">За все время</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Доступно к выводу
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${earnings.available.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Можно вывести сейчас
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">
                <BanknoteIcon className="mr-2 h-4 w-4" />
                Вывести средства
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Ожидает выплаты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${earnings.pending.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Будет доступно через 30 дней
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="earnings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="earnings">Доходы</TabsTrigger>
            <TabsTrigger value="payment-methods">Способы оплаты</TabsTrigger>
            <TabsTrigger value="subscription">Подписка</TabsTrigger>
          </TabsList>

          <TabsContent value="earnings" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>История транзакций</CardTitle>
                <CardDescription>
                  Просмотр всех ваших выплат и поступлений
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {transaction.type === "payout" ? (
                            <ArrowUpRight className="h-5 w-5 text-primary" />
                          ) : (
                            <DollarSign className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.description}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3.5 w-3.5" />
                            {new Date(transaction.date).toLocaleDateString(
                              "ru-RU",
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {transaction.type === "payout" ? "-" : "+"}$
                          {transaction.amount.toFixed(2)}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {transaction.status === "completed" ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />{" "}
                              Выполнено
                            </>
                          ) : (
                            <>
                              <Clock className="mr-1 h-3 w-3" /> В обработке
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Скачать отчет
                </Button>
                <Button variant="outline">Показать все</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payment-methods" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Способы вывода средств</CardTitle>
                <CardDescription>
                  Управляйте способами получения выплат
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border rounded-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {method.type === "bank_account" ? (
                            <BanknoteIcon className="h-5 w-5 text-primary" />
                          ) : (
                            <CreditCardIcon className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {method.type === "bank_account" ? "Счет" : "Карта"}{" "}
                            **** {method.last4}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <Badge variant="outline" className="mr-2">
                            По умолчанию
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          Изменить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Добавить способ оплаты
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={plan.current ? "border-primary" : ""}
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.price === 0 ? "Бесплатно" : `$${plan.price}/месяц`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-primary mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {plan.current ? (
                      <Button className="w-full" variant="outline" disabled>
                        Текущий план
                      </Button>
                    ) : (
                      <Button className="w-full">Выбрать план</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
