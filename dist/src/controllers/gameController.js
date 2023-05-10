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
exports.GameController = void 0;
const sort_1 = __importDefault(require("../utils/sort"));
const rules_1 = require("../utils/rules");
const crypto_1 = require("../utils/crypto");
const User_repository_1 = __importDefault(require("../repository/User.repository"));
const socket_1 = require("../services/socket/socket");
const rating_1 = require("../utils/rating");
class GameController {
    computerGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new User_repository_1.default();
            const valide = (0, crypto_1.validateToken)(req.headers.authorization);
            if (!valide)
                return;
            const user = yield userRepository.getUserById(valide.id);
            if (!user)
                return;
            const { playerHand, betValue } = req.body;
            const computerHand = (0, sort_1.default)();
            const result = (0, rules_1.checkResult)(playerHand, computerHand);
            if (result === "win") {
                userRepository.addWin(user.id);
                userRepository.addMatch(user.id, betValue);
                const newRating = (0, rating_1.newRatingCalculator)(user.rating, user.rating, true);
                userRepository.editRating(user.id, newRating);
            }
            if (result === "loss") {
                userRepository.addMatch(user.id, betValue * -1);
                const newRating = (0, rating_1.newRatingCalculator)(user.rating, user.rating, false);
                userRepository.editRating(user.id, newRating);
            }
            if (result === "tie") {
                userRepository.addMatch(user.id, 0);
            }
            const resultJson = {
                playerHand: playerHand,
                computerHand: computerHand,
                result: result,
                betValue: betValue,
            };
            res.json(resultJson);
        });
    }
    getOnlinePlay(req, res) {
        let roomIds = [];
        const prefix = req.body.prefix;
        socket_1.conectedUsers.forEach((user) => roomIds.push(user.roomId));
        if (roomIds.length === 0) {
            res.json("-1");
            return;
        }
        let foundRoomId = "-1";
        roomIds = roomIds.filter((roomId) => roomId.startsWith(`@${prefix}`));
        roomIds.forEach((roomId) => {
            const filter = socket_1.conectedUsers.filter((user) => user.roomId === roomId);
            if (filter.length === 1) {
                foundRoomId = roomId;
                return;
            }
        });
        res.json(foundRoomId);
    }
}
exports.GameController = GameController;
