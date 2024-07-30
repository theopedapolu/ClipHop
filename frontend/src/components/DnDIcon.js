import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";

function DndIcon({iconId,children,top,left}) {
    // Draggable state
    const {attributes, listeners, setNodeRef: setDragRef, transform} = useDraggable({
        id:iconId
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    }
    : {};

    // Droppable state
    const {isOver,setNodeRef: setDropRef} = useDroppable({
        id:iconId
    });

    return (
        <div ref={node => {
                setDragRef(node);
                setDropRef(node);
              }}
        style={{...style,position:'absolute',top:`${top}rem`,left:`${left}rem`}} 
        {...listeners}
        {... attributes} >
            {children}
        </div>
    )
}

export default DndIcon;