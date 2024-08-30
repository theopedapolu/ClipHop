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
    CLOSE_DEVICE: 'Close Device'
})

class ClipHopServer {
    constructor(port) {
        this.wss = new WebSocketServer({port:port})
        this.wss.on('connection', (ws, request) => this.onConnection(ws, request))
        this.ipToDevicesList = new Map();
        //this.wss.on('headers', (headers, request) => this.checkHeaders(headers, request))
        console.log('ClipHop is running on port', port)
    }

    onConnection(ws, request) {
        const dev = new Device(ws, request);
        console.log(dev.name,dev.socket === undefined)

        // Attach event listeners
        ws.onmessage = (event) => (this.onMessage(dev, event));
        ws.onerror =  () => console.error;
    }

    onMessage(device, event) {
        console.log('This is the event',event.data);
        const {type, message} = JSON.parse(event.data);
        let DevicesList;
        let newDevicesList;
        switch (type) {
            case Message.CONNECTION:
                // Create list at device's ip if it doesn't exist
                if (!this.ipToDevicesList.has(device.ip)) {
                    this.ipToDevicesList.set(device.ip,[]);
                }
                // Find new group id and add device
                DevicesList = this.ipToDevicesList.get(device.ip);
                let newId = 1;
                while (DevicesList.findIndex(group => group.id == newId) >= 0) {
                    newId += 1;
                }
                DevicesList.push({id:newId,device:device})
                // Send messages
                newDevicesList = DevicesList.map(d => ({groupId:d.id,name:d.device.name,type:'A'}))
                let newMessage = {groupId:newId,name:device.name,type:'A'}
                this.broadcastMessage(device,Message.ADD_DEVICE,newMessage,Message.ADD_GROUPS,{name:device.name,type:device.type,devices:newDevicesList});
                break;
            case Message.MERGE_GROUPS:
                DevicesList = this.ipToDevicesList.get(device.ip)
                for (let dev of DevicesList) {
                    if (dev.id === message.oldId) {
                        dev.id = message.newId
                    }
                }
                this.broadcastMessage(device,Message.MERGE_GROUPS,message);
                break;
            case Message.CLOSE_DEVICE:
                DevicesList = this.ipToDevicesList.get(device.ip);
                newDevicesList = DevicesList.filter(dev.device.name !== message.name)
                this.ipToDevicesList.set(device.ip, newDevicesList)
                this.broadcastMessage(device,Message.CLOSE_DEVICE,message)
                console.log('Closed device')
                break;
            default:
                console.warn(`Unhandled message type: ${type}`);
        }
    }

    sendMessage(clientSocket,type,message) {
        const data = {type, message};
        clientSocket.send(JSON.stringify(data));
    }

    broadcastMessage(device,type,message,deviceType="",deviceMessage="") {
        if (deviceType) {
            this.sendMessage(device.socket,deviceType,deviceMessage);
        }
        for (let peerDevice of this.ipToDevicesList.get(device.ip)) {
            if (peerDevice.device.name !== device.name) {
                this.sendMessage(peerDevice.device.socket,type,message);
            }
        }
    }
}


class Device {
    constructor(ws, request) {
        this.socket = ws;
        this.name = uniqueNamesGenerator(config);
        this.ip = request.socket.remoteAddress;
        this.userAgent = request.headers['user-agent'];
        this.connectionTime = new Date();
    }
}

const server = new ClipHopServer(8080);