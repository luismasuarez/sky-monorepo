import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

const KanbanCard = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className = '', style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`glass-panel bg-white/60 dark:bg-slate-900/60 border border-white/10 dark:border-slate-700/40 backdrop-blur-sm p-2.5 min-h-[100px] rounded-xl ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

KanbanCard.displayName = 'KanbanCard';

export default KanbanCard;
