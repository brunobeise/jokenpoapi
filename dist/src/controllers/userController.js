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
exports.UserController = void 0;
const database_1 = require("../database");
const User_entity_1 = require("../entity/User.entity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("../utils/crypto");
const User_repository_1 = __importDefault(require("../repository/User.repository"));
const Skin_Repository_1 = __importDefault(require("../repository/Skin.Repository"));
class UserController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const userRepository = new User_repository_1.default();
            const { username, password, country, avatar } = req.body;
            const result = yield userRepository.createUser(username, password, country, avatar);
            res.json(result);
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const userRepository = database_1.database.getRepository(User_entity_1.User);
            const user = yield userRepository.findOneBy({ username: username });
            if (!user) {
                res.json({ success: false, user: {} });
                return;
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.json({ succes: false, user: {} });
                return;
            }
            const token = (0, crypto_1.generateToken)(user.id, user.username);
            res.json({
                success: true,
                user: user,
                token: token,
            });
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new User_repository_1.default();
            res.json(yield userRepository.getUsers());
        });
    }
    withdrawJokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new User_repository_1.default();
            const token = req.headers.authorization;
            if (!token || !req.body.value || req.body.wallet) {
                res.json("invalid parameters");
                return;
            }
            const user = yield (0, crypto_1.validateToken)(token);
            if (!user) {
                res.json("user not found");
                return;
            }
            userRepository.DepositJokens(user.id, Number(req.body.value) * -1);
            userRepository.createWithdrawRequest(user.id, req.body.value, req.body.wallet);
            res.json("Withdraw request completed successfully");
        });
    }
    editUserAvatar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new User_repository_1.default();
            const avatar = req.body.avatar;
            const token = req.headers.authorization;
            const user = (0, crypto_1.validateToken)(token);
            if (!user) {
                res.json("user not found");
                return;
            }
            userRepository.editAvatar(user.id, avatar);
            res.json(avatar);
        });
    }
    getSkins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new User_repository_1.default();
            const skins = yield userRepository.getUserSkins(req.body.id);
            /* const skins = await userRepository.listUsersBySkinName(req.body.skinName); */
            res.json(skins);
        });
    }
    addSkinToUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new User_repository_1.default();
            const skinRepository = new Skin_Repository_1.default();
            const skin = yield skinRepository.findSkinByName(req.body.name);
            if (!skin || skin.quantity === 0) {
                res.json({ result: false });
                return;
            }
            const user = yield userRepository.getUserById(req.body.id);
            if (!user)
                return;
            if (user.balance < skin.price) {
                res.json({ result: false });
                return;
            }
            const result = yield userRepository.addUserSkin(req.body.id, req.body.skinName);
            if (!result) {
                res.json({ result: result });
                return;
            }
            skinRepository.adjustQuantity(req.body.name, -1);
            userRepository.DepositJokens(user.id, skin.price * -1);
            res.json({ result: true });
        });
    }
    changeselectedSkin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = new User_repository_1.default();
            userRepository.changeSelectedSkin(req.body.id, req.body.skinName);
        });
    }
}
exports.UserController = UserController;
