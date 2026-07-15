const { Server } = require('socket.io')

let io;
console.log("updated socket file loading");

const socket = {
    init: (server) => {
        io = new Server(server, {
            cors: {
                origin: '*',
                methods: ["GET", "POST"]
            }
        });

        io.on("connection", (client) => {
            console.log('User connected: ', client.id);

            client.onAny((event, ...args) => {
        console.log("EVENT RECEIVED:", event, args);
    });
    
            client.on("registerRole", ({ role, dise_code }) => {

                console.log("Role received", role, dise_code);

                if (role === "admin") {
                    client.join("adminRoom");
                    console.log("Admin joined adminRoom:", client.id);
                }

                if (role === "principal" && dise_code) {
                    client.join(`school_${dise_code}`);
                    console.log(`Principal joined school_${dise_code}`);
                }
            });

            client.on('disconnect', () => {
                console.log('User disconnected: ', client.id);
            });
        });

        return io;
    },

    getIO: () => {
        if (!io) {
            throw new Error("Socket not initialized");
        }
        return io;
    }
}

module.exports = socket;