const btn = document.getElementById('btn');
const socket = new WebSocket('ws://localhost:5000/');

console.log(btn)

socket.onopen = () => {
    socket.send(JSON.stringify({
        method: 'connection',
        username: 'Kenobi',
        id: 17
    }));
}

socket.onmessage = (event) => {
    console.log('Messaage from server:', event.data);
}

btn.onclick = () => {
    socket.send(JSON.stringify({
        message: 'Hello there',
        method: 'message',
        username: 'Kenobi',
        id: 17
    }));
}