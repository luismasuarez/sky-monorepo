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
        className={`glass-panel p-2.5 min-h-[100px] rounded-xl ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

KanbanCard.displayName = 'KanbanCard';

export default KanbanCard;
