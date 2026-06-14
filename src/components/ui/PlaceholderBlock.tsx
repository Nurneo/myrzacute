import React from 'react';

interface PlaceholderBlockProps {
  height?: string;
  label?: string;
}

const PlaceholderBlock = ({ height = "h-32", label = "Content Placeholder" }: PlaceholderBlockProps) => {
  return (
    <div className={`w-full ${height} border-2 border-dashed border-border rounded-2xl flex items-center justify-center bg-secondary/20`}>
      <span className="text-muted-foreground font-medium text-sm uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default PlaceholderBlock;