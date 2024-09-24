import {WebSocketServer} from 'ws';
import {uniqueNamesGenerator,adjectives,animals} from 'unique-names-generator';

const config = {
    dictionaries: [adjectives,animals]
};

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

const HEARTBEAT_INTERVAL= 21000

class ClipHopServer {
    constructor(port) {
        this.wss = new WebSocketServer({port:port,clientTracking:true})
        this.wss.on('connection', (ws, request) => this.onConnection(ws, request))
        this.ipToDevicesList = new Map();
        this.ipToClipboard = new Map();

        // Check for pings from clients periodically
        const interval = setInterval(() => {
            console.log('Checking dead connections:')
            this.wss.clients.forEach((ws) => {
                if (!ws.isAlive) {
                    this.onClose(ws)
                } else {
                    ws.isAlive = false
                }
            })
        },HEARTBEAT_INTERVAL) 
        this.wss.on('close',()=>{clearInterval(interval)})
        //this.wss.on('headers', (headers, request) => this.checkHeaders(headers, request))
        console.log('ClipHop is running on port', port)
    }

    onConnection(ws, request) {
        const dev = new Device(ws, request);
        // Attach event listeners
        ws.onmessage = (event) => {this.onMessage(dev, event)};
        ws.onerror =  (event) => {console.error(event)}
        ws.onclose = () => {this.onClose(ws)}
    }

    onMessage(device, event) {
        console.log('This is the event',event.data);
        const {type, message} = JSON.parse(event.data);
        let DevicesList;
        let newDevicesList;
        switch (type) {
            case Message.CONNECTION:
                // Create list at device's ip if it doesn't exist
                if (!this.ipToDevicesList.has(device.socket.ip)) {
                    this.ipToDevicesList.set(device.socket.ip,[]);
                }
                // Find new group id and add device
                DevicesList = this.ipToDevicesList.get(device.socket.ip);
                let newId = 1;
                while (DevicesList.findIndex(dev => dev.socket.groupId == newId) >= 0) {
                    newId += 1;
                }
                device.socket.groupId = newId
                DevicesList.push(device)
                // Send messages
                newDevicesList = DevicesList.map(dev => ({groupId:dev.socket.groupId,name:dev.socket.name,type:'A'}))
                let newMessage = {groupId:newId,name:device.socket.name,type:'A'}
                this.broadcastMessage(device.socket,Message.ADD_DEVICE,newMessage,Message.ADD_GROUPS,{name:device.socket.name,type:device.type,id:newId,devices:newDevicesList});
                break;
            case Message.MERGE_GROUPS:
                // message = {oldId, newId}
                DevicesList = this.ipToDevicesList.get(device.socket.ip)
                for (let dev of DevicesList) {
                    if (dev.socket.groupId === message.oldId) {
                        dev.socket.groupId = message.newId
                    }
                }
                const clipboard = this.ipToClipboard.get(device.socket.ip + message.newId.toString())
                message.newClipboard = clipboard
                this.broadcastMessage(device.socket,Message.MERGE_GROUPS,message,Message.UPDATE_CLIPBOARD,{newClipboard:clipboard});
                break;
            case Message.UPDATE_CLIPBOARD:
                // message = {groupId,clipboard}
                this.ipToClipboard.set(device.socket.ip + message.groupId.toString(),message.clipboard)
                let updateMessage = {groupId:message.groupId,newClipboard:message.clipboard}
                this.broadcastMessage(device.socket,Message.UPDATE_CLIPBOARD,updateMessage)
                break;
            case Message.PING:
                device.socket.isAlive = true
                break;
            default:
                console.warn(`Unhandled message type: ${type}`);
        }
    }

    onClose(ws) {
        // Remove device from stored state
        console.log('Closing device ', ws.name)
        if (!this.ipToDevicesList.has(ws.ip)) {
            return
        }

        let newDevicesList = this.ipToDevicesList.get(ws.ip).filter((dev) => dev.socket.name !== ws.name)
        let found = newDevicesList.length !== this.ipToDevicesList.get(ws.ip).length
        if (found && newDevicesList.length > 0) {
            this.ipToDevicesList.set(ws.ip, newDevicesList)
        } else {
            this.ipToDevicesList.delete(ws.ip)
        }

        // Remove clipboard content
        const countGroup = newDevicesList.reduce((count,dev) => {
            return dev.socket.groupId === ws.groupId ? count + 1 : count
        },0)
        if (countGroup === 0) {
            this.ipToClipboard.delete(ws.ip + ws.groupId.toString())
        }
        
        if (found && newDevicesList.length > 0) {
            this.broadcastMessage(ws,Message.CLOSE_DEVICE,{groupId:ws.groupId, name:ws.name})
        }

        ws.terminate()
    }

    sendMessage(clientSocket,type,message) {
        const data = {type, message};
        clientSocket.send(JSON.stringify(data));
    }

    broadcastMessage(socket,type,message,deviceType="",deviceMessage="") {
        if (deviceType) {
            this.sendMessage(socket,deviceType,deviceMessage);
        }
        if (type) {
            for (let peerDevice of this.ipToDevicesList.get(socket.ip)) {
                if (peerDevice.socket.name !== socket.name) {
                    this.sendMessage(peerDevice.socket,type,message);
                }
            }
        }
    }
}


class Device {
    constructor(ws, request) {
        this.socket = ws;
        this.socket.isAlive = false;
        this.socket.name = uniqueNamesGenerator(config);
        this.socket.groupId = 0;
        this.socket.ip = request.socket.remoteAddress;
        this.userAgent = request.headers['user-agent'];
        this.connectionTime = new Date();
    }
}

const server = new ClipHopServer(8080);