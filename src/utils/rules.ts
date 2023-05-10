import { Play, Result } from "../../types";
import UserRepository from "../repository/User.repository";
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

export async function onlineGame(
  play1: Play,
  play2: Play,
  username: string,
  betValue: number,
  r1: number,
  r2: number
) {
  const userRepository = new UserRepository();
  const result = checkResult(play1, play2);
  const userId = await userRepository.getUserByUsername(username);
  let newBalance: number | undefined;
  if (result === "loss") {
    newBalance = await userRepository.DepositJokens(userId!.id, betValue * -1);
    const newRating = newRatingCalculator(r1, r2, false);
    userRepository.editRating(userId!.id, newRating);
  } else if (result === "win") {
    newBalance = await userRepository.DepositJokens(userId!.id, betValue);
    const newRating = newRatingCalculator(r1, r2, true);
    userRepository.editRating(userId!.id, newRating);
  }
  return { result, newBalance };
}
