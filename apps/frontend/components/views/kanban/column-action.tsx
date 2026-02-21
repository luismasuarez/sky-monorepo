type Props = {
  onAddTask?: () => void;
};

const ColumnAction = ({ onAddTask }: Props) => {
  return (
    <button
      className="px-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition"
      onClick={e => {
        e.stopPropagation();
        if (onAddTask) {
          onAddTask();
        }
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-slate-600 dark:text-slate-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>
  );
};

export default ColumnAction;
