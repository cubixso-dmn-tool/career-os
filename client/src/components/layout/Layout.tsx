import React from 'react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import MobileHeader from '@/components/ui/mobile-header';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user } = useAuth();
  
  // Fallback user data for development/testing
  const userWithDefaults = {
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader 
        user={userWithDefaults} 
        title={title}
      />

      {/* Sidebar */}
      <Sidebar user={userWithDefaults} />

      {/* Mobile Sidebar */}
      <MobileSidebar user={userWithDefaults} />

      {/* Main Content */}
      <main className="flex-1 relative bg-gray-50">
        <div className="container mx-auto px-4 py-6 md:px-8 pb-20 md:pb-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}