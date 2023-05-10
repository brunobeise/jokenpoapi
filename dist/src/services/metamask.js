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
exports.monitoringByHash = void 0;
const Web3 = require("web3");
// Cria a instância do Web3 utilizando o provider local do Ethereum
const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
// Testa a conexão com o nó
web3.eth.net
    .isListening()
    .then(() => console.log("Conexão com o nó estabelecida com sucesso!"))
    .catch((error) => console.error(`Falha ao conectar com o nó: ${error}`));
function monitoringByHash(txHash) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("monitorando..." + txHash);
        const receipt = yield web3.eth.getTransactionReceipt(txHash);
        if (!receipt)
            return "Aguardando...";
        const status = receipt.status;
        if (receipt.status === false) {
            return "Aguardando...";
        }
        if (status === true) {
            return receipt;
        }
        else {
            return `A transação ${txHash} falhou.`;
        }
    });
}
exports.monitoringByHash = monitoringByHash;
