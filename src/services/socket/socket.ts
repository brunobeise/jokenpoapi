import { Server, Socket, Server as SocketServer } from "socket.io";
import { validateToken } from "../../utils/crypto";
import { AvatarData, Player } from "../../../types";
import { User } from "../../entity/User.entity";
import { Play } from "../../../types";
import UserRepository from "../../repository/User.repository";
import { onlineGame } from "../../utils/rules";

interface playerInGame {
  username: string;
  avatar?: AvatarData;
  balance?: number;
  country: string;
  roomId: string;
  choice: Play | null;
  socketId?: string;
  selectedSkin: string | null;
  rating: number;
}

const rooms: { [key: string]: Socket[] } = {};
export let conectedUsers: playerInGame[] = [];
const userRepository = new UserRepository();

export const initializeSocket = (io: Server) => {
  console.log(io);

  io.on("connection", (socket: Socket) => {
    console.log(`ligou`);
    socket.on(
      "joinRoom",
      async (data: { roomId: string; token: string }, callback: Function) => {
        console.log(`connected`);
        const valide = validateToken(data.token);
        if (!valide) {
          callback({
            isConnected: false,
            message: "token not valid",
          });
          return;
        }

        const user = await userRepository.getUserById(valide.id);
        if (!user) return;

        if (verifyRoom(data.roomId) === 0) {
          rooms[data.roomId] = [socket];
          addUserToConectedUsers(user, data.roomId);
          callback({
            isConnected: true,
            players: conectedUsers.filter(
              (user) => user.roomId === data.roomId
            ),
            position: 1,
          });
          return;
        }

        if (verifyRoom(data.roomId) === 1) {
          console.log("entrando na sala");

          rooms[data.roomId].push(socket);

          addUserToConectedUsers(user, data.roomId);
          if (conectedUsers.length === 1) {
            callback({
              isConnected: true,
              players: conectedUsers.filter(
                (user) => user.roomId === data.roomId
              ),
              position: 1,
            });

            return;
          }

          const firstPlayerSocketId = rooms[data.roomId][0].id;
          const secondPlayerSocketId = rooms[data.roomId][1].id;

          io.to(firstPlayerSocketId).emit("ready", {
            players: conectedUsers.filter(
              (user) => user.roomId === data.roomId
            ),
            position: 1,
          });

          io.to(secondPlayerSocketId).emit("ready", {
            players: conectedUsers.filter(
              (user) => user.roomId === data.roomId
            ),
            position: 2,
          });
        } else {
          console.log("sala cheia");

          callback({
            isConnected: false,
            players: conectedUsers.filter(
              (user) => user.roomId === data.roomId
            ),
            message: "the room is full",
          });

          return;
        }
      }
    );

    socket.on(
      "choice",
      async (data: { choice: string; roomId: string; token: string }) => {
        const user = validateToken(data.token);
        if (!user) return;
        const index = conectedUsers.findIndex(
          (u) => u.username === user.username
        );
        conectedUsers[index] = {
          ...conectedUsers[index],
          choice: data.choice as Play,
        };

        const players = conectedUsers.filter(
          (user) => user.roomId === data.roomId
        );
        if (
          players[0] &&
          players[1] &&
          players[0].choice &&
          players[1].choice
        ) {
          const resultP1 = await onlineGame(
            players[0].choice,
            players[1].choice,
            players[0].username,
            getBetValue(players[0].roomId),
            players[0].rating,
            players[1].rating
          );

          const resultP2 = await onlineGame(
            players[1].choice,
            players[0].choice,
            players[1].username,
            getBetValue(players[1].roomId),
            players[1].rating,
            players[0].rating
          );

          io.to(rooms[data.roomId][0].id).emit("result", {
            hand: players[0].choice,
            otherHand: players[1].choice,
            result: resultP1.result,
            newBalance: resultP1.newBalance,
            newOponentBalance: resultP2.newBalance,
          });

          io.to(rooms[data.roomId][1].id).emit("result", {
            hand: players[1].choice,
            otherHand: players[0].choice,
            result: resultP2.result,
            newBalance: resultP2.newBalance,
            newOponentBalance: resultP1.newBalance,
          });

          conectedUsers.forEach((user, i) => {
            if (user.roomId === data.roomId) conectedUsers[i].choice = null;
          });
        }
      }
    );

    socket.on(
      "disconnectuser",
      (data: { username: string; roomId: string }) => {
        console.log("DISCONECTION");
        conectedUsers = conectedUsers.filter(
          (u) => u.username !== data.username
        );
        if (rooms[data.roomId])
          io.to(rooms[data.roomId][0].id).emit("opponentDisconnected", {
            players: conectedUsers.filter((u) => u.roomId === data.roomId),
          });
      }
    );
  });
};

function addUserToConectedUsers(user: User, roomId: string) {
  if (conectedUsers.some((userr) => userr.username === user.username)) {
    conectedUsers = conectedUsers.filter(
      (userr) => userr.username !== user.username
    );
  }

  const newUser = {
    username: user.username,
    avatar: user.avatar,
    balance: user.balance,
    country: user.country,
    roomId: roomId,
    choice: null,
    selectedSkin: user.selectedSkin,
    rating: user.rating,
  };
  conectedUsers.push(newUser);
}

function verifyRoom(roomId: string) {
  console.log(conectedUsers.filter((u) => u.roomId === roomId).length);

  return conectedUsers.filter((u) => u.roomId === roomId).length;
}

function getBetValue(roomId: string) {
  if (roomId[1] === "1") return 5;
  if (roomId[1] === "2") return 10;
  if (roomId[1] === "3") return 25;
  if (roomId[1] === "4") return 50;
  if (roomId[1] === "5") return 100;
  if (roomId[1] === "6") return 250;
  if (roomId[1] === "7") return 500;
  else return 0;
}
