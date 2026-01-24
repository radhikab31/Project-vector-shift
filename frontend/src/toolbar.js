// toolbar.js

import {DraggableNode} from "./draggableNode";

export const PipelineToolbar = () => {
  return (
    <div className="p-2.5">
      <div className="mt-5 flex flex-wrap gap-2.5">
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        <DraggableNode type="image" label="Image" />
        <DraggableNode type="document" label="Document" />
        <DraggableNode type="table" label="Table" />
        <DraggableNode type="colorPalette" label="Color Palette" />
        <DraggableNode type="decision" label="Decision" />
      </div>
    </div>
  );
};
