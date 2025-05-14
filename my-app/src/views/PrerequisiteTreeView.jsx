import React from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";


// redundent file functionality exist in PrerequisitePresenter.jsx

function PrerequisiteTreeView(props) {
    return (
        <div className="w-full h-[500px] rounded-lg">
            <ReactFlow nodes={props.initialNodes} edges={props.initialEdges} fitView>
                <MiniMap />
                <Controls />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
};

export default PrerequisiteTreeView;
