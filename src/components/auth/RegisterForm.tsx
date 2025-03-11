"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";vers/zod";
import { Eye, EyeOff } from "lucide-react";import { Eye, EyeOff } from "lucide-react";
import { RegisterData } from "@/types/auth";auth";

import { Button } from "@/components/ui/button";tton";
import { Input } from "@/components/ui/input"; Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";{ Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,l,
  FormField,,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";} from "@/components/ui/form";

const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),in(2, "Имя должно содержать минимум 2 символа"),
  password: z.string().min(6, "Минимальная длина пароля 6 символов"),   email: z.string().email("Введите корректный email"),
  confirmPassword: z.string(),    password: z.string().min(6, "Минимальная длина пароля 6 символов"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Вы должны принять условия использования",erms: z.boolean().refine((val) => val === true, {
  }),"Вы должны принять условия использования",
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});
    path: ["confirmPassword"],
interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  onLoginClick: () => void;terFormProps {
  isLoading?: boolean;a: RegisterData) => Promise<void>;
}=> void;

export default function RegisterForm({ onSubmit, onLoginClick, isLoading = false }: RegisterFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);t default function RegisterForm({
  onSubmit,
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",setShowPassword] = React.useState(false);
      email: "",nfirmPassword] = React.useState(false);
      password: "",
      confirmPassword: "",= useForm<RegisterData>({
      acceptTerms: false,esolver: zodResolver(registerSchema),
    },    defaultValues: {
  });

  return (
    <div className="w-full space-y-6 bg-background p-6 rounded-lg">
      <div className="space-y-2 text-center">eptTerms: false,
        <h2 className="text-2xl font-bold tracking-tight">Создать аккаунт</h2>
        <p className="text-sm text-muted-foreground">
          Введите свои данные ниже, чтобы создать аккаунт артиста
        </p>(
      </div>space-y-6 bg-background p-6 rounded-lg">
"space-y-2 text-center">
      <Form {...form}>t">Создать аккаунт</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">   <p className="text-sm text-muted-foreground">
          <FormField      Введите свои данные ниже, чтобы создать аккаунт артиста
            control={form.control}        </p>
            name="name"v>
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя артиста</FormLabel>
                <FormControl>
                  <Input placeholder="Введите имя артиста" {...field} />
                </FormControl>name="name"
                <FormMessage />render={({ field }) => (
              </FormItem>              <FormItem>
            )}abel>Имя артиста</FormLabel>
          />
nput placeholder="Введите имя артиста" {...field} />
          <FormField
            control={form.control}ssage />
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Эл. почта</FormLabel>
                <FormControl>
                  <Inputrol}
                    type="email"
                    placeholder="name@example.com"eld }) => (
                    {...field}<FormItem>
                  />    <FormLabel>Эл. почта</FormLabel>
                </FormControl>                <FormControl>
                <FormMessage />nput
              </FormItem>
            )}eholder="name@example.com"
          />

          <FormField
            control={form.control}/>
            name="password">
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <div className="relative">
                  <FormControl>rol}
                    <Input
                      type={showPassword ? "text" : "password"}eld }) => (
                      placeholder="Создайте пароль"<FormItem>
                      {...field}    <FormLabel>Пароль</FormLabel>
                    />                <div className="relative">
                  </FormControl>ormControl>
                  <Button
                    type="button"{showPassword ? "text" : "password"}
                    variant="ghost"оздайте пароль"
                    size="icon"..field}
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (button"
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />bsolute right-0 top-0"
                    )}Click={() => setShowPassword(!showPassword)}
                  </Button>
                </div>Password ? (
                <FormMessage />ssName="h-4 w-4" />
              </FormItem>
            )}sName="h-4 w-4" />
          />

          <FormFieldiv>
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Подтвердите пароль</FormLabel>
                <div className="relative">
                  <FormControl>orm.control}
                    <Input"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Подтвердите пароль"
                      {...field}вердите пароль</FormLabel>
                    />sName="relative">
                  </FormControl>    <FormControl>
                  <Button        <Input
                    type="button"                      type={showConfirmPassword ? "text" : "password"}
                    variant="ghost"  placeholder="Подтвердите пароль"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >n
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />ame="absolute right-0 top-0"
                    )}
                  </Button>irmPassword)
                </div>
                <FormMessage />
              </FormItem>Password ? (
            )}eOff className="h-4 w-4" />
          />
e="h-4 w-4" />
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (rmMessage />
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />ontrol}
                </FormControl>ptTerms"
                <div className="space-y-1 leading-none"> => (
                  <FormLabel>lassName="flex flex-row items-start space-x-3 space-y-0">
                    Я согласен с{" "}  <FormControl>
                    <a href="#" className="text-primary hover:underline">      <Checkbox
                      условиями использования                    checked={field.value}
                    </a>{" "}onCheckedChange={field.onChange}
                    и{" "}
                    <a href="#" className="text-primary hover:underline">
                      политикой конфиденциальностиe-y-1 leading-none">
                    </a>
                  </FormLabel>н с{" "}
                </div>="#" className="text-primary hover:underline">
              </FormItem>ания
            )}
          />и{" "}
" className="text-primary hover:underline">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Уже есть аккаунт?{" "}
        <Button variant="link" onClick={onLoginClick} className="p-0"> disabled={isLoading}>
          Войти "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </div>
    </div>
  );
}lassName="text-center text-sm">
