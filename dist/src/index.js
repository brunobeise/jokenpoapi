"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.bootstrapServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database");
const dotenv = __importStar(require("dotenv"));
const appRoutes_1 = require("./routes/appRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const gameRoutes_1 = require("./routes/gameRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
const node_http_1 = require("node:http");
dotenv.config();
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/user", (0, userRoutes_1.UsersRoutes)());
app.use("/game", (0, gameRoutes_1.GameRoutes)());
app.use("/app", (0, appRoutes_1.AppRoutes)());
app.use("/adm", (0, adminRoutes_1.AdminRoutes)());
function bootstrapServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.database.initialize();
        return (0, node_http_1.createServer)(app);
    });
}
exports.bootstrapServer = bootstrapServer;
/* database.initialize().then(() => {
  httpServer.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}); */
