import { ReactNode } from "react";
import Header from "./Header";
import { Toaster } from "sonner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="container flex-grow px-4 py-6 mx-auto md:px-6">
        {children}
      </main>
      <footer className="py-4 mt-auto text-center text-sm text-muted-foreground border-t bg-background">
        <p>&copy; 2025 InstaClone. All rights reserved.</p>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
