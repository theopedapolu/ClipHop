import React from "react";
import { useDraggable } from "@dnd-kit/core";

function Draggable({children}) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id:'skynet'
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    }
    : {};

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className='absolute top-3/4 left-3/4'>
            {children}
        </div>
    )
}

export default Draggable;