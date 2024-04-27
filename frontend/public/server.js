import { WebSocketServer} from "ws"   

class ClipHopServer {
    constructor(port) {
        this.wss = new WebSocketServer({port:port})
        this.wss.on('connection', (ws, request) => this.onConnection(ws, request))
        //this.wss.on('headers', (headers, request) => this.checkHeaders(headers, request))
    }

    onConnection(ws, request) {
        ws.on('error', console.error)
        ws.on('message', (data) => (console.log('received: %s', data)))
        console.log('connected')
        ws.send('something')
    }

    // onMessage() {

    // }
}

const clipServer = new ClipHopServer(8080)

// class Peer {
//     constructor(ws, request) {

//     }
// }
