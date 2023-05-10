"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRatingCalculator = void 0;
function newRatingCalculator(ratingA, ratingB, win) {
    const K = 32;
    const EA = 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
    const EB = 1 / (1 + 10 ** ((ratingA - ratingB) / 400));
    const actualScoreA = win ? 1 : 0;
    const expectedScoreA = EA / (EA + EB);
    const resultA = Number((ratingA + K * (actualScoreA - expectedScoreA)).toFixed(0));
    return resultA;
}
exports.newRatingCalculator = newRatingCalculator;
