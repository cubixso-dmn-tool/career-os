import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import careerRoadmaps, { RoadmapData } from "./CareerRoadmaps";
import { 
  Search, 
  Wrench, 
  BarChart, 
  Globe, 
  Shield, 
  Palette, 
  Cpu, 
  Check, 
  ChevronRight, 
  Briefcase,
  BookOpen,
  Users,
  Award
} from "lucide-react";

export default function CareerExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  // Categories and their icons
  const categories = [
    { id: "software", label: "Software Development", icon: <Wrench className="h-4 w-4" /> },
    { id: "data", label: "Data & AI", icon: <BarChart className="h-4 w-4" /> },
    { id: "web", label: "Web & Cloud", icon: <Globe className="h-4 w-4" /> },
    { id: "security", label: "Cybersecurity", icon: <Shield className="h-4 w-4" /> },
    { id: "design", label: "Product & Design", icon: <Palette className="h-4 w-4" /> },
    { id: "hardware", label: "Hardware & IoT", icon: <Cpu className="h-4 w-4" /> },
  ];

  // Map category IDs to career paths
  const categoryMap: Record<string, string[]> = {
    "software": [
      "full-stack-developer", 
      "mobile-app-developer", 
      "devops-engineer", 
      "blockchain-developer", 
      "game-developer"
    ],
    "data": [
      "data-analyst", 
      "data-scientist", 
      "machine-learning-engineer", 
      "ai-researcher", 
      "bi-developer"
    ],
    "web": [
      "cloud-solutions-architect", 
      "backend-engineer", 
      "frontend-developer", 
      "site-reliability-engineer", 
      "web3-smart-contract-auditor"
    ],
    "security": [
      "security-analyst", 
      "ethical-hacker", 
      "soc-analyst", 
      "cryptography-engineer", 
      "compliance-risk-analyst"
    ],
    "design": [
      "ui-ux-designer", 
      "product-manager", 
      "digital-marketing-analyst", 
      "tech-content-writer", 
      "growth-hacker"
    ],
    "hardware": [
      "iot-developer", 
      "embedded-systems-engineer", 
      "robotics-engineer", 
      "ar-vr-developer"
    ]
  };

  // Filter careers based on search query
  const filterCareers = (categoryId: string) => {
    const careers = categoryMap[categoryId] || [];
    
    if (!searchQuery) return careers;
    
    return careers.filter(id => {
      const career = careerRoadmaps[id];
      return (
        career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.skills.technical.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  };

  // Render the selected career details
  const renderCareerDetails = () => {
    if (!selectedCareer) return null;
    
    const roadmap = careerRoadmaps[selectedCareer];
    
    return (
      <Card className="border-primary/20">
        <CardHeader className="bg-primary/10 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary" />
                {roadmap.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {roadmap.description}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/30 text-primary"
              onClick={() => setSelectedCareer(null)}
            >
              Back to List
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[560px]">
            <div className="p-4 space-y-6">
              {/* Industry Overview */}
              <div>
                <h4 className="text-md font-semibold mb-2 flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-primary" /> 
                  Industry Overview
                </h4>
                <p className="text-sm mb-3">{roadmap.overview.intro}</p>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium flex items-center">
                    <Award className="h-4 w-4 mr-1 text-amber-500" /> 
                    Success Stories
                  </h5>
                  {roadmap.overview.successStories.map((story: string, i: number) => (
                    <div key={i} className="bg-muted p-2 rounded-md text-sm">
                      {story}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Day in the Life */}
              <div>
                <h4 className="text-md font-semibold mb-2 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-primary" /> 
                  Day in the Life
                </h4>
                <ul className="space-y-1.5">
                  {roadmap.dayInLife.map((item: string, i: number) => (
                    <li key={i} className="text-sm flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Skills Needed */}
              <div>
                <h4 className="text-md font-semibold mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" /> 
                  Skills Needed
                </h4>
                
                <h5 className="font-medium text-sm mb-2">Technical Skills</h5>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {roadmap.skills.technical.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-blue-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                <h5 className="font-medium text-sm mb-2">Soft Skills</h5>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap.skills.soft.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-green-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Recommended Learning Path */}
              <div>
                <h4 className="text-md font-semibold mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-primary" /> 
                  Recommended Learning Path
                </h4>
                <div className="space-y-3">
                  {roadmap.courses.map((course, i) => (
                    <div key={i} className="text-sm border rounded-md p-3 bg-card">
                      <div className="font-medium mb-1">{course.name}</div>
                      <div className="flex justify-between items-center">
                        <Badge variant={
                          course.level === "Beginner" ? "outline" : 
                          course.level === "Intermediate" ? "secondary" : "default"
                        } className="text-xs">
                          {course.level}
                        </Badge>
                        <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                          <a href={course.link}>View Course</a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Projects to Build */}
              <div>
                <h4 className="text-md font-semibold mb-2 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-primary" /> 
                  Projects to Build
                </h4>
                <div className="space-y-3">
                  {roadmap.projects.map((project, i) => (
                    <div key={i} className="text-sm border rounded-md p-3 bg-card">
                      <div className="font-medium mb-1">{project.name}</div>
                      <Badge variant={
                        project.level === "Beginner" ? "outline" : 
                        project.level === "Intermediate" ? "secondary" : "default"
                      } className="text-xs mb-2">
                        {project.level}
                      </Badge>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {project.skills.map((skill, j) => (
                          <Badge key={j} variant="outline" className="bg-gray-50 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Networking & Community */}
              <div>
                <h4 className="text-md font-semibold mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" /> 
                  Networking & Community
                </h4>
                
                <h5 className="font-medium text-sm mb-2">Communities to Join</h5>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {roadmap.networking.communities.map((community: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-purple-50">
                      {community}
                    </Badge>
                  ))}
                </div>
                
                <h5 className="font-medium text-sm mb-2">Networking Tips</h5>
                <ul className="space-y-1.5">
                  {roadmap.networking.tips.map((tip: string, i: number) => (
                    <li key={i} className="text-sm flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  };

  // Render the career list
  const renderCareerList = () => {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Career Explorer</CardTitle>
          <CardDescription>
            Discover and explore detailed information about 30 in-demand tech careers
          </CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by career title or skills..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="software">
            <div className="px-4 py-2 border-b">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
                {categories.map(category => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center text-xs py-2"
                  >
                    {category.icon}
                    <span className="ml-1.5 hidden sm:inline-block">{category.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="m-0">
                <ScrollArea className="h-[500px]">
                  <div className="grid grid-cols-1 gap-3 p-4">
                    {filterCareers(category.id).length > 0 ? (
                      filterCareers(category.id).map(careerId => {
                        const career = careerRoadmaps[careerId];
                        return (
                          <Card key={careerId} className="border-l-4 border-l-primary/50">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{career.title}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {career.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {career.skills.technical.slice(0, 3).map((skill, i) => (
                                      <Badge key={i} variant="outline" className="bg-blue-50 text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {career.skills.technical.length > 3 && (
                                      <Badge variant="outline" className="bg-blue-50 text-xs">
                                        +{career.skills.technical.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-primary"
                                  onClick={() => setSelectedCareer(careerId)}
                                >
                                  Details
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No careers match your search criteria
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      {selectedCareer ? renderCareerDetails() : renderCareerList()}
    </div>
  );
}