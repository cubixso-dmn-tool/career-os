import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import ResumeBuilderComponent from "@/components/resume/ResumeBuilder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, CheckCircle, Loader2 } from "lucide-react";

// Mock user ID until authentication is implemented
const USER_ID = 1;

interface ResumeBuilderProps {}

export default function ResumeBuilder({}: ResumeBuilderProps) {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  // Fetch user data
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch resume data
  const { data: resumeData, isLoading: loadingResume } = useQuery({
    queryKey: [`/api/users/${USER_ID}/resume`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Close sidebar when navigating to this page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  const isLoading = loadingUser || loadingResume;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <MobileHeader user={userData || { name: 'Ananya Singh', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Sidebar */}
      <Sidebar user={userData || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          user={userData || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="px-4 py-6 md:px-8 pb-20 md:pb-6">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="mt-4 text-gray-600">Loading resume builder...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Resume Tips */}
              <Card className="bg-indigo-50 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary">Resume Tips for Indian Job Market</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Keep your resume to 1-2 pages maximum</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Highlight specific skills that match job descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Include relevant keywords to pass ATS (Applicant Tracking Systems)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Quantify your achievements with numbers when possible</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Tailor your resume for each job application</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Resume Builder */}
              <ResumeBuilderComponent 
                userId={USER_ID} 
                existingResume={resumeData} 
              />

              {/* Resume Templates */}
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold mb-4">Resume Template Examples</h2>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="overflow-hidden">
                    <div className="aspect-w-8 aspect-h-11 bg-gray-100 relative">
                      <div className="absolute inset-0 flex flex-col p-6">
                        <div className="h-8 bg-primary mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                          <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                        <div className="mt-6 space-y-2">
                          <div className="h-3 w-full bg-gray-200 rounded"></div>
                          <div className="h-3 w-full bg-gray-200 rounded"></div>
                          <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="mt-6">
                          <div className="h-3 w-1/4 bg-primary/30 rounded mb-2"></div>
                          <div className="h-3 w-full bg-gray-200 rounded"></div>
                          <div className="h-3 w-full bg-gray-200 rounded mt-1"></div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-center font-medium">Modern Template</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <div className="aspect-w-8 aspect-h-11 bg-gray-100 relative">
                      <div className="absolute inset-0 flex flex-col p-6">
                        <div className="text-center mb-4">
                          <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto"></div>
                          <div className="h-3 w-3/4 bg-gray-200 rounded mx-auto mt-2"></div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
                          <div className="h-3 w-full bg-gray-200 rounded"></div>
                          <div className="h-3 w-full bg-gray-200 rounded"></div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
                          <div className="h-3 w-full bg-gray-200 rounded"></div>
                          <div className="h-3 w-full bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-center font-medium">Classic Template</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden">
                    <div className="aspect-w-8 aspect-h-11 bg-gray-100 relative">
                      <div className="absolute inset-0 flex p-6">
                        <div className="w-1/3 bg-primary/20 p-3">
                          <div className="h-12 w-12 rounded-full bg-primary mx-auto mb-4"></div>
                          <div className="space-y-2">
                            <div className="h-3 w-full bg-gray-300 rounded"></div>
                            <div className="h-3 w-full bg-gray-300 rounded"></div>
                            <div className="h-3 w-full bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        <div className="w-2/3 p-3 space-y-4">
                          <div className="space-y-1">
                            <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                          </div>
                          <div className="space-y-1">
                            <div className="h-3 w-1/3 bg-gray-300 rounded"></div>
                            <div className="h-3 w-full bg-gray-200 rounded"></div>
                            <div className="h-3 w-full bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-center font-medium">Creative Template</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Download Section */}
              {resumeData && (
                <Card className="bg-gray-50">
                  <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Ready to apply for jobs?</h3>
                      <p className="text-gray-600">Download your resume in different formats for different applications.</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                      <Button variant="outline" className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        DOCX
                      </Button>
                      <Button className="bg-primary">
                        <Download className="mr-2 h-4 w-4" />
                        All Formats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}
