const ws = new WebSocket('ws://localhost:8080');

function sendMessage(type,data) {
    const message = {type, data}
    ws.send(JSON.stringify(message));
}

ws.onopen = (event) => (sendMessage('connection',"Device connected successfully"));
ws.onmessage;
