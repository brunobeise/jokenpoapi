import { Socket } from "socket.io";
import { connecteds, waitingQueues } from "./socket";

export function disconnection(socket: Socket) {

    const index = connecteds.indexOf(socket.id);
    if (index > -1) {
        connecteds.splice(index, 1);
    }
    console.log(`Jogador desconectado: ${socket.id}`);

}

export default function leaveQueueAtConnection(socket: Socket) {
    // Iterar sobre todas as filas para remover o jogador, se ele estiver em alguma delas
    for (const betValue in waitingQueues) {
        const queue = waitingQueues[betValue];
        const existingIndex = queue.findIndex(queuedPlayer => queuedPlayer.socket.id === socket.id);

        if (existingIndex !== -1) {
            queue.splice(existingIndex, 1);
        }
    }
}

