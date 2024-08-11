import React, {useState} from 'react';
import Clock from './Clock';
import DeviceGroup from './DeviceGroup';
import {DndContext, useDndMonitor} from '@dnd-kit/core';
import DndIcon from './DnDIcon';

const colors = ['bg-emerald-500','bg-sky-500','bg-rose-500','bg-amber-500','bg-violet-500'];

function generatePositions(numGroups) {
    let radius = 13;
    let positions = [];
    if (numGroups === 1) {
        positions.push([["1/2","1/2"]]);
    } else {
        let theta = 2*Math.PI/numGroups;
        for (let i = 0; i < numGroups; ++i) {
            positions.push([(Math.round(radius*Math.cos(i*theta)) + 17.5-4).toString(),
                (17.5-4-Math.round(radius*Math.sin(i*theta))).toString()]);
        }
    }
    return positions;
}

function handleDragMove(event) {
    console.log('Drag move event triggered');  
}

function handleDragStart(event) {
    console.log('Drag start event triggered');
}

function Crown() {
    const [spinClock,setSpinClock] = useState(true);
    
    const [deviceGroups, setDeviceGroups] = useState([
        {id:'A',color:'bg-rose-500',devices:[{id:0, name:'skynet', type:'A'}],bubble:false},
        {id:'B',color:'bg-blue-500',devices:[{id:1, name:'sky',type:'B'}],bubble:false},
        {id:'C',color:'bg-amber-500',devices:[{id:2, name:'skys',type:'C'}],bubble:false},
        {id:'D',color:'bg-emerald-500',devices:[{id:3, name:'skynets', type:'D'}],bubble:false}
    ]);

    
    const addDeviceGroup = (type,name) => {
        setDeviceGroups([...deviceGroups, [{id:1, name:'sky',type:type}]]);
    };

    const removeDeviceGroup = () => {

    };

    let positions = generatePositions(deviceGroups.length);

    function handleDragOver(event) {
        console.log('Drag over event triggered');
        console.log(event);
        setDeviceGroups(deviceGroups.map((group) => {
            if (event.over !== null && group.id === event.over.id) {
                return {...group, color:'bg-rose-500',bubble:true};
            } else if (group.id === event.active.id && event.over !== null) {
                return {...group, color:'bg-rose-500'};
            } else if (group.devices.length > 1) {
                return {...group, color:'bg-green-500',bubble:true};
            } else {
                return {...group, color:'bg-green-500',bubble:false};
            }
        }))
    }

    function handleDragEnd(event) {

    }

    function Monitor() {
        useDndMonitor({
            onDragOver(event) {handleDragOver(event)},
            onDragEnd(event) {handleDragEnd(event)}
        })
    }


    return (
        <div className='flex flex-col items-center w-full min-w-full max-w-full overflow-x-clip mt-5'>
        <div className='relative w-[90vmin] h-[90vmin] md:w-[35rem] md:h-[35rem]'>
            <Clock spin={spinClock}/>
            <DndContext>
            <Monitor/>
            {deviceGroups.map((group,idx) => {
                return (
                <DndIcon iconId={group.id} key={idx} left={positions[idx][0]} top={positions[idx][1]} bubble={group.bubble}>
                <DeviceGroup devices={group.devices} color={group.color}/>
                </DndIcon>
                )
            })}
            </DndContext>   
        </div>
        </div>
    )
}

export default Crown;