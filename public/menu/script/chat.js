var socket = null;
var unreadCount = 0;

function initChat() {
    var protocol = window.location.href.startsWith('https://') ? 'wss' : 'ws';
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

    socket.onopen = () => {
        console.log('Connected to server');
    };

    socket.onclose = () => {
        console.log('Connection lost');
    };

    socket.onmessage = event => {
        console.log('Message from server:', event.data);
        var chatData = JSON.parse(event.data);
        if (chatData.type == 0) {
            loadChatHistory(chatData);
            unreadCount = chatData.list_message.length;
            showUnreadIcon();
        }
        else if (chatData.type == 1) {
            addOtherMessage(chatData.message, chatData.sender);
            unreadCount++;
            showUnreadIcon();
        }
        else if (chatData.type == 2) {
            notifyCart(chatData);
        }
    };
}

function toggleChat() {
    const chatPopup = document.getElementById('chatPopup');
    chatPopup.style.display = chatPopup.style.display === 'flex' ? 'none' : 'flex';
    const messages = document.getElementById('chatMessages');
    messages.scrollTop = messages.scrollHeight;
    if (chatPopup.style.display === 'flex') {
        hideUnreadIcon();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (message) {
        addUserMessage(message);
        sendMessageToServer(message);
        input.value = '';
    }
}

function sendMessageToServer(message) {
    socket.send(message);
}

function addUserMessage(message) {
    const messages = document.getElementById('chatMessages');
    const userMessageContainer = document.createElement('div');
    userMessageContainer.className = 'message-container user';

    const userName = document.createElement('div');
    userName.className = 'sender-name';
    userName.textContent = 'You';

    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.innerHTML = convertTextToEmoji(message);

    //userMessageContainer.appendChild(userName);
    userMessageContainer.appendChild(userMessage);
    messages.appendChild(userMessageContainer);


    messages.scrollTop = messages.scrollHeight;
}

function addOtherMessage(message, name) {
    var isBot = name == 'Bot';

    const messages = document.getElementById('chatMessages');
    const otherMessageContainer = document.createElement('div');
    otherMessageContainer.className = isBot ? 'message-container bot' : 'message-container other';

    const sender = document.createElement('div');
    sender.className = 'sender-name';
    sender.style.fontWeight = 'bold';
    sender.style.fontSize = '12px';
    sender.textContent = name;

    const otherMessage = document.createElement('div');
    otherMessage.className = isBot ? 'message bot' : 'message other';
    otherMessage.innerHTML = convertTextToEmoji(message);

    otherMessageContainer.appendChild(sender);
    otherMessageContainer.appendChild(otherMessage);
    messages.appendChild(otherMessageContainer);

    // Scroll to bottom
    messages.scrollTop = messages.scrollHeight;
}

function loadChatHistory(chatData) {
    chatData.list_message.forEach(msg => {
        if (msg.owned) {
            addUserMessage(msg.message);
        }
        else {
            addOtherMessage(msg.message, msg.sender);
        }
    });
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function showUnreadIcon() {
    const chatPopup = document.getElementById('chatPopup');
    var icon = document.getElementById('unread-icon');
    if (chatPopup.style.display != 'flex' && unreadCount > 0) {
        icon.style.display = 'flex';
        icon.innerHTML = unreadCount;
    }
    else {
        hideUnreadIcon();
    }
}

function hideUnreadIcon() {
    var icon = document.getElementById('unread-icon');
    icon.style.display = 'none';
    unreadCount = 0;
}

function convertTextToEmoji(inputText) {
    const emojiMap = {
        // Smiling Faces
        ':)': '😊',
        ':-)': '😊',
        ':D': '😄',
        ':-D': '😄',
        ':(': '☹️',
        ':-(': '☹️',
        ':P': '😜',
        ':-P': '😜',
        ';)': '😉',
        ';-)': '😉',
        ":'(": '😢',
        ":'-(": '😢',
        ':o': '😮',
        ':-o': '😮',
        ':O': '😲',
        ':-O': '😲',
        ':/': '😕',
        ':-/': '😕',
        '>:)': '😈',
        '>:-)': '😈',
        '>:/': '😒',
        '>:-/': '😒',
        '>:((': '😡',
        'XD': '😆',
        '<3': '❤️',
        '</3': '💔',

        // Gestures
        ':thumbsup:': '👍',
        ':thumbsdown:': '👎',
        ':clap:': '👏',
        ':wave:': '👋',
        ':ok:': '👌',
        ':peace:': '✌️',

        // Animals
        ':cat:': '🐱',
        ':dog:': '🐶',
        ':fox:': '🦊',
        ':panda:': '🐼',
        ':lion:': '🦁',
        ':unicorn:': '🦄',

        // Objects
        ':car:': '🚗',
        ':airplane:': '✈️',
        ':house:': '🏠',
        ':phone:': '📱',
        ':laptop:': '💻',
        ':gift:': '🎁',

        // Food
        ':pizza:': '🍕',
        ':burger:': '🍔',
        ':cake:': '🎂',
        ':apple:': '🍎',
        ':banana:': '🍌',

        // Weather
        ':sun:': '☀️',
        ':cloud:': '☁️',
        ':rain:': '🌧️',
        ':snow:': '❄️',

        // Miscellaneous
        ':star:': '⭐',
        ':heart:': '❤️',
        ':fire:': '🔥',
        ':check:': '✅',
        ':cross:': '❌'
    };

    // Replace all occurrences of text-based emoji with their equivalents
    const outputText = inputText.replace(/:\)|:-\)|:D|:-D|:\(|:-\(|:P|:-P|;\)|;\-\)|:\'\(|:\'-\(|:o|:-o|:O|:-O|:\/|:-\/|>:\)|>:\-\)|>:\/|>:\-\/|>:\(\(|XD|<3|<\/3|:thumbsup:|:thumbsdown:|:clap:|:wave:|:ok:|:peace:|:cat:|:dog:|:fox:|:panda:|:lion:|:unicorn:|:car:|:airplane:|:house:|:phone:|:laptop:|:gift:|:pizza:|:burger:|:cake:|:apple:|:banana:|:sun:|:cloud:|:rain:|:snow:|:star:|:heart:|:fire:|:check:|:cross:/g, (match) => {
        return emojiMap[match] || match;
    });

    return outputText;
}