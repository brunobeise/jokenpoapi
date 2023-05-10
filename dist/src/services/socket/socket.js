"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = exports.conectedUsers = void 0;
const crypto_1 = require("../../utils/crypto");
const User_repository_1 = __importDefault(require("../../repository/User.repository"));
const rules_1 = require("../../utils/rules");
const rooms = {};
exports.conectedUsers = [];
const userRepository = new User_repository_1.default();
const initializeSocket = (io) => {
    console.log(io);
    io.on("connection", (socket) => {
        console.log(`ligou`);
        socket.on("joinRoom", (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`connected`);
            const valide = (0, crypto_1.validateToken)(data.token);
            if (!valide) {
                callback({
                    isConnected: false,
                    message: "token not valid",
                });
                return;
            }
            const user = yield userRepository.getUserById(valide.id);
            if (!user)
                return;
            if (verifyRoom(data.roomId) === 0) {
                rooms[data.roomId] = [socket];
                addUserToConectedUsers(user, data.roomId);
                callback({
                    isConnected: true,
                    players: exports.conectedUsers.filter((user) => user.roomId === data.roomId),
                    position: 1,
                });
                return;
            }
            if (verifyRoom(data.roomId) === 1) {
                console.log("entrando na sala");
                rooms[data.roomId].push(socket);
                addUserToConectedUsers(user, data.roomId);
                if (exports.conectedUsers.length === 1) {
                    callback({
                        isConnected: true,
                        players: exports.conectedUsers.filter((user) => user.roomId === data.roomId),
                        position: 1,
                    });
                    return;
                }
                const firstPlayerSocketId = rooms[data.roomId][0].id;
                const secondPlayerSocketId = rooms[data.roomId][1].id;
                io.to(firstPlayerSocketId).emit("ready", {
                    players: exports.conectedUsers.filter((user) => user.roomId === data.roomId),
                    position: 1,
                });
                io.to(secondPlayerSocketId).emit("ready", {
                    players: exports.conectedUsers.filter((user) => user.roomId === data.roomId),
                    position: 2,
                });
            }
            else {
                console.log("sala cheia");
                callback({
                    isConnected: false,
                    players: exports.conectedUsers.filter((user) => user.roomId === data.roomId),
                    message: "the room is full",
                });
                return;
            }
        }));
        socket.on("choice", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const user = (0, crypto_1.validateToken)(data.token);
            if (!user)
                return;
            const index = exports.conectedUsers.findIndex((u) => u.username === user.username);
            exports.conectedUsers[index] = Object.assign(Object.assign({}, exports.conectedUsers[index]), { choice: data.choice });
            const players = exports.conectedUsers.filter((user) => user.roomId === data.roomId);
            if (players[0] &&
                players[1] &&
                players[0].choice &&
                players[1].choice) {
                const resultP1 = yield (0, rules_1.onlineGame)(players[0].choice, players[1].choice, players[0].username, getBetValue(players[0].roomId), players[0].rating, players[1].rating);
                const resultP2 = yield (0, rules_1.onlineGame)(players[1].choice, players[0].choice, players[1].username, getBetValue(players[1].roomId), players[1].rating, players[0].rating);
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
                exports.conectedUsers.forEach((user, i) => {
                    if (user.roomId === data.roomId)
                        exports.conectedUsers[i].choice = null;
                });
            }
        }));
        socket.on("disconnectuser", (data) => {
            console.log("DISCONECTION");
            exports.conectedUsers = exports.conectedUsers.filter((u) => u.username !== data.username);
            if (rooms[data.roomId])
                io.to(rooms[data.roomId][0].id).emit("opponentDisconnected", {
                    players: exports.conectedUsers.filter((u) => u.roomId === data.roomId),
                });
        });
    });
};
exports.initializeSocket = initializeSocket;
function addUserToConectedUsers(user, roomId) {
    if (exports.conectedUsers.some((userr) => userr.username === user.username)) {
        exports.conectedUsers = exports.conectedUsers.filter((userr) => userr.username !== user.username);
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
    exports.conectedUsers.push(newUser);
}
function verifyRoom(roomId) {
    console.log(exports.conectedUsers.filter((u) => u.roomId === roomId).length);
    return exports.conectedUsers.filter((u) => u.roomId === roomId).length;
}
function getBetValue(roomId) {
    if (roomId[1] === "1")
        return 5;
    if (roomId[1] === "2")
        return 10;
    if (roomId[1] === "3")
        return 25;
    if (roomId[1] === "4")
        return 50;
    if (roomId[1] === "5")
        return 100;
    if (roomId[1] === "6")
        return 250;
    if (roomId[1] === "7")
        return 500;
    else
        return 0;
}
