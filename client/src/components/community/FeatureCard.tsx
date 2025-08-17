import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface FeatureCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  redirectUrl: string;
  category: string;
}

export default function FeatureCard({ 
  title, 
  description, 
  imageUrl, 
  redirectUrl 
}: FeatureCardProps) {
  const handleRedirect = () => {
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardContent className="p-0">
        {imageUrl && (
          <div className="relative overflow-hidden rounded-t-lg">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        
        <div className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-2">
              {description}
            </CardDescription>
          </CardHeader>
          
          <Button 
            onClick={handleRedirect}
            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
            variant="outline"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}