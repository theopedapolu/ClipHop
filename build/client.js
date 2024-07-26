const wss = new WebSocket('ws://localhost:8080')
wss.onopen = (event) => (wss.send('Hi this is a client'))
lastClipboardText = '';
async function checkClipboard() {
    window.focus();
    const text = await navigator.clipboard.readText();
    if (text != lastClipboardText) {
        lastClipboardText = text;
        wss.send(text);
    }
}

async function writeClipboard() {
    window.focus()
    await navigator.clipboard.writeText("Leland Stanford")
}
setInterval(writeClipboard ,5000);