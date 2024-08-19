import {WebSocketServer} from 'ws';
import {uniqueNamesGenerator,adjectives,animals} from 'unique-names-generator';

const config = {
    dictionaries: [adjectives,animals];
};

const Message = Object.freeze({
    CONNECTION: 'Connection',
    UPDATE: 'Update', 
    CLOSE_DEVICE: 'Close Device'
});

class ClipHopServer {
    constructor(port) {
        this.wss = new WebSocketServer({port:port})
        this.wss.on('connection', (ws, request) => this.onConnection(ws, request))
        this.ipToDeviceList = new Map();
        //this.wss.on('headers', (headers, request) => this.checkHeaders(headers, request))
        console.log('ClipHop is running on port', port)
    }

    onConnection(ws, request) {
        var device = new Device(ws, request);
        if (this.ipToDeviceList.has(device.ip)) {
            this.ipToDeviceList.get(device.ip).push(device);
        } else {
            this.ipToDeviceList.set(device.ip,[device]);
        }
        console.log(device.userAgent)
        ws.on('message', (event) => (this.onMessage(device, event)));
        ws.on('error', console.error);
    }

    onMessage(device, event) {
        const {type,message} = JSON.parse(event.data)
        switch (type) {
            case Message.CONNECTION:
                
                break;
            case Message.UPDATE:
                break;
            default:
        }

        console.log(data);
    }

    sendMessage(clientSocket,type,data) {
        const message = {type, data};
        clientSocket.send(JSON.stringify(message));
    }

    broadcastMessage(device,type,data) {
        for (peerDevice of this.ipToDeviceList.get(device.ip)) {
            if (peerDevice.name !== device.name) {
                this.sendMessage(peerDevice.socket,type,data);
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