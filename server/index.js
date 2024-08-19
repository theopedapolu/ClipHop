import {WebSocketServer} from 'ws';
import {uniqueNamesGenerator,adjectives,animals} from 'unique-names-generator'
const config = {
    dictionaries: [adjectives,animals]
}

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
        ws.send("Device connected successfully")
        console.log(device.userAgent)
        ws.on('message', (data) => (this.onMessage(device, data)));
        ws.on('error', console.error);
        
    }

    onMessage(ws, data) {
        //
        console.log(data);
    }

    Message(data) {

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