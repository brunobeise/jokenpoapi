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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const Skin_entity_1 = require("../entity/Skin.entity");
class SkinRepository {
    constructor() {
        this.skinRepository = database_1.database.getRepository(Skin_entity_1.Skin);
    }
    getAvailableSkins() {
        return __awaiter(this, void 0, void 0, function* () {
            let skins = yield this.skinRepository.find();
            return skins;
        });
    }
    createSkin(name, description, quantity, price) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSkin = new Skin_entity_1.Skin();
                newSkin.name = name;
                newSkin.description = description;
                newSkin.quantity = quantity;
                newSkin.price = price;
                this.skinRepository.save(newSkin);
                return {
                    result: "ok",
                    data: newSkin,
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
    findSkinByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.skinRepository.findOneBy({ name: name });
        });
    }
    adjustQuantity(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const skin = yield this.skinRepository.findOneBy({ name: name });
            if (!skin)
                return;
            skin.quantity = skin.quantity + value;
            this.skinRepository.save(skin);
            return skin.quantity + value;
        });
    }
    getRemainSkins(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT COUNT(*) AS count
      FROM users_skins
      WHERE "skinId" = $1
    `;
            const result = yield this.skinRepository.query(query, [id]);
            return result.count;
        });
    }
}
exports.default = SkinRepository;
