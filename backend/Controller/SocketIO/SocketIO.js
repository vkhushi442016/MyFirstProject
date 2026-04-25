const { Server } = require('socket.io')

let io;

const socket = {
    init: (server) => {
        io = new Server(server, {
            cors: {
                origin: '*',
                methods: ["GET", "POST"]
            }
        });

        io.on("connection", (socket) => {
            console.log('User connected: ', socket.id);

            socket.on('disconnect', () => {
                console.log('User disconnected: ', socket.id);     
            })
        })

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