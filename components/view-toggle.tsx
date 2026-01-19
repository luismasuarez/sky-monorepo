'use client';

import { cn } from '@/lib/utils';
import { IconBookmark, IconChartBar, IconLayoutKanban, IconServer } from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

export type ViewType = 'kanban' | 'links' | 'credentials' | 'metrics';

interface ViewToggleProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  notifications?: {
    kanban?: { warning: number; overtime: number };
  };
}
export default function ViewToggle({ activeView, onViewChange, notifications }: ViewToggleProps) {
  const kanbanNotifications = notifications?.kanban || { warning: 0, overtime: 0 };
  const hasNotifications = kanbanNotifications.warning > 0 || kanbanNotifications.overtime > 0;

  // Sliding indicator logic
  const tabKeys = useMemo<ViewType[]>(() => ['kanban', 'links', 'credentials', 'metrics'], []);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  // Para animación de escala/opacidad
  const [isAnimating, setIsAnimating] = useState(false);
  const tabsListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateIndicator = () => {
      const idx = tabKeys.indexOf(activeView);
      const node = tabRefs.current[idx];
      if (node && node.parentElement) {
        const { left, width } = node.getBoundingClientRect();
        const parentLeft = node.parentElement.getBoundingClientRect().left;
        const newStyle = { left: left - parentLeft, width };
        setIndicatorStyle(prev =>
          prev.left !== newStyle.left || prev.width !== newStyle.width ? newStyle : prev
        );
      }
    };
    // Animación de escala/opacidad
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 350);
    updateIndicator();
    if (!tabsListRef.current) return;
    const resizeObs = new window.ResizeObserver(updateIndicator);
    resizeObs.observe(tabsListRef.current);
    window.addEventListener('resize', updateIndicator);
    return () => {
      resizeObs.disconnect();
      window.removeEventListener('resize', updateIndicator);
      clearTimeout(timeout);
    };
  }, [activeView, tabKeys]);

  // Helper for ref assignment (must return void)
  const setTabRef =
    (idx: number) =>
      (el: HTMLButtonElement | null): void => {
        tabRefs.current[idx] = el;
      };

  return (
    <Tabs
      value={activeView}
      onValueChange={value => onViewChange(value as ViewType)}
      className="w-full flex justify-center"
    >
      <TabsList
        ref={tabsListRef}
        className="glass-light dark:glass-dark rounded-md shadow-2xl border border-slate-200/70 dark:border-slate-700/60 w-full max-w-2xl flex justify-between px-2 py-1 min-h-11 relative overflow-hidden"
      >
        {/* Sliding indicator */}
        {/* Indicador deslizante mejorado */}
        <div
          className={cn(
            'absolute top-1 left-0 h-[calc(100%-0.5rem)] rounded-md z-0 transition-all duration-300 ease-in-out',
            isAnimating && 'scale-105 opacity-90',
            {
              'bg-blue-600 dark:bg-blue-400': activeView === 'kanban',
              'bg-yellow-500 dark:bg-yellow-400': activeView === 'links',
              'bg-slate-500 dark:bg-slate-400': activeView === 'credentials',
              'bg-green-600 dark:bg-green-400': activeView === 'metrics',
            }
          )}
          style={{
            width: `${indicatorStyle.width}px`,
            left: `${indicatorStyle.left}px`,
            pointerEvents: 'none',
            boxShadow: isAnimating
              ? '0 4px 24px 0 rgba(0, 80, 255, 0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)'
              : '0 2px 8px 0 rgba(0,0,0,0.08)',
            transition: 'all 0.3s cubic-bezier(.4,1.2,.4,1)',
          }}
        />
        {tabKeys.map((tab: ViewType, idx: number) => (
          <TabsTrigger
            key={tab}
            value={tab}
            ref={setTabRef(idx)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 relative text-base font-semibold rounded-md z-10 transition-colors duration-200',
              activeView === tab ? 'text-white' : ''
            )}
          >
            {tab === 'kanban' && (
              <>
                <IconLayoutKanban className="w-4 h-4" stroke={1.7} />
                <span className="hidden sm:inline">Kanban</span>
                <span className="sm:hidden">Tasks</span>
                {hasNotifications && (
                  <span className="absolute -top-1 -right-2 flex gap-0.5">
                    {kanbanNotifications.overtime > 0 && (
                      <span className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center text-[8px] text-white font-bold animate-pulse">
                        {kanbanNotifications.overtime > 9 ? '9+' : kanbanNotifications.overtime}
                      </span>
                    )}
                    {kanbanNotifications.warning > 0 && (
                      <span className="w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                        {kanbanNotifications.warning > 9 ? '9+' : kanbanNotifications.warning}
                      </span>
                    )}
                  </span>
                )}
              </>
            )}
            {tab === 'links' && (
              <>
                <IconBookmark className="w-4 h-4" stroke={1.7} />
                <span className="hidden sm:inline">Links</span>
                <span className="sm:hidden">Links</span>
              </>
            )}
            {tab === 'credentials' && (
              <>
                <IconServer className="w-4 h-4" stroke={1.7} />
                <span className="hidden sm:inline">Credentials</span>
                <span className="sm:hidden">Creds</span>
              </>
            )}
            {tab === 'metrics' && (
              <>
                <IconChartBar className="w-4 h-4" stroke={1.7} />
                <span className="hidden sm:inline">Metrics</span>
                <span className="sm:hidden">Stats</span>
              </>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
