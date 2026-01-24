// ui.js - PHASE 2: BEAUTIFUL CANVAS BACKGROUND WITH WORKING DOTS
// Custom styled ReactFlow control buttons with w-26 h-30 bg-none
// Permanent dots visible where nodes are dragged
// Dark mode aware MiniMap with proper viewport visibility

import {useState, useRef, useCallback, useEffect} from "react";
import ReactFlow, {Controls, Background, MiniMap} from "reactflow";
import {useStore} from "./store";
import {shallow} from "zustand/shallow";
import {InputNode} from "./nodes/inputNode";
import {LLMNode} from "./nodes/llmNode";
import {OutputNode} from "./nodes/outputNode";
import {TextNode} from "./nodes/textNode";
import {ImageNode} from "./nodes/imageNode";
import {DocumentNode} from "./nodes/documentNode";
import {TableNode} from "./nodes/tableNode";
import {ColorPaletteNode} from "./nodes/colorPaletteNode";
import {DecisionNode} from "./nodes/decisionNode";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = {hideAttribution: true};
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  image: ImageNode,
  document: DocumentNode,
  table: TableNode,
  colorPalette: ColorPaletteNode,
  decision: DecisionNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [dragDots, setDragDots] = useState([]); // Track dots for drag locations
  const [isDark, setIsDark] = useState(false); // Track dark mode for minimap
  const {nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect} = useStore(selector, shallow);

  // Track dark mode changes for minimap
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains("dark");
    setIsDark(darkMode);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = {id: nodeID, nodeType: `${type}`};
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(event.dataTransfer.getData("application/reactflow"));
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Add a dot at the drop location
        const newDot = {
          id: `dot-${Date.now()}`,
          x: position.x,
          y: position.y,
        };

        setDragDots((prevDots) => {
          const updatedDots = [...prevDots, newDot];
          // Keep only last 200 dots to avoid performance issues
          return updatedDots.slice(-200);
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Optional: Clear dots button

  return (
    <>
      {/* Canvas wrapper with gradient background */}
      <div
        className="
          flex-grow
          bg-gradient-to-br from-purple-50 to-blue-50
          dark:from-slate-950 dark:to-purple-950
          transition-colors duration-300
          overflow-hidden
          relative
          flex
          h-full
          flex-col
        "
        style={{
          minHeight: "calc(100vh - 240px)",
        }}
        ref={reactFlowWrapper}
      >
        {/* Subtle animated background accent */}
        <div
          className="
            absolute inset-0 opacity-20 dark:opacity-10
            bg-gradient-to-t from-purple-200 to-transparent
            dark:from-purple-900 dark:to-transparent
            pointer-events-none
          "
        />

        {/* ReactFlow with custom styling */}
        <div className="relative z-10 w-full h-full flex-1" style={{position: "relative"}}>
          <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onDrop={onDrop} onDragOver={onDragOver} onInit={setReactFlowInstance} nodeTypes={nodeTypes} proOptions={proOptions} snapGrid={[gridSize, gridSize]} connectionLineType="smoothstep">
            {/* Styled background grid */}
            <Background color="rgba(139, 92, 246, 0.1)" gap={gridSize} />

            {/* Styled controls with custom button styling */}
            <Controls
              style={{
                bottom: "auto",
                right: "16px",
                top: "16px",
              }}
            />

            {/* Styled minimap - Dark mode aware */}
            <MiniMap
              className="
                bg-gradient-to-br from-purple-100/50 to-purple-400/50
                backdrop-blur-sm
                border border-purple-400/20 dark:border-purple-300/20
                rounded-lg
                shadow-lg
              "
              maskColor={
                isDark
                  ? "rgba(200, 200, 200, 0.3)" // Light grey in dark mode
                  : "rgba(168, 85, 247, 0.15)" // Purple in light mode
              }
            />
          </ReactFlow>

          {/* Drag indicator dots overlay - Permanent dots */}
          {/* <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{position: "absolute", top: 0, left: 0}}>
            {dragDots.map((dot) => (
              <circle key={dot.id} cx={dot.x} cy={dot.y} r={2} fill="rgba(139, 92, 246, 0.6)" />
            ))}
          </svg> */}
        </div>
      </div>
    </>
  );
};
