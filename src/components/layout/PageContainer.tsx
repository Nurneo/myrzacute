"use client";

import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className={`flex-1 w-full max-w-md mx-auto px-6 pt-6 pb-20 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default PageContainer;