import {create} from "zustand";
import {addEdge, applyNodeChanges, applyEdgeChanges, MarkerType} from "reactflow";

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  getNodeID: (type) => {
    const newIDs = {...get().nodeIDs};
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({nodeIDs: newIDs});
    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  // ==================== FIXED onConnect HANDLER ====================
  // Manually create edges to properly handle dynamic variable handles
  onConnect: (connection) => {
    console.log("🔗 [STORE] onConnect called:", connection);

    // Create edge object with all required fields for dynamic handles
    const newEdge = {
      id: `edge-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`,
      // id: `reactflow_edge-${connection.source}${connection.sourceHandle}-${connection.target}${connection.targetHandle}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle || null,
      targetHandle: connection.targetHandle || null,
      type: "smoothstep",
      animated: true,
      markerEnd: {
        type: MarkerType.Arrow,
        height: "20px",
        width: "20px",
      },
    };

    console.log("📝 [STORE] Creating edge:", newEdge);

    set({
      edges: [...get().edges, newEdge],
    });

    console.log("✅ [STORE] Edge added successfully");
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = {...node.data, [fieldName]: fieldValue};
        }

        return node;
      }),
    });
  },
  updateNodeSize: (nodeId, width, height) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // Update node dimensions in data
          node.data = {...node.data, nodeWidth: width, nodeHeight: height};
        }
        return node;
      }),
    });
  },
}));
