import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-hero-gradient flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-primary-foreground">404</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="hero" asChild>
            <Link to="/"><Home size={16} className="mr-2" />Ir para o início</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login"><ArrowLeft size={16} className="mr-2" />Acessar o sistema</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
