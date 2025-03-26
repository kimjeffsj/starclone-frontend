import { useState } from "react";
import LoginForm from "./LoginForm";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Camera } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import RegisterForm from "./RegisterForm";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const AuthPage = () => {
  const { isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState<string>("login");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <div className="flex flex-1 justify-center items-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex justify-center items-center">
                <Camera size={40} className="text-pink-500" />
                <span className="ml-2 text-2xl font-bold">StarClone</span>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login */}
                <LoginForm />

                {/* Register */}
                <RegisterForm setActiveTab={setActiveTab} />
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
