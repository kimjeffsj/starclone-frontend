import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import {
  RegisterFormInput,
  registerSchema,
} from "./validations/register.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { TabsContent } from "../ui/tabs";

interface RegisterFormProps {
  setActiveTab: (tab: string) => void;
}

const RegisterForm = ({ setActiveTab }: RegisterFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuthStore();

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: RegisterFormInput) => {
    setIsSubmitting(true);
    try {
      // To exclude confirmPassword for api
      const { confirmPassword, ...registerData } = values;

      await register(registerData);
      toast.success("Registration Successful", { description: "Welcome!" });
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again";

      if (error.response?.data) {
        // Check ValidationError message
        if (error.response.data.errors?.message) {
          errorMessage = error.response.data.errors.message;
        }
        // Check error message
        else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      toast.error("Register Failed", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TabsContent value="register" className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Re-enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Button
          variant="link"
          className="p-0 text-pink-500"
          onClick={() => setActiveTab("login")}
        >
          Login
        </Button>
      </div>
    </TabsContent>
  );
};

export default RegisterForm;
