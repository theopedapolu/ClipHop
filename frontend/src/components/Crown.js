import React, {useEffect, useState, useRef, useMemo} from 'react';
import Clock from './Clock';
import DeviceGroup from './DeviceGroup';
import {DndContext, useDndMonitor} from '@dnd-kit/core';
import DndIcon from './DnDIcon';
import SyncButton from './SyncButton';
import Info from './Info';
import useSize from './useSize';

const Message = Object.freeze({
    CONNECTION: 'Connection',
    ADD_DEVICE: 'Add Device',
    ADD_GROUPS: 'Add Groups',
    MERGE_GROUPS: 'Merge Groups',
    UPDATE_CLIPBOARD: 'Update Clipboard',
    GET_CLIPBOARD: 'Get Clipboard',
    CLOSE_DEVICE: 'Close Device'
})

// List of colors used for groups
const colors = ['bg-emerald-500','bg-blue-500','bg-rose-500','bg-amber-500','bg-violet-500'];


// Generates positions for device groups based on the number of groups
function generatePositions(numGroups,width) {
    let radius = width >= 768 ? 13 : Number(((13/35)*width/16).toFixed(2))
    let originShift = width >= 768 ? 13.5 : Number(((11.5/35)*width/16).toFixed(2))
    console.log(width,radius)
    let positions = [];
    if (numGroups === 1) {
        positions.push([originShift.toString(),originShift.toString()]);
    } else if (numGroups >= 1) {
        let theta = 2*Math.PI/numGroups;
        for (let i = 0; i < numGroups; ++i) {
            positions.push([(Math.round(radius*Math.cos(i*theta)) + originShift).toString(),
                (originShift-Math.round(radius*Math.sin(i*theta))).toString()]);
        }
    }
    return positions;
}



// Main component for managing device groups and WebSocket connection
function Crown() {
    // Hooks & State
    const [thisDevice,setThisDevice] = useState({
        name:"Caraxes",
        type:""
    });

    const windowSize = useSize();

    const connection = useRef(null);
    useEffect(() => {
        // const ws = new WebSocket('ws://localhost:8080');
        // ws.onopen = () => {sendMessage(Message.CONNECTION,{text:"Device connected successfully"})};
        // ws.onmessage = handleMessage;
        // ws.onclose = onClose;
        // connection.ws = ws
        
    },[])

    const [deviceGroups, setDeviceGroups] = useState([{id:1, color:colors[0], devices:[{name:"Vermithor",type:'A'}], bubble:false}]);

    // State Change Helper methods
    
    // Adds new device groups based on the provided device list
    const addGroups = (deviceList) => {
        let newDeviceGroups = [];
        let groupsMap = new Map();
        let maxId = 0
        deviceList.forEach(device => {
            if (!groupsMap.has(device.groupId)) {
                groupsMap.set(device.groupId, []);
            }
            groupsMap.get(device.groupId).push({ name: device.name, type: device.type });
            maxId = Math.max(maxId, device.groupId);
        });

        for (let i=1; i <= maxId; ++i) {
            if (groupsMap.has(i)) {
                let groupDeviceList = groupsMap.get(i)
                newDeviceGroups.push({id:i, color:colors[i-1], devices:groupDeviceList, bubble:groupDeviceList.length > 1})
            }
        }
        console.log(newDeviceGroups)
        setDeviceGroups(newDeviceGroups);
    }

    // Adds a new device to the device groups
    const addDevice = (newId, name,type) => {
        setDeviceGroups(deviceGroups => {
            let newDeviceGroups = [...deviceGroups, {id:newId, color:colors[newId-1], devices:[{name:name,type:type}], bubble:false}].sort((a,b) => (a.id-b.id))
            console.log(newDeviceGroups)
            return newDeviceGroups
        });
    };

    // Merges two device groups into one
    const mergeGroups = (id1,id2) => {
        setDeviceGroups(deviceGroups => {
            let updatedGroups = [];
            for (let group of deviceGroups) {
                if (group.id === id2) {
                    const group1 = deviceGroups.find(g => g.id === id1);
                    const mergedDevices = [...group.devices, ...group1.devices];
                    updatedGroups.push({...group, devices: mergedDevices, bubble:mergedDevices.length > 1});
                } else if (group.id !== id1) { // Skip group id1 since it will be merged later
                    updatedGroups.push(group);
                }
            }
            return updatedGroups
        });
    }

    // Removes a device by name from the device groups
    const removeDevice = (name) => {
        setDeviceGroups(deviceGroups => {
            deviceGroups.reduce((acc,group) => {
                let newDevices = group.devices.filter(device => device.name !== name);
                if (newDevices.length > 0) {
                    acc.push({...group,devices:newDevices})
                }
                return acc;
            },[]);
        });
    };

    // Websocket handlers
    async function sendMessage(type,message) {
        const data = {type, message}
        // if (connection.ws && connection.ws.readyState === WebSocket.OPEN) {
        //     console.log('Sent Message',data)
        //     connection.ws.send(JSON.stringify(data));
        // } else {
        //     console.warn('WebSocket is not open. Cannot send message.');
        // }
    }
    
    // Handles incoming WebSocket messages and updates state accordingly
    function handleMessage(event) {
        const {type,message} = JSON.parse(event.data);
        console.log(type,message)
        switch(type) {
            case Message.ADD_GROUPS:
                addGroups(message.devices);
                setThisDevice({name:message.name,type:message.type})
                break;
            case Message.ADD_DEVICE:
                addDevice(message.groupId,message.name,message.type)
                break;
            case Message.MERGE_GROUPS:
                mergeGroups(message.oldId,message.newId);
                break;
            case Message.CLOSE_DEVICE:
                removeDevice(message.name);
                break;   
            default:
                console.warn(`Unhandled message type: ${type}`);
            
        }
    }
    
    // Handles WebSocket connection closure and removes the device
    function onClose() {
        // removeDevice(connection.name);
        // let message = {name:connection.name};
        // sendMessage(Message.CLOSE_DEVICE, message);
    }


    // Drag & Drop event handlers
    // Handles drag over events during drag-and-drop operations
    function handleDragOver(event) {
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

    // Handles the end of a drag event and merges groups if necessary
    function handleDragEnd(event) {
        if (event.over !== null && event.over.id !== event.active.id) {
            mergeGroups(event.active.id,event.over.id);
            let message = {oldId:event.active.id,newId:event.over.id};
            sendMessage(Message.MERGE_GROUPS, message);
        }
    }

    // Monitors drag-and-drop events
    function Monitor() {
        useDndMonitor({
            onDragOver(event) {handleDragOver(event)},
            onDragEnd(event) {handleDragEnd(event)}
        })
    }
    
    // Generates positions for the device groups based on their count
    const positions = useMemo(() => {
        return deviceGroups ? generatePositions(deviceGroups.length,windowSize[1]) : []
    }, [deviceGroups,windowSize])


    // Rendered JSX
    return (
        <div className='flex flex-col place-content-center place-items-center md:flex-row md:mt-10'>
            {windowSize[1] < 768 ? (
                <div className='flex flex-row place-content-evenly place-items-evenly'>
                    <Info outerDivClasses='mx-auto scale-75 md:scale-100' name={thisDevice.name} color={deviceGroups.find(group => group.devices.some(device => device.name === thisDevice.name))?.color} type='E'/>
                    <SyncButton outerDivClasses='mx-auto scale-[0.7] md:scale-100' color='green'/>
                </div>

            ): (
                <>
                    <Info outerDivClasses='mx-auto order-1 scale-75 md:scale-100' name={thisDevice.name} color={deviceGroups.find(group => group.devices.some(device => device.name === thisDevice.name))?.color} type='E'/>
                    <SyncButton outerDivClasses='mx-auto order-3 scale-[0.7] md:scale-100' color='green'/>
                </>
            )}
            <div className='relative order-2 w-screen md:w-[35rem] md:h-[35rem]'>
                <Clock spin={deviceGroups ? deviceGroups.length <= 1 : true} width={windowSize[1]}/>
                <DndContext>
                <Monitor/>
                {deviceGroups && deviceGroups.map((group,idx) => {
                    return (
                    <DndIcon iconId={group.id} key={idx} top={positions[idx][0]} left={positions[idx][1]} bubble={group.bubble}>
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