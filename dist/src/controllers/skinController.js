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
exports.SkinController = void 0;
const Skin_Repository_1 = __importDefault(require("../repository/Skin.Repository"));
class SkinController {
    createSkin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skinRepository = new Skin_Repository_1.default();
            const { name, description, quantity, price } = req.body;
            const result = skinRepository.createSkin(name, description, quantity, price);
            res.json(result);
        });
    }
    findAvailableSkins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skinRepository = new Skin_Repository_1.default();
            const skins = yield skinRepository.getAvailableSkins();
            res.json(skins);
        });
    }
}
exports.SkinController = SkinController;
