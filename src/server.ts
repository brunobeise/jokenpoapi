import { Server } from "socket.io";
import { bootstrapServer } from ".";
import { initializeSocket } from "./services/socket/socket";
import AppRepository from "./repository/AppRepository";


bootstrapServer().then(async (httpServer) => {
  const port = process.env.PORT || 3001;
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  initializeSocket(io);

  httpServer.listen(port, () => console.log(`rodando na porta ${port}`));

  console.log(await new AppRepository().getBotBalance());
});
