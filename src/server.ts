import { Server } from "socket.io";
import { bootstrapServer } from ".";
import { initializeSocket } from "./services/socket/socket";

bootstrapServer().then((httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  initializeSocket(io);
  httpServer.listen(3001, () => console.log(`rodando`));
});
