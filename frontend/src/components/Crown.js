import React, {useEffect, useRef} from 'react';
import Clock from './Clock';
import Message from './Message';
import DeviceGroup from './DeviceGroup';
import {DndContext, useDndMonitor} from '@dnd-kit/core';
import DndIcon from './DnDIcon';
import SyncButton from './SyncButton';
import UpdateButton from './UpdateButton';
import Info from './Info';
import useDevices from './useDevices';

// List of colors used for groups
const colors = ['bg-emerald-500','bg-blue-500','bg-rose-500','bg-amber-500','bg-violet-500'];

// ClipHop Server URL
const CLIPHOP_SERVER = 'wss://ws.cliphop.net'

const MessageType = Object.freeze({
    CONNECTION: 'Connection',
    ADD_DEVICE: 'Add Device',
    ADD_GROUPS: 'Add Groups',
    MERGE_GROUPS: 'Merge Groups',
    UPDATE_CLIPBOARD: 'Update Clipboard',
    GET_CLIPBOARD: 'Get Clipboard',
    PING: 'Ping',
    CLOSE_DEVICE: 'Close Device'
})
  

// Main component for managing device groups and WebSocket connection
function Crown() {
    // Hooks & State
    const {thisDevice,setThisDevice,deviceGroups,addGroups,addDevice,mergeGroups,removeDevice,deviceDragOver,positions} = useDevices()
    const connection = useRef({ws:null,clipboard:"",id:1});

    useEffect(() => {
        connection.current.id = thisDevice.id;
    },[thisDevice])

    useEffect(() => {
        const ws = new WebSocket(CLIPHOP_SERVER);
        connection.current.ws = ws
        ws.onopen = () => {sendMessage(MessageType.CONNECTION,{text:"Device connected successfully"})};
        ws.onmessage = handleMessage;
        // const interval = setInterval(() => {sendMessage(MessageType.PING,{text:'heartbeat'})}, PING_INTERVAL)
        // ws.onclose = () => {
        //     clearInterval(interval)
        //     ws.close()
        //}
    },[])


    // State Change Helper methods
    // Updates Clipboard
    async function updateClipboard() {
        await navigator.clipboard.writeText(connection.current.clipboard)
        setThisDevice((d) => ({...d,syncButtonColor:'green'}))
    }

    // Updates Group Clipboard
   async function updateGroupClipboard() {
        try {
            const data = await navigator.clipboard.readText()
            if (connection.current.clipboard !== data) {
                connection.current.clipboard = data
                const message = {groupId:connection.current.id,clipboard:connection.current.clipboard}
                await sendMessage(MessageType.UPDATE_CLIPBOARD,message)
            }
        } catch(err) {
            console.error("Could not read clipboard")
        }
    }

    // Websocket handlers
    async function sendMessage(type,message) {
        const data = {type, message}
        if (connection.current.ws && connection.current.ws.readyState === WebSocket.OPEN) {
            connection.current.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not open. Cannot send message.');
        }
    }
    
    // Handles incoming WebSocket messages and updates state accordingly
    function handleMessage(event) {
        const {type,message} = JSON.parse(event.data);
        switch(type) {
            case MessageType.ADD_GROUPS:
                addGroups(message.devices);
                setThisDevice({name:message.name,type:message.type,id:message.id,syncButtonColor:'green'})
                break;
            case MessageType.ADD_DEVICE:
                addDevice(message.groupId,message.name,message.type)
                break;
            case MessageType.MERGE_GROUPS:
                if (connection.current.id === message.oldId && connection.current.clipboard !== message.newClipboard) {
                    connection.current.clipboard = message.newClipboard;
                    setThisDevice((d) => ({...d,id:message.newId,syncButtonColor:'red'}))
                }
                mergeGroups(message.oldId,message.newId);
                break;
            case MessageType.UPDATE_CLIPBOARD:
                if (connection.id === message.groupId && connection.current.clipboard !== message.newClipboard) {
                    connection.current.clipboard = message.newClipboard;
                    setThisDevice((d) => ({...d,syncButtonColor:'red'}))
                }
                break;
            case MessageType.CLOSE_DEVICE:
                removeDevice(message.name);
                break;   
            default:
                console.warn(`Unhandled message type: ${type}`);
            
        }
    }

    // Drag & Drop event handlers
    // Handles drag over events during drag-and-drop operations
    function handleDragOver(event) {
        deviceDragOver(event)
    }
    
    // Handles the end of a drag event and merges groups if necessary
    function handleDragEnd(event) {
        if (event.over !== null && event.over.id !== event.active.id) {
            mergeGroups(event.active.id,event.over.id);
            let message = {oldId:event.active.id,newId:event.over.id};
            sendMessage(MessageType.MERGE_GROUPS, message);
        }
    }

    // Monitors drag-and-drop events
    function Monitor() {
        useDndMonitor({
            onDragOver(event) {handleDragOver(event)},
            onDragEnd(event) {handleDragEnd(event)}
        })
    }

    const getMessageDispatch = () => {
        if (deviceGroups.filter(group => group.devices.length >= 2).length >= 1) {
            return window.innerWidth <= 768 ? "Click UPDATE to update the group's clipboard based on this device and SYNC to copy the updated clipboard onto this device":
            <p>Click UPDATE to update the group's clipboard based on this device<br/>Click SYNC to copy the updated clipboard onto this device</p>
        } else if (deviceGroups.length >= 2) {
            return "Drag and Drop devices onto each other to form clipboard sync groups"
        } else {
            return "Open ClipHop on another device to sync your clipboards"
        }
    }

    // Rendered JSX
    return (
        <div className='md:space-y-16'>
        <Message dispatch={getMessageDispatch()}/>
        <div className='flex flex-col w-screen place-content-evenly place-items-center md:flex-row'>
            {window.innerWidth <= 768 ? (
                <>
                <Info outerDivClasses='mx-auto order-1 scale-75 fade-in' name={thisDevice.name} color={colors[thisDevice.id-1]} type={thisDevice.type ? thisDevice.type : 'Mac'}/>
                <div className='order-3 flex flex-row place-content-evenly ml-5 fade-in' style={{marginTop:`${window.innerWidth+10}px`}}>
                    <SyncButton outerDivClasses='mx-auto scale-75' color={thisDevice.syncButtonColor} onClick={updateClipboard}/>
                    <UpdateButton outerDivClasses='mx-auto scale-75' onClick={updateGroupClipboard}/>
                </div>
                </>

            ): (
                <>
                    <Info outerDivClasses='order-1 fade-in' name={thisDevice.name} color={colors[thisDevice.id-1]} type={thisDevice.type ? thisDevice.type : 'Mac'}/>
                    <div className='order-3 flex flex-col place-content-evenly fade-in'>
                        <SyncButton outerDivClasses='my-12' color={thisDevice.syncButtonColor} onClick={updateClipboard}/>
                        <UpdateButton onClick={updateGroupClipboard}/>
                    </div>
                </>
            )}
    
            <div className='relative order-2 w-screen md:w-[35rem] md:h-[35rem]'>
                <Clock spin={deviceGroups ? deviceGroups.length === 1 && deviceGroups[0].devices.length === 1: true} width={window.innerWidth}/>
                <DndContext>
                <Monitor/>
                {deviceGroups && deviceGroups.map((group,idx) => {
                    return (
                    <DndIcon iconId={group.id} key={idx} top={positions[idx][0]} left={positions[idx][1]} bubble={group.devices.length > 1}>
                    <DeviceGroup devices={group.devices} color={group.color}/>
                    </DndIcon>
                    )
                })}
                </DndContext>   
            </div>
        </div>
        </div>
    )
}

export default Crown;