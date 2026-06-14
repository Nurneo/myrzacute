import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeader = ({ title, subtitle, className = "" }: SectionHeaderProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;