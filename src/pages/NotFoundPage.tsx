import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto mt-16 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        The requested page doesn't exist or may have been moved
      </p>
      <Button asChild className="mt-8">
        <Link to="/" className="flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
