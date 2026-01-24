import {PipelineToolbar} from "./toolbar";
import {PipelineUI} from "./ui";
import {SubmitButton} from "./submit";
import {useColorMode} from "./hooks/useColorMode";
import {Sun, Moon} from "lucide-react";

function App() {
  const {colorMode, toggleColorMode} = useColorMode();

  return (
    <div className="h-screen flex flex-col transition-colors duration-300 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-slate-900">
      {/* Dark Mode Toggle Button - Fixed at top right */}
      <div className="fixed top-12 right-4 z-50">
        <button onClick={toggleColorMode} className="p-2.5 flex rounded-full bg-gradient-to-br from-purple-600/20 to-purple-800/10 dark:from-purple-600/30 dark:to-purple-800/20 backdrop-blur-md border border-purple-400/30 dark:border-purple-300/40 hover:border-purple-400/50 dark:hover:border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group" title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}>
          {colorMode === "light" ? <Sun className="w-5 h-5 text-yellow-500 transition-all duration-300" /> : <Moon className="w-5 h-5 text-slate-300 transition-all duration-300" />}

          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">{colorMode === "light" ? "Dark Mode" : "Light Mode"}</span>
        </button>
      </div>

      {/* Toolbar - Sticky header */}
      <div className="flex-shrink-0">
        <PipelineToolbar />
      </div>

      {/* Main content area - Canvas */}
      <div className="flex-grow overflow-hidden">
        <PipelineUI />
      </div>

      {/* Submit Button - Fixed footer */}
      <div className="flex-shrink-0">
        <SubmitButton />
      </div>
    </div>
  );
}

export default App;
