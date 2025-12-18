import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";



export default function LoginForm() {
  const { onLogin } = useAuth();

  const formSchema = z.object({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password must be at most 100 characters."),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange"
  });

  const submitForm = async (data) => {

    let response = await onLogin(data.email, data.password);

    response && toast.error(response.msg)

    console.log(response);
  };

  return (
    <Card className="w-full max-w-md">
      <Toaster />
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(submitForm)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-email">Email</FieldLabel>
                    <Input
                      id="form-email"
                      {...field}
                      placeholder="mo@example.com"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

            </div>
            <div className="grid gap-2">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-password">
                      Password
                    </FieldLabel>
                    <Input
                      id="form-password"
                      type="password"
                      {...field}
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          variant="outline"
          form="login-form"
          type="submit"
          className="w-full cursor-pointer"
        >
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}