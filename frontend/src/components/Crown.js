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

function Crown() {
    const [spinClock,setSpinClock] = useState(true);
    
    const [deviceGroups, setDeviceGroups] = useState([
        {id:1,color:'bg-emerald-500',devices:[{name:'skynet', type:'A'}],bubble:false},
        // {id:2,color:'bg-blue-500',devices:[{name:'sky',type:'B'}],bubble:false},
        // {id:3,color:'bg-amber-500',devices:[{name:'skys',type:'C'}],bubble:false},
        // {id:4,color:'bg-emerald-500',devices:[{name:'skynets', type:'D'}],bubble:false}
    ]);

    
    const addDeviceGroup = (name,type) => {
        let newId = 1;
        for (let group of deviceGroups) {
            if (group.id !== newId) {
                break;
            }
            newId += 1;
        }
        setDeviceGroups([...deviceGroups, {id:newId, color:colors[newId], devices:[{name:name,type:type}], bubble:false}]);
    };

    const mergeGroups = (id1,id2) => {
        const updatedDeviceGroups = deviceGroups.reduce((acc, group) => {
            if (group.id === id1) {
                return acc; // Skip this group as it will be merged
            } else if (group.id === id2) {
                const group1 = deviceGroups.find(g => g.id === id1);
                const mergedDevices = [...group.devices, ...group1.devices];
                acc.push({...group, devices: mergedDevices});
            } else {
                acc.push(group);
            }
            return acc;
        }, []);

        setDeviceGroups(updatedDeviceGroups);
    }

    const removeDevice = () => {

    };

    let positions = generatePositions(deviceGroups.length);

    function handleDragOver(event) {
        console.log('Drag over event triggered');
        console.log(event);
        if (event.over == null || event.over.id === event.active.id) {
            setDeviceGroups(deviceGroups.map((group) => {return {...group,color:colors[group.id-1],bubble:group.devices.length > 1}}))
        } else {
            setDeviceGroups(deviceGroups.map((group) => {
                if (group.id === event.active.id) {
                    return {...group,color:colors[event.over.id-1],bubble:group.devices.length > 1}
                } else if (group.id === event.over.id) { 
                    return {...group,color:colors[event.over.id-1],bubble:true}
                } else {
                    return {...group,color:colors[group.id-1],bubble:group.devices.length > 1}
                }
            }))
        }
    }

    function handleDragEnd(event) {
        console.log('Drag end event')
        if (event.over !== null && event.over.id !== event.active.id) {
            mergeGroups(event.active.id,event.over.id);
        }
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