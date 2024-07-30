import React, {useState} from 'react';
import Clock from './Clock';
import DeviceGroup from './DeviceGroup';
import {DndContext} from '@dnd-kit/core';
import DndIcon from './DnDIcon';

function generatePositions(numGroups) {
    let radius = 10;
    let positions = [];
    if (numGroups == 1) {
        positions.push([["1/2","1/2"]]);
    } else {
        let theta = 2*Math.PI/numGroups;
        for (let i = 0; i < numGroups; ++i) {
            positions.push([(Math.round(radius*Math.cos(i*theta)) + 17.5).toString(),
                (Math.round(radius*Math.sin(i*theta)) + 17.5).toString()]);
        }
    }
    return positions;
}

function Crown() {
    //const [stopClock,setStopClock] = useState(false);
    
    const [deviceGroups, setDeviceGroups] = useState([
        [{id:0, name:'skynet', type:'A'}],
        [{id:1, name:'sky',type:'E'}],
        [{id:2, name:'skys',type:'E'}],
        [{id:3, name:'skynets', type:'A'}]
    ]);
    
    const addDeviceGroup = () => {
        setDeviceGroups([...deviceGroups, [{id:1, name:'sky',type:'E'}]]);
    };

    const removeDeviceGroup = () => {

    };

    let positions = generatePositions(deviceGroups.length);
    console.log(positions[1][0])
    let ids = ['a','b','c','d']
    return (
        <div className='flex flex-row justify-center'>
        <div className='relative h-[35rem] w-[35rem]'>
            <Clock/>
            <DndContext>
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
}

export default Crown;