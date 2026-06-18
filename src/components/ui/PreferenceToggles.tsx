import React from 'react';
import { Globe, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ToggleOption {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  iconColor: string;
}

interface PreferenceTogglesProps {
  options: ToggleOption[];
  activeId: string;
  onChange: (id: string) => void;
}

const PreferenceToggles = ({ options, activeId, onChange }: PreferenceTogglesProps) => {
  return (
    <Card className="border-[3px] border-border shadow-sm bg-card rounded-3xl overflow-hidden">
      <CardContent className="p-0">
        <div className="divide-y-[3px] divide-border">
          {options.map((option) => {
            const isActive = activeId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onChange(option.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-[3px] border-border ${option.iconColor}`}>
                    <option.icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.sublabel}</p>
                  </div>
                </div>
                {isActive && <Check size={20} className="text-primary" />}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferenceToggles;
