import { Play, Result } from "../../types";
import UserRepository from "../repository/UserRepository";
import { newRatingCalculator } from "./rating";

export function checkResult(play1: Play, play2: Play): Result {
  if (play1 === play2) {
    return "tie";
  }

  if (
    (play1 === "pedra" && play2 === "tesoura") ||
    (play1 === "papel" && play2 === "pedra") ||
    (play1 === "tesoura" && play2 === "papel")
  ) {
    return "win";
  }

  return "loss";
}


