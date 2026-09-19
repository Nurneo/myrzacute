import React from 'react';
import { useSafeMode } from '@/context/SafeModeContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PrivacyTextMaskProps {
  children: React.ReactNode;
  textLength?: number;
  className?: string;
  maskClassName?: string;
  as?: React.ElementType;
}

// Generates scatter dot pattern similar to banking privacy mode
function generateDotPattern(length = 24): string {
  const dots = ['•', '∙', '⁙', '⁘', '•', '•', '·', '•'];
  let result = '';
  for (let i = 0; i < Math.max(12, length); i++) {
    if (i > 0 && i % 4 === 0 && Math.random() > 0.4) {
      result += ' ';
    }
    result += dots[Math.floor(Math.random() * dots.length)];
  }
  return result;
}

export const PrivacyTextMask: React.FC<PrivacyTextMaskProps> = ({
  children,
  textLength,
  className,
  maskClassName,
  as: Component = 'span',
}) => {
  const { isSafeMode } = useSafeMode();

  const handleMaskClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info('Tap the Eye button near the moodmeter to reveal 👁️', {
      duration: 2000,
      id: 'safe-mode-hint-toast',
    });
  };

  if (!isSafeMode) {
    return <Component className={className}>{children}</Component>;
  }

  // Count approximate length if text content is passed
  const approxLen = textLength || (typeof children === 'string' ? children.length : 32);
  const pattern = generateDotPattern(Math.min(approxLen, 40));

  return (
    <Component
      onClick={handleMaskClick}
      title="Privacy Mode Active"
      className={cn(
        'inline-flex items-center gap-1 font-mono tracking-widest text-muted-foreground/80 select-none cursor-pointer transition-all duration-300 py-0.5 px-1 rounded-md hover:bg-primary/5',
        maskClassName || className
      )}
    >
      <span className="inline-block animate-pulse text-xs sm:text-sm font-black tracking-[0.25em] text-foreground/70 opacity-90 drop-shadow-sm">
        {pattern}
      </span>
    </Component>
  );
};

export default PrivacyTextMask;
