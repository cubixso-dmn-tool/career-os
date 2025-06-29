import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Construction, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <Construction className="h-16 w-16 text-primary mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Page Under Construction</h1>
            <div className="flex items-center mt-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>Coming Soon</span>
            </div>
          </div>

          <p className="text-center text-gray-600 mb-6">
            We're working hard to bring you this new feature. Please check back soon!
          </p>
          
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
          <Button variant="outline" onClick={() => window.history.back()} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
