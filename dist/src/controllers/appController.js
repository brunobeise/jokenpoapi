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
exports.AppController = void 0;
const crypto_1 = require("../utils/crypto");
const metamask_1 = require("../services/metamask");
const User_repository_1 = __importDefault(require("../repository/User.repository"));
class AppController {
    decodedToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new User_repository_1.default();
            if (!req.body.token)
                res.json("Token is required");
            const decoded = (0, crypto_1.validateToken)(req.body.token);
            if (!decoded) {
                res.json("Token is invalid");
                return;
            }
            const userData = yield userRepository.getUserById(decoded.id);
            res.json(userData);
        });
    }
    checkTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new User_repository_1.default();
            const token = req.headers.authorization;
            let result = yield (0, metamask_1.monitoringByHash)(req.params.txHash);
            console.log(result);
            while (result === "Aguardando...") {
                yield new Promise((resolve) => setTimeout(resolve, 3000));
                result = yield (0, metamask_1.monitoringByHash)(req.params.txHash);
                console.log(result);
            }
            if (result !== "Aguardando...") {
                res.json(result);
                if (!token) {
                    res.json("Token not found");
                    return;
                }
                const decoded = (0, crypto_1.validateToken)(token);
                if (!decoded) {
                    res.json("Token not found");
                    return;
                }
                userRepository.DepositJokens(decoded.id, req.body.value);
            }
        });
    }
    getTop10ByRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new User_repository_1.default();
            const list = yield userRepository.getTop10ByRating();
            res.json(list);
        });
    }
}
exports.AppController = AppController;
