'use client';

import { useEffect, useRef, useState } from 'react';

export default function Clock() {
  const [currentTime, setCurrentTime] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(timeString.toUpperCase());
    };

    updateTime();
    intervalRef.current = setInterval(updateTime, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="text-center w-full" title="Hora actual">
      <p className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200 capitalize truncate py-1">
        {currentTime}
      </p>
    </div>
  );
}
