import React from 'react';
import * as Icons from 'lucide-react';

interface IconResolverProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconResolver: React.FC<IconResolverProps> = ({ name, className = 'w-5 h-5', size }) => {
  // @ts-expect-error dynamic lucide icon resolution
  const IconComponent = Icons[name] || Icons.Wrench;

  return <IconComponent className={className} size={size} />;
};
