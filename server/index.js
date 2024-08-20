import {WebSocketServer} from 'ws';
import {uniqueNamesGenerator,adjectives,animals} from 'unique-names-generator';

const config = {
    dictionaries: [adjectives,animals]
};

const Message = Object.freeze({
    CONNECTION: 'Connection',
    ADD_DEVICE: 'Add Device',
    UPDATE: 'Update',
    CLOSE_DEVICE: 'Close Device'
})

class ClipHopServer {
    constructor(port) {
        this.wss = new WebSocketServer({port:port})
        this.wss.on('connection', (ws, request) => this.onConnection(ws, request))
        this.ipToGroupsList = new Map();
        //this.wss.on('headers', (headers, request) => this.checkHeaders(headers, request))
        console.log('ClipHop is running on port', port)
    }

    onConnection(ws, request) {
        var device = new Device(ws, request);
        if (this.ipToGroupsList.has(device.ip)) {
            this.ipToGroupsList.get(device.ip).push(device);
        } else {
            this.ipToGroupsList.set(device.ip,[device]);
        }
        console.log(device.userAgent)
        ws.onmessage = (event) => (this.onMessage(device, event));
        ws.onerror =  () => console.error;
        console.log('Finished connection')
        console.log(this.ipToGroupsList.get(device.ip).length)
    }

    onMessage(device, event) {
        console.log('This is the event',event.data);
        const {type, message} = JSON.parse(event.data);
        let data = null;
        switch (type) {
            case Message.CONNECTION:
                data = {name:device.name, type:'A'};
                console.log(data);
                this.broadcastMessage(device,Message.ADD_DEVICE,data);
                break;
            case Message.UPDATE:
                data = {id1:message.id1,id2:message.id2};
                this.broadcastMessage(device,Message.UPDATE,data);
                break;
            case Message.CLOSE_DEVICE:
                data = {name:message.name};
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

    broadcastMessage(device,type,message) {
        for (let peerDevice of this.ipToGroupsList.get(device.ip)) {
            this.sendMessage(peerDevice.socket,type,message);
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