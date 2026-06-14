import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <main className={`flex-1 w-full max-w-md mx-auto px-6 pt-8 pb-32 min-h-screen ${className}`}>
      {children}
    </main>
  );
};

export default PageContainer;