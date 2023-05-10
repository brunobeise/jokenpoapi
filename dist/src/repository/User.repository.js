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
const User_entity_1 = require("../entity/User.entity");
const database_1 = require("../database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const WithdrawRequest_entity_1 = require("../entity/WithdrawRequest.entity");
const Skin_Repository_1 = __importDefault(require("./Skin.Repository"));
class UserRepository {
    constructor() {
        this.userRepository = database_1.database.getRepository(User_entity_1.User);
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find();
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({
                where: { id: id },
                relations: ["skins"],
            });
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOneBy({ username: username });
        });
    }
    getTop10ByRating() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository
                .createQueryBuilder("user")
                .orderBy("user.rating", "DESC")
                .limit(10)
                .getMany();
        });
    }
    resetUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository
                .createQueryBuilder("users")
                .delete()
                .from(User_entity_1.User)
                .execute();
        });
    }
    createUser(username, password, country, avatar) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.getUsers();
                if (users.some((u) => u.username === username)) {
                    return {
                        error: "user already registered",
                    };
                }
                const hash = yield bcrypt_1.default.hash(password, 10);
                const user = new User_entity_1.User();
                user.password = hash;
                user.username = username;
                user.country = country;
                user.avatar = avatar;
                this.userRepository.save(user);
                return {
                    result: "ok",
                    data: user,
                };
            }
            catch (error) {
                return {
                    result: "error",
                    data: error,
                };
            }
        });
    }
    editAvatar(userId, avatar) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            if (!user)
                return false;
            user.avatar = avatar;
            this.userRepository.save(user);
        });
    }
    addWin(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            if (user) {
                if (!user.wins)
                    user.wins = 1;
                else {
                    user.wins += 1;
                }
                yield this.userRepository.save(user);
            }
            else {
                throw new Error("User not found");
            }
        });
    }
    editRating(userId, newRating) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            if (!user)
                return;
            user.rating = newRating;
            this.userRepository.save(user);
        });
    }
    addMatch(userId, balanceAdjust) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ id: userId });
            if (user) {
                if (!user.balance)
                    user.balance = balanceAdjust;
                if (user.balance)
                    user.balance += balanceAdjust;
                if (!user.plays)
                    user.plays = 1;
                if (user.plays)
                    user.plays += 1;
                yield this.userRepository.save(user);
            }
            else {
                throw new Error("User not found");
            }
        });
    }
    DepositJokens(userId, jokens) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ id: userId });
            if (user) {
                if (!user.balance)
                    user.balance = jokens;
                if (user.balance)
                    user.balance += jokens;
                yield this.userRepository.save(user);
                if (!user.balance)
                    return jokens;
                if (user.balance)
                    return user.balance + jokens;
            }
            else {
                throw new Error("User not found");
            }
        });
    }
    createWithdrawRequest(userId, value, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRequest = new WithdrawRequest_entity_1.WithdrawRequest();
            newRequest.userId = userId;
            newRequest.jokensValue = Number(value);
            newRequest.create_At = new Date();
            newRequest.wallet = wallet;
            database_1.database.getRepository(WithdrawRequest_entity_1.WithdrawRequest).save(newRequest);
        });
    }
    getUserSkins(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: { id: userId },
                relations: ["skins"],
            });
            return user === null || user === void 0 ? void 0 : user.skins;
        });
    }
    addUserSkin(userId, skinName) {
        return __awaiter(this, void 0, void 0, function* () {
            const skinRepository = new Skin_Repository_1.default();
            const user = yield this.userRepository.findOne({
                where: { id: userId },
                relations: ["skins"],
            });
            const skin = yield skinRepository.findSkinByName(skinName);
            if (!user || !skin) {
                return false;
            }
            if (user.skins.some((skin) => skin.name === skinName)) {
                return false;
            }
            user.skins.push(skin);
            console.log(user);
            yield this.userRepository.save(user);
            return true;
        });
    }
    listUsersBySkinName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository
                .createQueryBuilder("user")
                .leftJoin("user.skins", "skin")
                .where("skin.name = :name", { name })
                .getMany();
            return users;
        });
    }
    changeSelectedSkin(id, skinName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(id);
            if (!user)
                return;
            user.selectedSkin = skinName;
            this.userRepository.save(user);
        });
    }
}
exports.default = UserRepository;
