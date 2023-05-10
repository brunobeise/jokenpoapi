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
exports.onlineGame = exports.checkResult = void 0;
const User_repository_1 = __importDefault(require("../repository/User.repository"));
const rating_1 = require("./rating");
function checkResult(play1, play2) {
    if (play1 === play2) {
        return "tie";
    }
    if ((play1 === "pedra" && play2 === "tesoura") ||
        (play1 === "papel" && play2 === "pedra") ||
        (play1 === "tesoura" && play2 === "papel")) {
        return "win";
    }
    return "loss";
}
exports.checkResult = checkResult;
function onlineGame(play1, play2, username, betValue, r1, r2) {
    return __awaiter(this, void 0, void 0, function* () {
        const userRepository = new User_repository_1.default();
        const result = checkResult(play1, play2);
        const userId = yield userRepository.getUserByUsername(username);
        let newBalance;
        if (result === "loss") {
            newBalance = yield userRepository.DepositJokens(userId.id, betValue * -1);
            const newRating = (0, rating_1.newRatingCalculator)(r1, r2, false);
            userRepository.editRating(userId.id, newRating);
        }
        else if (result === "win") {
            newBalance = yield userRepository.DepositJokens(userId.id, betValue);
            const newRating = (0, rating_1.newRatingCalculator)(r1, r2, true);
            userRepository.editRating(userId.id, newRating);
        }
        return { result, newBalance };
    });
}
exports.onlineGame = onlineGame;
