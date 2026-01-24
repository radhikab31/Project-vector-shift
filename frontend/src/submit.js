export const SubmitButton = () => {
  return (
    <div
      className="
        w-full
        bg-gradient-to-t from-purple-100/30 to-transparent
        dark:from-purple-950/40 dark:to-transparent
        border-t border-purple-400/20 dark:border-purple-300/20
        backdrop-blur-sm
        py-6 px-4
        flex items-center justify-center
        flex-shrink-0
      "
    >
      {/* Submit button */}
      <button
        type="submit"
        className="
          px-8 py-3
          text-lg font-semibold
          bg-gradient-to-r from-purple-600 to-purple-700
          dark:from-purple-500 dark:to-purple-600
          hover:from-purple-700 hover:to-purple-800
          dark:hover:from-purple-400 dark:hover:to-purple-500
          text-white
          border border-purple-400/50
          hover:border-purple-300/80
          dark:border-purple-300/50
          dark:hover:border-purple-200/80
          rounded-xl
          shadow-lg hover:shadow-2xl
          shadow-purple-500/50 hover:shadow-purple-600/70
          dark:shadow-purple-600/50 dark:hover:shadow-purple-500/70
          transition-all duration-300
          hover:scale-105
          focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2
          dark:focus:ring-offset-slate-950
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer
          uppercase tracking-wider
          relative
          overflow-hidden
        "
      >
        {/* Button text with icon */}
        <span className="relative flex items-center gap-2">
          {/* Checkmark icon */}
          <svg className="w-5 h-5 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Submit
        </span>
      </button>
    </div>
  );
};
