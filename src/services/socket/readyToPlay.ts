import { Server, Socket } from "socket.io";
import UserRepository from "../../repository/UserRepository";
import { createRoom, findOpponent } from "./rooms";
import { QueuedPlayer, waitingQueues } from "./socket";

export default async function readyToPlay(id: string, betValue: number, socket: Socket, io: Server) {
    const userRepository = new UserRepository();
    const playerData = await userRepository.getUserById(id);

    if (!playerData) return;

    if (!waitingQueues.hasOwnProperty(betValue)) {
        console.error("Invalid bet value");
        return;
    }


    const queuedPlayer: QueuedPlayer = {
        socket,
        playerData
    };

    waitingQueues[betValue].push(queuedPlayer);

    if (waitingQueues[betValue].length >= 2) {
        const player1 = waitingQueues[betValue].shift();
        const player2 = waitingQueues[betValue].shift();
        createRoom(player1!, player2!, betValue, io);
    }

}
