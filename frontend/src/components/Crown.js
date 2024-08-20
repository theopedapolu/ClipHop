import React, {useEffect, useState, useRef, useMemo} from 'react';
import Clock from './Clock';
import DeviceGroup from './DeviceGroup';
import {DndContext, useDndMonitor} from '@dnd-kit/core';
import DndIcon from './DnDIcon';

const Message = Object.freeze({
    CONNECTION: 'Connection',
    ADD_DEVICE: 'Add Device',
    UPDATE: 'Update',
    CLOSE_DEVICE: 'Close Device'
})

const colors = ['bg-emerald-500','bg-blue-500','bg-rose-500','bg-amber-500','bg-violet-500'];

function generatePositions(numGroups) {
    let radius = 13;
    let positions = [];
    if (numGroups === 1) {
        positions.push(['13.5','13.5']);
    } else if (numGroups >= 1) {
        let theta = 2*Math.PI/numGroups;
        for (let i = 0; i < numGroups; ++i) {
            positions.push([(Math.round(radius*Math.cos(i*theta)) + 17.5-4).toString(),
                (17.5-4-Math.round(radius*Math.sin(i*theta))).toString()]);
        }
    }
    console.log(positions);
    return positions;
}



function Crown() {
    // Hooks & State
    const connection = useRef(null);
    connection.name = "";
    connection.type = "";
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');
        console.log('hi')
        ws.onopen = () => {sendMessage(Message.CONNECTION,{text:"Device connected successfully"})};
        ws.onmessage = handleMessage;
        ws.onclose = onClose;
        connection.ws = ws;
        return onClose;
    },[])

    const [deviceGroups, setDeviceGroups] = useState([]);

    // State Change Helper methods
    const addDeviceGroup = (name,type) => {
        let newId = 1;
        for (let group of deviceGroups) {
            if (group.id !== newId) {
                break;
            }
            newId += 1;
        }
        console.log('add device',deviceGroups)
        setDeviceGroups([...deviceGroups, {id:newId, color:colors[newId-1], devices:[{name:name,type:type}], bubble:false}]);
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

    const removeDevice = (name) => {
        const newGroups = deviceGroups.reduce((acc,group) => {
            let newDevices = group.devices.filter(device => device.name !== name);
            if (newDevices.length > 0) {
                acc.push({...group,devices:newDevices})
            }
            return acc;
        },[]);

        setDeviceGroups(newGroups);
    };

    // Websocket handlers
    function sendMessage(type,message) {
        const data = {type, message}
        if (connection.ws && connection.ws.readyState === WebSocket.OPEN) {
            connection.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not open. Cannot send message.');
        }
    }
    
    const handleMessage = (event) => {
        const {type,message} = JSON.parse(event.data);
        switch(type) {
            case Message.ADD_DEVICE:
                addDeviceGroup(message.name, message.type);
                if (!connection.name) {
                    connection.name = message.name;
                } 
                break;
            case Message.UPDATE:
                mergeGroups(message.id1,message.id2);
                break;
            case Message.CLOSE_DEVICE:
                removeDevice(message.name);
                break;   
            default:
                console.warn(`Unhandled message type: ${type}`);
        }
    }
    
    function onClose() {
        removeDevice(connection.name);
        let message = {name:connection.name};
        sendMessage(Message.CLOSE_DEVICE, message);
    }


    // Drag & Drop event handlers
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
            let message = {id1:event.active.id, id2:event.over.id};
            sendMessage(Message.UPDATE, message);
        }
    }

    function Monitor() {
        useDndMonitor({
            onDragOver(event) {handleDragOver(event)},
            onDragEnd(event) {handleDragEnd(event)}
        })
    }

    

    const positions = useMemo(() => generatePositions(deviceGroups.length),[deviceGroups]);

    // Rendered JSX
    return (
        <div className='flex flex-col items-center w-full min-w-full max-w-full overflow-x-clip mt-5'>
        <div className='relative w-[90vmin] h-[90vmin] md:w-[35rem] md:h-[35rem]'>
            <Clock spin={deviceGroups.length <= 1}/>
            <DndContext>
            <Monitor/>
            {deviceGroups.map((group,idx) => {
                console.log(deviceGroups)
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