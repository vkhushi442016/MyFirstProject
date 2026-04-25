import { io } from "socket.io-client";

const socket = io("http://localhost:5008", {
  autoConnect: true
});

export default socket;