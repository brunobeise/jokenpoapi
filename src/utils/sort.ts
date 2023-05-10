import { Play } from "../../types";

export default function sortResultPlay() {
  const jogadas = ["pedra", "papel", "tesoura"];
  const indiceSorteado = Math.floor(Math.random() * jogadas.length);
  return jogadas[indiceSorteado] as Play;
}
