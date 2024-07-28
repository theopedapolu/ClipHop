import React from "react";
import { useDroppable } from "@dnd-kit/core";

function Droppable({children}) {
    const {isOver,setNodeRef} = useDroppable({
        id:'skynet'
    });

    const style = {
        color: isOver ? 'blue' : undefined,
    };
    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    )
}

export default Droppable;