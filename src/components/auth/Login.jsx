
import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
// import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "react-router-dom";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { InputField, CheckboxField } from "@/components/auth/FormFields";
import {  loginSchema } from "@/lib/schema/loginSchema";
import { useUserStore } from "@/store/useUserStore";
// import { authClient } from "@/lib/auth-client";
const Login = () => {
  const [pending, setPending] = useState(false);
  const navigate=useNavigate()
  const { toast } = useToast();
  const {login,loading} = useUserStore();
  // const router = useRouter();
  const form = useForm
  // <LoginFormValues>
  ({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const onSubmit = async (data) => {
    try {
      await login(data);
      form.reset();
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="w-full max-w-md">


        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <InputField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="john.doe@example.com"
                  type="email"
                  icon={<Mail className="h-5 w-5 text-muted-foreground" />}
                />

                <InputField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  icon={<Lock className="h-5 w-5 text-muted-foreground" />}
                  showPasswordToggle={true}
                />

                <div className="flex items-center justify-between">
                  <CheckboxField
                    control={form.control}
                    name="rememberMe"
                    label="Remember me"
                  />

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      Log in <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex gap-4 ">
              <GoogleAuthButton
                action="login"
                buttonText="Sign up with Google"
                redirectTo="/dashboard"
              />
            </div>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
