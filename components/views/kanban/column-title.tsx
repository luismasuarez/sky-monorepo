type ColumnTitleProps = {
  indicatorColor: string;
  title: string;
  cardCount: number;
};

const ColumnTitle = ({ indicatorColor, title, cardCount }: ColumnTitleProps) => {
  return (
    <h4 className="text-slate-900 dark:text-slate-100 font-bold text-base sm:text-lg sm:mb-4 flex items-center text-shadow-sm">
      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${indicatorColor} rounded-full mr-2 shadow-sm`} />
      <span className="truncate">
        {title} {cardCount}
      </span>
    </h4>
  );
};

export default ColumnTitle;
