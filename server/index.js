import {WebSocketServer} from 'ws';
import {uniqueNamesGenerator,adjectives,animals} from 'unique-names-generator';

const config = {
    dictionaries: [adjectives,animals]
};

const Message = Object.freeze({
    CONNECTION: 'Connection',
    ADD_DEVICE: 'Add Device',
    MERGE_GROUPS: 'Merge Groups',
    UPDATE_CLIPBOARD: 'Update Clipboard',
    GET_CLIPBOARD: 'Get Clipboard',
    CLOSE_DEVICE: 'Close Device'
})

class ClipHopServer {
    constructor(port) {
        this.wss = new WebSocketServer({port:port})
        this.wss.on('connection', (ws, request) => this.onConnection(ws, request))
        this.ipToGroupsList = new Map();
        this.latestState = "";
        //this.wss.on('headers', (headers, request) => this.checkHeaders(headers, request))
        console.log('ClipHop is running on port', port)
    }

    onConnection(ws, request) {
        var dev = new Device(ws, request);
        if (!this.ipToGroupsList.has(dev.ip)) {
            this.ipToGroupsList.set(dev.ip,[]);
        }
        // Find new group id and create new group
        groupsList = this.ipToGroupsList.get(dev.ip);
        newId = groupsList.findIndex((group,idx) => group.id !== idx+1);
        newId = newId === -1 ? groupsList.length + 1 : newId + 1;
        groupsList.push({groupId:newId,device:dev})

        // Attach event listeners
        ws.onmessage = (event) => (this.onMessage(dev, event));
        ws.onerror =  () => console.error;
    }

    onMessage(device, event) {
        console.log('This is the event',event.data);
        const {type, message} = JSON.parse(event.data);
        switch (type) {
            case Message.CONNECTION:
                groupsList = this.ipToGroupsList.get(device.ip)
                newDeviceList = groupsList.map(dev => ({groupId,name:dev.name,type:'A'}))
                message = {name:device.name,type:'A'}
                this.broadcastMessage(device,Message.ADD_DEVICE,message,Message.ADD_DEVICE,newDeviceList);
                break;
            case Message.MERGE_GROUPS:
                groupsList = this.ipToGroupsList.get(device.ip)
                for (let dev of groupsList) {
                    if (dev.groupId === message.oldId) {
                        dev.groupId = message.newId
                    }
                }
                this.broadcastMessage(device,Message.MERGE_GROUPS,message);
                break;
            case Message.CLOSE_DEVICE:
                groupsList = this.ipToGroupsList.get(device.ip);
                newDevicesList = groupsList.filter(dev.device.name !== message.name)
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
        for (let peerDevice of this.ipToGroupsList.get(device.ip)) {
            if (peerDevice.device.name !== device.name) {
                this.sendMessage(peerDevice.socket,type,message);
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