import { Server } from "socket.io";
import { bootstrapServer } from ".";
import { initializeSocket } from "./services/socket/socket";
import AppRepository from "./repository/AppRepository";

bootstrapServer().then(async (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  initializeSocket(io);
  httpServer.listen(3001, () => console.log(`rodando`));
  console.log(await new AppRepository().getBotBalance());
});
