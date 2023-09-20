import { Play } from "../../types";

export default function sortResultPlay() {
  const jogadas = ["pedra", "papel", "tesoura"];
  const indiceSorteado = Math.floor(Math.random() * jogadas.length);
  return jogadas[indiceSorteado] as Play;
}

export function sortWinResult(playerPlay: Play): Play {
  switch (playerPlay) {
    case "pedra":
      return "papel";
    case "papel":
      return "tesoura";
    case "tesoura":
      return "pedra";
    default:
      throw new Error("Jogada inválida");
  }
}