import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

const KanbanColumn = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className = '', style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`glass-light dark:glass-dark rounded-xl p-3 sm:p-4 shadow-xl transition-colors duration-200 flex flex-col h-full ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

KanbanColumn.displayName = 'KanbanColumn';

export default KanbanColumn;
