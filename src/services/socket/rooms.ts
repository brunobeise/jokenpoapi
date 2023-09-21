import { Server, Socket } from "socket.io";
import { QueuedPlayer, waitingQueues } from "./socket";
import { v4 as uuid } from "uuid"
import { checkResult } from "../../utils/rules";
import UserRepository from "../../repository/UserRepository";
import leaveQueueAtConnection from "./disconnection";
import { newRatingCalculator } from "../../utils/rating";
const userRepository = new UserRepository()



export function createRoom(player1: QueuedPlayer, player2: QueuedPlayer, initialBetValue: number, io: Server) {


    const roomID = uuid();
    player1.socket.join(roomID);
    player2.socket.join(roomID);
    let betValue = initialBetValue;

    const choices = { player1: null, player2: null };

    const checkAndEmitResult = async () => {
        if (choices.player1 && choices.player2) {
            const result1 = checkResult(choices.player1, choices.player2);
            const result2 = checkResult(choices.player2, choices.player1);
            let newBalance1: number | undefined
            let newBalance2: number | undefined

            if (result1 === "win") {
                const newRating1 = newRatingCalculator(player1.playerData.rating, player2.playerData.rating, true);
                const newRating2 = newRatingCalculator(player2.playerData.rating, player1.playerData.rating, false);

                userRepository.addWin(player1.playerData.id),
                    newBalance1 = await userRepository.addMatch(player1.playerData.id, Number(betValue)),
                    newBalance2 = await userRepository.addMatch(player2.playerData.id, betValue * -1),
                    userRepository.editRating(player1.playerData.id, newRating1),
                    userRepository.editRating(player2.playerData.id, newRating2)

                console.log(`${player1.playerData.username} vence ${player2.playerData.username} em ${betValue} jokens`);
            }

            if (result1 === "loss") {
                const newRating1 = newRatingCalculator(player1.playerData.rating, player2.playerData.rating, false);
                const newRating2 = newRatingCalculator(player2.playerData.rating, player1.playerData.rating, true);

                userRepository.addWin(player2.playerData.id),
                    newBalance2 = await userRepository.addMatch(player2.playerData.id, Number(betValue)),
                    newBalance1 = await userRepository.addMatch(player1.playerData.id, betValue * -1),
                    userRepository.editRating(player1.playerData.id, newRating1),
                    userRepository.editRating(player2.playerData.id, newRating2)

                console.log(`${player2.playerData.username} vence ${player1.playerData.username} em ${betValue} jokens`);
            }
            if (result1 === "tie") {

                userRepository.addMatch(player2.playerData.id, 0),
                    userRepository.addMatch(player1.playerData.id, 0)

            }

            const resultData = {
                player1: {
                    data: player1.playerData,
                    playerHand: choices.player1,
                    computerHand: choices.player2,
                    result: result1,
                    betValue: betValue,
                    newBalance: newBalance1
                },
                player2: {
                    data: player2.playerData,
                    playerHand: choices.player2,
                    computerHand: choices.player1,
                    result: result2,
                    betValue: betValue,
                    newBalance: newBalance2
                }
            }
            io.to(roomID).emit("gameResult", resultData);
            choices.player1 = null;
            choices.player2 = null;
        }
    };

    player1.socket.on("makeChoice", (choice) => {
        choices.player1 = choice;
        player2.socket.emit("opponentChoice", choice);
        checkAndEmitResult();
    });

    player2.socket.on("makeChoice", (choice) => {
        choices.player2 = choice;
        player1.socket.emit("opponentChoice", choice);
        checkAndEmitResult();
    });

    player1.socket.on("requestBetChange", (newBetValue) => {
        player2.socket.emit("betChangeRequested", newBetValue);
    });

    player2.socket.on("requestBetChange", (newBetValue) => {
        player1.socket.emit("betChangeRequested", newBetValue);
    });

    player1.socket.on("approveBetChange", (newBetValue) => {
        io.to(roomID).emit("betValueChangedAccepted", newBetValue);
        betValue = newBetValue
    });

    player2.socket.on("approveBetChange", (newBetValue) => {
        io.to(roomID).emit("betValueChangedAccepted", newBetValue);
        betValue = newBetValue
    });

    player1.socket.on("rejectedBetChange", () => {
        io.to(roomID).emit("betValueChangedRejected", betValue);
    });

    player2.socket.on("rejectedBetChange", () => {
        io.to(roomID).emit("betValueChangedRejected", betValue);
    });

    io.to(roomID).emit("gameStart", { player1: player1.playerData, player2: player2.playerData });
}

export async function findOpponent(io: Server, betValue: number) {
    // Verifica se o valor da aposta é válido
    if (!waitingQueues.hasOwnProperty(betValue)) {
        console.error("Invalid bet value");
        return;
    }

    const queue = waitingQueues[betValue];

    if (queue.length >= 2) {
        const player1 = queue.shift();
        const player2 = queue.shift();
        createRoom(player1!, player2!, betValue, io);
    }
}

export function removeFromQueueAndRoom(socket: Socket) {
    // Remover o socket da fila de espera
    leaveQueueAtConnection(socket)

    // Remover o socket das salas e notificar outros membros
    const rooms = Array.from(socket.rooms);
    rooms.shift();  // Remova o ID do próprio socket, que é sempre o primeiro elemento

    rooms.forEach((room) => {
        // Notificar outros membros da sala que este usuário está saindo
        socket.to(room).emit("opponentLeft", { message: "Your opponent has left the game." });
        // Remover o socket da sala
        socket.leave(room);
    });
};