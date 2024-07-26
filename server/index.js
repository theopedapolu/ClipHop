import { WebSocketServer} from "ws"   

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
        
        ws.send("New Device Connected")
        console.log(device.userAgent)
        console.log(typeof device.ip)
        ws.on('message', (data) => (this.onMessage(ws, data)));
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
        this.ip = request.socket.remoteAddress;
        this.userAgent = request.headers['user-agent'];
        this.connectionTime = new Date();
    }
}

const clipServer = new ClipHopServer(8080)