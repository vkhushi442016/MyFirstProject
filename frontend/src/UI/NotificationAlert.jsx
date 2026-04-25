import socket from "./socket";
import useStore from "../common/store/store";

let initialized = false;

export const initSocket = () => {
  if (initialized) return;
  initialized = true;

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on("alert", (data) => {
    console.log("🔥 ALERT RECEIVED:", data);

    useStore.getState().addNotification(data);
  });
};

export default initSocket;