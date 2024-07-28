import React, {useState} from 'react';
import Clock from './Clock';
import DeviceGroup from './DeviceGroup';
import {DndContext} from '@dnd-kit/core';
import Draggable from './Draggable';
import Droppable from './Droppable';

function Crown() {
    //const [stopClock,setStopClock] = useState(false);
    const [deviceGroups, setDevices] = useState([<DeviceGroup key={0}/>]);
    
    const addDeviceGroup = () => {

    };

    const removeDeviceGroup = () => {

    };

    return (
        <div className='relative h-[30rem] mt-10 bg-amber-400'>
            <DndContext>
            {deviceGroups.map((group,index) => {
                return (<Droppable key={index}>
                <Draggable> 
                {group}
                </Draggable>
                </Droppable>);
            })}
            </DndContext>   
            
        </div>
    )
}

export default Crown;