"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sortResultPlay() {
    const jogadas = ["pedra", "papel", "tesoura"];
    const indiceSorteado = Math.floor(Math.random() * jogadas.length);
    return jogadas[indiceSorteado];
}
exports.default = sortResultPlay;
