import React, {useState} from 'react';
import Clock from './Clock';
import DeviceGroup from './DeviceGroup';
import {DndContext} from '@dnd-kit/core';
import DndIcon from './DnDIcon';

function generatePositions(numGroups) {
    let radius = 10;
    let positions = [];
    if (numGroups === 1) {
        positions.push([["1/2","1/2"]]);
    } else {
        let theta = 2*Math.PI/numGroups;
        for (let i = 0; i < numGroups; ++i) {
            positions.push([(Math.round(radius*Math.cos(i*theta)) + 17.5).toString(),
                (17.5-Math.round(radius*Math.sin(i*theta))).toString()]);
        }
    }
    return positions;
}

function handleDragOver(event) {
    console.log('Drag over event triggered');
}

function handleDragMove(event) {
    console.log('Drag move event triggered');  
}

function handleDragStart(event) {
    console.log('Drag start event triggered');
}

function Crown() {
    //const [stopClock,setStopClock] = useState(false);
    
    const [deviceGroups, setDeviceGroups] = useState([
        [{id:0, name:'skynet', type:'A'}],
        [{id:1, name:'sky',type:'B'}],
        [{id:2, name:'skys',type:'C'}],
        [{id:3, name:'skynets', type:'D'}]
    ]);
    
    const addDeviceGroup = () => {
        setDeviceGroups([...deviceGroups, [{id:1, name:'sky',type:'E'}]]);
    };

    const removeDeviceGroup = () => {

    };

    let positions = generatePositions(deviceGroups.length);
    let ids = ['a','b','c','d']
    return (
        <div className='flex flex-col items-center w-full min-w-full max-w-full overflow-x-clip mt-5'>
        <div className='relative w-[90vmin] h-[90vmin] md:w-[35rem] md:h-[35rem]'>
            <Clock/>
            <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            {deviceGroups.map((group,idx) => {
                return (
                <DndIcon iconId={ids[idx]} key={idx} left={positions[idx][0]} top={positions[idx][1]}>
                <DeviceGroup devices={group}/>
                </DndIcon>
                )
            })}
            </DndContext>   
        </div>
        </div>
    )

    function handleDragEnd(event) {
        console.log('Drag end event triggered');
        console.log(event.active);
        console.log(event.over);
    }
}

export default Crown;