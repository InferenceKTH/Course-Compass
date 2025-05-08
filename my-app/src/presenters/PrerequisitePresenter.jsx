import { observer } from "mobx-react-lite";
import PrerequisiteTreeView from "../views/PrerequisiteTreeView";

import dagre from '@dagrejs/dagre';
import { useCallback } from "react";

import {
    Background,
    ReactFlow,
    addEdge,
    ConnectionLineType,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { model } from "../model";


export const PrerequisitePresenter = observer((props) => {

    let uniqueCounter = 0;
    let textCounter = 0;
    let codeCounter = 0;
    let hover_popup = document.createElement("div");
    hover_popup.setAttribute("id", "course_popup");
    hover_popup.style.fontSize = 0.75 + "rem";
    hover_popup.style.pointerEvents = "none";
    hover_popup.style.position = "absolute";
    hover_popup.style.backgroundColor = "white";
    hover_popup.style.border = "1px solid black";
    hover_popup.style.zIndex = "9999";
    hover_popup.style.justifyContent = "center";
    hover_popup.style.alignItems = "center";
    hover_popup.style.textAlign = "center";
    hover_popup.style.padding = "5px";
    document.body.appendChild(hover_popup);


    let code_to_name;

    let input_text_obj = {};

    const position = { x: 0, y: 0 };
    const edgeType = 'smoothstep';

    let initialNodes = [];
    let initialEdges = [];

    const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 172;
    const nodeHeight = 36;

    loadTree();
    //console.log(initialNodes);

    const getLayoutedElements = (nodes, edges, direction = 'LR') => {
        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({ rankdir: direction, nodesep: 30});

        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        });

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        const newNodes = nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            return {
                ...node,
                targetPosition: isHorizontal ? 'left' : 'top',
                sourcePosition: isHorizontal ? 'right' : 'bottom',
                position: {
                    x: nodeWithPosition.x - nodeWidth / 2,
                    y: nodeWithPosition.y - nodeHeight / 2,
                },
            };
        });

        return { nodes: newNodes, edges };
    };

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges,
        'LR' // force horizontal layout initially
    );

    const getNodeAbsolutePosition = (nodeId) => {
        const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
        if (nodeElement) {
          const rect = nodeElement.getBoundingClientRect();
          return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
        }
        return null;
      };
      

    function handleMouseEnter(event, node) {
        if (node["data"]["label"] === "One of these" || node["data"]["label"] === "All of these" ||
            node["data"]["label"] === "No Prerequisites" || node["data"]["label"] === "Unable to load") {return;}
        let course_id = "";
        let course_name = ""; 

        const pos = getNodeAbsolutePosition(node.id);
        const popupWidth = pos.width + 20;
        const popupHeight = pos.height + 20;
        hover_popup.style.minWidth = popupWidth + "px";
        hover_popup.style.minHeight = popupHeight + "px";
        hover_popup.style.maxWidth = pos.width * 3 + "px";
       
        hover_popup.style.fontSize = window.getComputedStyle(document.querySelector(`[data-id="${node.id}"]`)).fontSize;
        hover_popup.style.display = "flex";


        if (node.id.indexOf(" ") == -1) {
            course_id = node.id;
        } else {
            course_id = node.id.split(" ")[0]
        }
        
        if (node.data?.courses) {
            //hover_popup.style.maxWidth = pos.width * 3 + "px";
            let inner_courses = node.data.courses;
            course_name = "<ul>";
            
            for (let arr of inner_courses) {
                let inner_code = arr[1] + arr[2];
                let course_name_inner = model.getCourse(inner_code)?.name;
                if (!course_name_inner) {
                    course_name_inner = "Course discontinued"
                }
                course_name += "<li>" + inner_code + ": " + course_name_inner + "</li>"
            }
            course_name += "</ul>";
        }
        else if (node.data.label === "More Info...") {
            course_name = input_text_obj[node["id"]];
        } else {
            course_name = model.getCourse(course_id).name;
        }

        hover_popup.innerHTML = course_name;
        hover_popup.style.left = pos.x + pos.width / 2 - hover_popup.offsetWidth / 2 + "px";
        hover_popup.style.top = pos.y + pos.height / 2 - hover_popup.offsetHeight / 2 + "px";

    }

    function handleMouseLeave(event, node) {
        hover_popup.style.display = "none";
    }

    const Flow = () => {
        const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
        const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

        const onConnect = useCallback(
            (params) =>
                setEdges((eds) =>
                    addEdge(
                        { ...params, type: ConnectionLineType.SmoothStep, animated: true },
                        eds
                    )
                ),
            []
        );

        return (
            <div className="w-full h-[500px] rounded-lg">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeMouseEnter={handleMouseEnter}
                    onNodeMouseLeave={handleMouseLeave}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    fitView
                    style={{ backgroundColor: 'white', borderRadius: '10px'}}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={true}
                    elementsFocusable={false}
                    edgesFocusable={false}
                    
                >
                    <Background />
                </ReactFlow>

            </div>

        );

    };

    function setLabel(id, label) {
        setNodes((nodes) =>
          nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, label } } : n
          )
        );
    }
    
    function createNode(id, name, node_type) {
        return {
            id: id,
            type: node_type,
            data: { label: name },
            style: { 
                //padding: 0,
                //maxWidth: "100px",
                //display: 'inline-block',
                //justifyContent: 'center',
                //alignItems: 'center',
                zIndex: 0 
            },
            position,
            events: {
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
            }
        };
    }
    function createEdge(s, t) {
        return { id: s + " " + t, source: s, target: t, type: edgeType, animated: true };
    }


    function prereq_convert(courses_taken, current_object, previous_key, previous_node_id) {
        let current_node = null; let last_course_num = null; let param_key = null; 
        try {
            current_object.length;
        } catch (err) {return;}
        
        if (!Array.isArray(current_object)) {   // Is object
            let key = Object.keys(current_object)[0];
            //console.log("Len: " + current_object[key].length);
            //console.log("Type: " + typeof current_object[key]);
            if (current_object[key] != null && current_object[key].length == 1 && (typeof current_object[key][0] == "string" 
            || (current_object[key][0].length == 1 && typeof current_object[key][0][0] == "string"))) {
                prereq_convert(courses_taken, current_object[key], key, previous_node_id); 
            } else {
                if (key == "or") {
                    if (previous_key == "or") {
                        prereq_convert(courses_taken, current_object[key], key, previous_node_id); 
                    } else {
                        current_node = createNode(key + uniqueCounter, "One of these", "default")
                        initialNodes.push(current_node);
                        initialEdges.push(createEdge(previous_node_id, key + uniqueCounter));
                        prereq_convert(courses_taken, current_object[key], key, key + uniqueCounter++);      
                    }
                    } 
                if (key == "and") {
                    if ((current_object[key].length == 1 && Object.keys(current_object[key][0])[0] == "or") || previous_key != "or") {
                        prereq_convert(courses_taken, current_object[key], key, previous_node_id); 
                    } else {
                        current_node = createNode(key + uniqueCounter, "All of these", "default")
                        initialNodes.push(current_node);
                        initialEdges.push(createEdge(previous_node_id, key + uniqueCounter));
                        prereq_convert(courses_taken, current_object[key], key, key + uniqueCounter++);      
                    }
                }
            }      
        } else {    // Is an array
            
            let refined_course_array = [];
            let current_compresion = [];
            let started_compressing = false;
            for (let i = 0; i < current_object.length; i++) {
                if (typeof current_object[i] == "string") {
                    if (current_object[i].startsWith("#")) {
                        refined_course_array.push([i, "#", current_object[i].slice(1)]);
                    } else {
                        let course_letters = current_object[i].slice(0, 2);
                        let course_number = current_object[i].slice(2); 
                        if (!isNaN(course_number)) {course_number = parseInt(course_number);} 
                        
                        if (!started_compressing) {
                            if (i < current_object.length - 2 && typeof current_object[i + 1] == "string" && typeof current_object[i + 2] == "string") {
                                let next = current_object[i + 1]; let next_next = current_object[i + 2];
                                //console.log(next)
                                //console.log(course_number, next.slice(2), next_next.slice(2))
                                if (next.slice(0, 2) === course_letters
                                && next_next.slice(0, 2) === course_letters && !isNaN(next.slice(2))
                                && !isNaN(next_next.slice(2)) && parseInt(next.slice(2)) == course_number + 1
                                && parseInt(next_next.slice(2)) == course_number + 2) {
                                        //console.log(course_number, next.slice(2), next_next.slice(2))
                                        current_compresion.push([i, course_letters, course_number]);
                                        current_compresion.push([i + 1, course_letters, course_number + 1]);
                                        current_compresion.push([i + 2, course_letters, course_number + 2]);
                                        if (courses_taken.includes(current_object[i])) {
                                            current_object[i] = true;
                                        } else {
                                            current_object[i] = false;
                                        }
                                        i += 1;
                                        started_compressing = true;
                                } else {
                                    refined_course_array.push([i, current_object[i].slice(0, 2), current_object[i].slice(2)]);
                                }
                            } else {
                                refined_course_array.push([i, current_object[i].slice(0, 2), current_object[i].slice(2)]);
                            }
                        } else {    // Compression has started
                            if (i < current_object.length - 1) {
                                let next = current_object[i + 1]
                                if (next.slice(0, 2) === course_letters && !isNaN(next.slice(2)) && parseInt(next.slice(2)) == course_number + 1) {
                                    current_compresion.push([i + 1, course_letters, course_number + 1]);
                                } else {
                                    started_compressing = false;
                                    //refined_course_array.push([i + 1, current_object[i + 1].slice(0, 2), current_object[i + 1].slice(2)]);
                                    //console.log(current_compresion);
                                    refined_course_array.push([-1, "!", current_compresion]);
                                    current_compresion = [];
                                }

                            }
                        }
                        if (courses_taken.includes(current_object[i])) {
                            current_object[i] = true;
                        } else {
                            current_object[i] = false;
                        }
                    }
                } 
                else {
                    prereq_convert(courses_taken, current_object[i], previous_key, previous_node_id);
                }
                
            }
            //console.log("HERERERERERE!!!")
            //console.log(refined_course_array);


            for (let i = 0; i < refined_course_array.length; i++) {
                let input_id = "";
                let input_text = "";
                let node_data = null;
                let course_code;
                let course_done = false;
                if (refined_course_array[i][1] === "#") {   // Text requirement
                    input_text = "More Info...";
                    input_id = "text " + ++textCounter;
                    input_text_obj[input_id] = refined_course_array[i][2];
                } else if (refined_course_array[i][1] === "!") {    // Compressed courses
                    let compressed_length = refined_course_array[i][2].length;
                    let compressed_done_count = 0;
                    for (let j = 0; j < compressed_length; j++) {
                        let code = refined_course_array[i][2][j][1] + refined_course_array[i][2][j][2];
                        if (courses_taken.includes(code)) {
                            compressed_done_count++;
                        }
                    }
                    if (previous_key == "or" && compressed_done_count > 0) {
                        course_done = true;
                    } else if (previous_key == "and" && compressed_done_count == compressed_length) {
                        course_done = true;
                    }
                    //console.log("Compressed:");
                    //console.log(refined_course_array[i][2]);
                    course_code = refined_course_array[i][2][0][1] + refined_course_array[i][2][0][2] +
                    "-" + refined_course_array[i][2][compressed_length - 1][1] + refined_course_array[i][2][compressed_length - 1][2];
                    input_text = course_code;
                    input_id = course_code + " " + ++codeCounter;
                    node_data = refined_course_array[i][2];
                    
                } else {
                    course_code = refined_course_array[i][1] + refined_course_array[i][2];
                    input_text = course_code;
                    input_id = course_code + " " + ++codeCounter;
                    if (courses_taken.includes(course_code)) {
                        course_done = true;
                    }
                }
                let new_node = createNode(input_id, input_text, "output");
                if (course_done) {
                    new_node["style"]["backgroundColor"] = "lightgreen";
                }
                if (node_data != null) {
                    new_node["data"]["courses"] = node_data;
                }
                current_node = new_node;
                initialNodes.push(new_node);
                initialEdges.push(createEdge(previous_node_id, input_id, "output"));
            }
        }
        

        /* STEP 2: Check if an object is true or false based on content of the inner object */
        
        if (typeof current_object == "object" && !Array.isArray(current_object)) {
            let key = Object.keys(current_object)[0];
            let object_array = current_object[key];
            //console.log("DEBUGGING  ")
            //console.log(current_node)
            //console.log(object_array)
            let num_of_matches = 0;
            for (let i = 0; i < object_array.length; i++) {
                if (Array.isArray(object_array[i])) {
                    let num_of_inner_matches = 0;
                    for (let j = 0; j < object_array[i].length; j++) {
                        if (object_array[i][j] === true) {
                            num_of_inner_matches ++;
                            if (current_node != null) {
                                current_node["style"]["backgroundColor"] = "lightgreen";
                            }
                        }
                    }
                    if (key == "or" && num_of_inner_matches > 0) {
                        object_array[i] = true; num_of_matches++; 
                        if (current_node != null) {
                            current_node["style"]["backgroundColor"] = "lightgreen";
                        }
                        continue;
                    }
                    if (key == "and" && num_of_inner_matches == object_array[i].length) {
                        object_array[i] = true; num_of_matches++;
                        if (current_node != null) {
                            current_node["style"]["backgroundColor"] = "lightgreen";
                        }
                        continue;
                    }
                    object_array[i] = false;
                } else if (typeof object_array[i] == "object") {
                    let inner_key = Object.keys(object_array[i])[0];
                    if (object_array[i][inner_key]) {num_of_matches++;}
                } else if(object_array[i] === true) {num_of_matches++}
            }
            if (key == "or" && num_of_matches > 0) {
                //console.log(current_node)
                current_object[key] = true;
                if (current_node != null) {
                    current_node["style"]["backgroundColor"] = "lightgreen";
                }
            }
            else if (key == "and" && num_of_matches == object_array.length) {
                //console.log("DEBUGGING 2");
                //console.log(num_of_matches, object_array.length)
                current_object[key] = true;
                if (current_node != null) {
                    current_node["style"]["backgroundColor"] = "lightgreen";
                }
            }
            else {
                current_object[key] = false;
            }
        }
        
    }

    function generateTree(courses_taken, prereqs) {
        prereq_convert(courses_taken, prereqs, null, props.selectedCourse.code);
        //console.log(JSON.stringify(prereqs, null, 4));
        let key = Object.keys(prereqs);
        if (prereqs[key] === true) {
            return true;
        }
        else {
            return false;
        }

    }


    function loadTree() {
        
        console.log(JSON.stringify(props.selectedCourse.prerequisites, null, 4));
        if (!props.selectedCourse?.prerequisites || props.selectedCourse.prerequisites.length == 0) {
            let display_node = createNode("No Prerequisites", "No Prerequisites", "default");
            display_node.style["pointerEvents"] = "none";
            display_node["className"] = 'no-handles';
            initialNodes.push(display_node);
        } else {
            try {
                let root = createNode(props.selectedCourse.code, props.selectedCourse.code, "input");
                let copy = JSON.parse(JSON.stringify(props.selectedCourse.prerequisites));
                let courses_taken = JSON.parse(localStorage.getItem("completedCourses"));
                code_to_name = model.getCourseNames(courses_taken);
                //console.log(JSON.stringify(code_to_name, null, 4));
                //console.log(Array.isArray(courses_taken));
                //courses_taken.push("DD1380");
                //courses_taken.push("DD1310");
                //courses_taken.push("SF1674");
                //courses_taken.push("SF1915");
                //courses_taken.push("A11P1B");
                //courses_taken.push("DD1321");
                //console.log(localStorage.getItem("completedCourses"));
                //courses_taken.push
                let eligible = generateTree(courses_taken, copy);
                if (eligible) {
                    root["style"]["backgroundColor"] = "lightgreen";
                }
                initialNodes.push(root);
            } catch(err) {
                initialNodes = []
                initialEdges = []
                console.log(err);
                let display_node = createNode("Error", "Unable to load", "default");
                display_node.style["pointerEvents"] = "none";
                display_node["className"] = 'no-handles';
                initialNodes.push(display_node);
            }
        }


    }

    /* return <PrerequisiteTreeView initialNodes={initialNodes} initialEdges={initialEdges} /> */
    return <Flow />
});

export default PrerequisitePresenter;

