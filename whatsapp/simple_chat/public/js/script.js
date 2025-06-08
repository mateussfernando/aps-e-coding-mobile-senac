
const socket = io("http://localhost:3000");
let username;

document.getElementById('enter-chat').addEventListener('click', () => {
    username = document.getElementById('username').value;
    if (username) {
        socket.emit('newUser', username);
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-box').style.display = 'flex';
    }
});

document.getElementById('send-button').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    if (message && username) {
        socket.emit('chatMessage', message);
        document.getElementById('message').value = '';
    }
});

socket.on('userJoined', (user) => {
    const item = document.createElement('li');
    item.textContent = `${user} entrou no chat`;
    item.classList.add('system-message');
    document.getElementById('messages').appendChild(item);
});

socket.on('message', (data) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${data.user}</strong>: ${data.text}`;
    document.getElementById('messages').appendChild(item);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

socket.on('userLeft', (user) => {
    const item = document.createElement('li');
    item.textContent = `${user} saiu do chat`;
    item.classList.add('system-message', 'user-left');
    document.getElementById('messages').appendChild(item);
});
