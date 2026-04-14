'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useBilan } from '@/context/BilanContext';

type HeaderColor = 'red' | 'orange' | 'blue' | 'green' | 'yellow' | 'gray';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  color?: HeaderColor;
  backPath?: string;
}

const colorMap: Record<HeaderColor, string> = {
  red: 'from-red-950 to-gray-950 border-red-900/50',
  orange: 'from-orange-950 to-gray-950 border-orange-900/50',
  blue: 'from-blue-950 to-gray-950 border-blue-900/50',
  green: 'from-green-950 to-gray-950 border-green-900/50',
  yellow: 'from-yellow-950 to-gray-950 border-yellow-900/50',
  gray: 'from-gray-900 to-gray-950 border-gray-800',
};

const iconColorMap: Record<HeaderColor, string> = {
  red: 'text-red-400',
  orange: 'text-orange-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  gray: 'text-gray-400',
};

export function PageHeader({
                             title,
                             subtitle,
                             icon,
                             color = 'gray',
                             backPath,
                           }: PageHeaderProps) {
  const router = useRouter();
  const { completionRate } = useBilan();

  return (
      <div
          className={cn(
              'bg-linear-to-b border-b px-4 pt-4 pb-3 sticky top-0 z-10',
              colorMap[color]
          )}
      >
        {/* Ligne du haut : retour + titre + icône */}
        <div className="flex items-center gap-3">
          <button
              type="button"
              onClick={() => (backPath ? router.push(backPath) : router.back())}
              className="p-1.5 rounded-lg bg-gray-800/60 text-gray-400 active:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-white leading-tight truncate">
              {title}
            </h1>
            {subtitle && (
                <p className="text-xs text-gray-400 leading-none mt-0.5">
                  {subtitle}
                </p>
            )}
          </div>

          {icon && (
              <span className={cn('shrink-0', iconColorMap[color])}>
            {icon}
          </span>
          )}
        </div>

        {/* Barre de progression globale */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
                className="h-full bg-linear-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 font-mono w-8 text-right">
          {completionRate}%
        </span>
        </div>
      </div>
  );
}
