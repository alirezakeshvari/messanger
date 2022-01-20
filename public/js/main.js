const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// Get username and room

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//join chatroom

socket.emit("joinRoom", {username, room});

socket.on("message", (message) => {
  console.log(message);
  sendMessage(message);

  // scroll last message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Send message

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit("chatMessage", msg);

  // clear input

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function sendMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}: <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}
