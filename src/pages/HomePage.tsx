import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <Button asChild>
          <Link to="/post/new" className="flex items-center">
            <PlusSquare className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
