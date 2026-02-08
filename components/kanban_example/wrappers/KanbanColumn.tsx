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
        className={`glass-light dark:glass-dark w-[350px] h-[500px] max-h-[500px] rounded-xl flex flex-col ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

KanbanColumn.displayName = 'KanbanColumn';

export default KanbanColumn;
