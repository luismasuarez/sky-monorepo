type ColumnTitleProps = {
  indicatorColor: string;
  title: string;
  cardCount: number;
};

const ColumnTitle = ({ indicatorColor, title, cardCount }: ColumnTitleProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${indicatorColor} rounded-full shadow-sm`} />
      <h4 className="text-slate-900 dark:text-slate-100 font-bold text-base sm:text-lg text-shadow-sm truncate">
        {title} {cardCount}
      </h4>
    </div>
  );
};

export default ColumnTitle;
