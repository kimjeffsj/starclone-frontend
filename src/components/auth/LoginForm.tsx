import { useState } from "react";
import { LoginInput, loginSchema } from "./validations/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { TabsContent } from "../ui/tabs";
// import { Checkbox } from "../ui/checkbox";
// import { Separator } from "../ui/separator";
// import { SocialIcon } from "react-social-icons";

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuthStore();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setIsSubmitting(true);
    try {
      await login(values);
      toast.success("Login successful", {
        description: "Welcome!",
      });
    } catch (error: any) {
      toast.error("Login failed", {
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSocialLogin = (provider: string) => {
  //   console.log(`${provider} Login attempt`);
  //   // TODO: Social login
  // };

  return (
    <TabsContent value="login" className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            // control={control}
            name="emailOrUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email or username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      Keep me sign in
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button variant="link" className="px-0 text-pink-500">
              Forgot password?
            </Button>
          </div> */}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">OR</span>
            </div>
          </div> */}

          {/* Social login button */}
          {/* <div className="flex justify-center space-x-4">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={() => handleSocialLogin("github")}
            >
              <SocialIcon
                url="https://github.com"
                style={{ height: 24, width: 24 }}
              />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={() => handleSocialLogin("facebook")}
            >
              <SocialIcon
                url="https://facebook.com"
                style={{ height: 24, width: 24 }}
              />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={() => handleSocialLogin("google")}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#FFC107"
                />
                <path
                  d="M3.15296 7.3455L6.43846 9.755C7.32746 7.554 9.48046 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15896 2 4.82796 4.1685 3.15296 7.3455Z"
                  fill="#FF3D00"
                />
                <path
                  d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3037 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z"
                  fill="#4CAF50"
                />
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#1976D2"
                />
              </svg>
            </Button>
          </div> */}
        </form>
      </Form>
    </TabsContent>
  );
};

export default LoginForm;
