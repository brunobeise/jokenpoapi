import { Server, Socket, Server as SocketServer } from "socket.io";
import { findOpponent, removeFromQueueAndRoom } from "./rooms";
import { User } from "../../entity/UserEntity";
import UserRepository from "../../repository/UserRepository";
import leaveQueueAtConnection, { disconnection } from "./disconnection";
import readyToPlay from "./readyToPlay";
const userRepository = new UserRepository()

export interface QueuedPlayer {
  socket: Socket;
  playerData: User;
}

export let connecteds: string[] = [];


export const waitingQueues: { [key: number]: QueuedPlayer[] } = {
  10: [],
  25: [],
  50: [],
  100: []
};


export const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    leaveQueueAtConnection(socket)
    connecteds.push(socket.id)
    socket.on("readyToPlay", (params: { id: string, betValue: number }) => readyToPlay(params.id, params.betValue, socket, io))
    socket.on("disconnect", () => disconnection(socket))
    socket.on("leaveQueueAndRoom", () => removeFromQueueAndRoom(socket))
    socket.on("disconnecting", () => removeFromQueueAndRoom(socket));
  });



  // ... (resto do código)
};




