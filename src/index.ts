import express, { Application, Request, Response } from "express";
import cors from "cors";
import { database } from "./database";
import * as dotenv from "dotenv";
import { AppRoutes } from "./routes/appRoutes";
import { UsersRoutes } from "./routes/userRoutes";
import { GameRoutes } from "./routes/gameRoutes";
import { AdminRoutes } from "./routes/adminRoutes";
import { createServer } from "node:http";
dotenv.config();

const app: Application = express();
const port = 3001;
app.use(express.json());
app.use(cors());

app.use("/user", UsersRoutes());
app.use("/game", GameRoutes());
app.use("/app", AppRoutes());
app.use("/adm", AdminRoutes());

export async function bootstrapServer() {
  await database.initialize();
  return createServer(app);
}

/* database.initialize().then(() => {
  httpServer.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}); */
