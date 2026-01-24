import {PipelineToolbar} from "./toolbar";
import {PipelineUI} from "./ui";
import {SubmitButton} from "./submit";
import {useColorMode} from "./hooks/useColorMode";

function App() {
  const {colorMode, toggleColorMode} = useColorMode();

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-slate-900">
      <div className="fixed top-8 right-4 z-50">
        <button onClick={toggleColorMode} className="p-2.5 flex rounded-full bg-gradient-to-br from-purple-600/20 to-purple-800/10 dark:from-purple-600/30 dark:to-purple-800/20 backdrop-blur-md border border-purple-400/30 dark:border-purple-300/40 hover:border-purple-400/50 dark:hover:border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group" title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}>
          <svg className={`w-5 h-5 text-yellow-500 transition-all duration-300 ${colorMode === "light" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4.293 1.293a1 1 0 011.414 0l1.414 1.414a1 1 0 11-1.414 1.414L14.586 4.707a1 1 0 010-1.414zm2.828 4.828a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 111.414 1.414l-1.414 1.414zm0 7.072l1.414 1.414a1 1 0 11-1.414 1.414l-1.414-1.414a1 1 0 111.414-1.414zM10 18a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1zm-4.293-1.293a1 1 0 00-1.414 1.414l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414zm2.828-4.828a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 111.414 1.414l-1.414 1.414zM4.707 5.414A1 1 0 003.293 4a1 1 0 000 1.414l1.414 1.414a1 1 0 001.414-1.414L4.707 5.414z" clipRule="evenodd" />
          </svg>
          <svg className={`w-5 h-5 text-purple-300 absolute transition-all duration-300 ${colorMode === "dark" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>

          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">{colorMode === "light" ? "Dark Mode" : "Light Mode"}</span>
        </button>
      </div>

      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
