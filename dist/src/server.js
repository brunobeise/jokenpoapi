"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const _1 = require(".");
const socket_1 = require("./services/socket/socket");
(0, _1.bootstrapServer)().then((httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
        },
    });
    (0, socket_1.initializeSocket)(io);
    httpServer.listen(3001, () => console.log(`rodando`));
});
