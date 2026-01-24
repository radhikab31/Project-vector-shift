from fastapi import FastAPI
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Health check
# -------------------------
@app.get("/")
def read_root():
    return {"Ping": "Pong"}


# -------------------------
# Request models
# -------------------------
class Node(BaseModel):
    id: str


class Edge(BaseModel):
    source: str
    target: str


class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


# -------------------------
# Parse pipeline endpoint
# -------------------------
@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):

    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)

    # Build adjacency list
    graph = {node.id: [] for node in pipeline.nodes}

    for edge in pipeline.edges:
        graph[edge.source].append(edge.target)

    visited = set()
    stack = set()

    # DFS cycle detection
    def dfs(node):
        if node in stack:
            return False
        if node in visited:
            return True

        visited.add(node)
        stack.add(node)

        for neighbor in graph.get(node, []):
            if not dfs(neighbor):
                return False

        stack.remove(node)
        return True

    is_dag = True
    for node in graph:
        if not dfs(node):
            is_dag = False
            break

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag,
    }
