import {DraggableNode} from "./draggableNode";

export const PipelineToolbar = () => {
  return (
    <div className="sticky top-0 z-40 backdrop-blur-md">
      <div
        className="
          bg-gradient-to-r from-purple-600/10 to-blue-600/10
          dark:from-purple-600/20 dark:to-blue-600/20
          border-b border-purple-400/20 dark:border-purple-300/20
          shadow-lg shadow-purple-500/10 dark:shadow-purple-600/20
          py-4 px-4 sm:px-6 md:px-8
          transition-all duration-300
        "
      >
        <div className="mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 opacity-70">Pipeline Nodes</h3>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <DraggableNode type="customInput" label="Input" />
          <DraggableNode type="llm" label="LLM" />
          <DraggableNode type="customOutput" label="Output" />
          <DraggableNode type="text" label="Text" />
          <DraggableNode type="image" label="Image" />
          <DraggableNode type="document" label="Document" />
          <DraggableNode type="table" label="Table" />
          <DraggableNode type="colorPalette" label="Color" />
          <DraggableNode type="decision" label="Decision" />
        </div>
      </div>
    </div>
  );
};
