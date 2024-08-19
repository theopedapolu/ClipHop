const ws = new WebSocket('ws://localhost:8080')
ws.onopen = (event) => (ws.send('Hi this is a client'))
