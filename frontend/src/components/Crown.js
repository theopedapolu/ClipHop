import React, {useEffect, useState, useRef, useMemo} from 'react';
import Clock from './Clock';
import DeviceGroup from './DeviceGroup';
import {DndContext, useDndMonitor} from '@dnd-kit/core';
import DndIcon from './DnDIcon';
import SyncButton from './SyncButton';
import UpdateButton from './UpdateButton';
import Info from './Info';
import useSize from './useSize';

const Message = Object.freeze({
    CONNECTION: 'Connection',
    ADD_DEVICE: 'Add Device',
    ADD_GROUPS: 'Add Groups',
    MERGE_GROUPS: 'Merge Groups',
    UPDATE_CLIPBOARD: 'Update Clipboard',
    GET_CLIPBOARD: 'Get Clipboard',
    PING: 'Ping',
    CLOSE_DEVICE: 'Close Device'
})

// List of colors used for groups
const colors = ['bg-emerald-500','bg-blue-500','bg-rose-500','bg-amber-500','bg-violet-500'];

// Interver to send pings to server
const PING_INTERVAL = 10000

// ClipHop Server URL
const CLIPHOP_SERVER = 'wss://ws.cliphop.net:443';


// Generates positions for device groups based on the number of groups
function generatePositions(numGroups,width) {
    let radius = width >= 768 ? 13 : Number(((13/35)*width/16).toFixed(2))
    let originShift = width >= 768 ? 13.5 : Number(((11.5/35)*width/16).toFixed(2))
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
        type:"",
        id:1,
        syncButtonColor:'green'
    });

    const windowSize = useSize();

    const connection = useRef({ws:null,clipboard:"",id:1});

    useEffect(() => {
        connection.current.id = thisDevice.id;
    },[thisDevice])

    useEffect(() => {
        const ws = new WebSocket(CLIPHOP_SERVER);
        connection.current.ws = ws
        ws.onopen = () => {sendMessage(Message.CONNECTION,{text:"Device connected successfully"})};
        ws.onmessage = handleMessage;
        // const interval = setInterval(() => {sendMessage(Message.PING,{text:'heartbeat'})}, PING_INTERVAL)
        // ws.onclose = () => {
        //     clearInterval(interval)
        //     ws.close()
        //}
    },[])

    // const [deviceGroups, setDeviceGroups] = useState([{id:1, color:colors[0], devices:[{name:"Vermithor",type:'A'}], bubble:false}]);
    const [deviceGroups, setDeviceGroups] = useState([])

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
        setDeviceGroups(newDeviceGroups);
    }

    // Adds a new device to the device groups
    const addDevice = (newId, name,type) => {
        setDeviceGroups(deviceGroups => {
            let newDeviceGroups = [...deviceGroups, {id:newId, color:colors[newId-1], devices:[{name:name,type:type}], bubble:false}].sort((a,b) => (a.id-b.id))
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

    // Removes a device by name from the deviceGroups state
    const removeDevice = (name) => {
        setDeviceGroups(deviceGroups => {
            let acc = []
            for (let group of deviceGroups) {
                let newDevices = group.devices.filter((device) => device.name !== name);
                if (newDevices.length > 0) {
                    acc.push({...group,devices:newDevices})
                }
            }
            return acc
        });
    };

    // Updates Clipboard
    async function updateClipboard() {
        console.log('clipboard before',connection.current.clipboard)
        await navigator.clipboard.writeText(connection.current.clipboard)
        setThisDevice((d) => ({...d,syncButtonColor:'green'}))
    }

    // Updates Group Clipboard
   async function updateGroupClipboard() {
        try {
            const data = await navigator.clipboard.readText()
            console.log(connection.current.clipboard,data)
            if (connection.current.clipboard !== data) {
                connection.current.clipboard = data
                const message = {groupId:connection.current.id,clipboard:connection.current.clipboard}
                await sendMessage(Message.UPDATE_CLIPBOARD,message)
                console.log("Updated clipboard message sent",message)
            }
        } catch(err) {
            console.error("Could not read clipboard")
        }
    }

    // Websocket handlers
    async function sendMessage(type,message) {
        const data = {type, message}
        if (connection.current.ws && connection.current.ws.readyState === WebSocket.OPEN) {
            console.log('Sent Message',data)
            connection.current.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not open. Cannot send message.');
        }
    }
    
    // Handles incoming WebSocket messages and updates state accordingly
    function handleMessage(event) {
        const {type,message} = JSON.parse(event.data);
        console.log(type,message)
        switch(type) {
            case Message.ADD_GROUPS:
                addGroups(message.devices);
                setThisDevice({name:message.name,type:message.type,id:message.id,syncButtonColor:'green'})
                break;
            case Message.ADD_DEVICE:
                addDevice(message.groupId,message.name,message.type)
                break;
            case Message.MERGE_GROUPS:
                if (connection.current.id === message.oldId && connection.current.clipboard !== message.newClipboard) {
                    connection.current.clipboard = message.newClipboard;
                    setThisDevice((d) => ({...d,id:message.newId,syncButtonColor:'red'}))
                }
                mergeGroups(message.oldId,message.newId);
                break;
            case Message.UPDATE_CLIPBOARD:
                if (connection.id === message.groupId && connection.current.clipboard !== message.newClipboard) {
                    connection.current.clipboard = message.newClipboard;
                    setThisDevice((d) => ({...d,syncButtonColor:'red'}))
                }
                break;
            case Message.CLOSE_DEVICE:
                removeDevice(message.name);
                break;   
            default:
                console.warn(`Unhandled message type: ${type}`);
            
        }
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
        <div className='flex flex-col place-content-evenly place-items-center md:flex-row md:mt-10'>
            {windowSize[1] < 768 ? (
                <>
                <Info outerDivClasses='mx-auto order-1 scale-75' name={thisDevice.name} color={colors[thisDevice.id-1]} type='E'/>
                <div className='order-3 flex flex-row place-content-evenly ml-5' style={{marginTop:`${windowSize[1]+10}px`}}>
                    <SyncButton outerDivClasses='mx-auto scale-75' color={thisDevice.syncButtonColor} onClick={updateClipboard}/>
                    <UpdateButton outerDivClasses='mx-auto scale-75' onClick={updateGroupClipboard}/>
                </div>
                </>

            ): (
                <>
                    <Info outerDivClasses='order-1 scale-75 md:scale-100' name={thisDevice.name+thisDevice.id} color={colors[thisDevice.id-1]} type='E'/>
                    <div className='order-3 flex flex-row place-content-evenly ml-5 md:flex-col md:ml-0'>
                        <SyncButton outerDivClasses='md:my-12' color={thisDevice.syncButtonColor} onClick={updateClipboard}/>
                        <UpdateButton onClick={updateGroupClipboard}/>
                    </div>
                </>
            )}
    
            <div className='relative order-2 w-screen md:w-[35rem] md:h-[35rem]'>
                <Clock spin={deviceGroups ? deviceGroups.length === 1 && deviceGroups[0].devices.length === 1: true} width={windowSize[1]}/>
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