export type Play = "pedra" | "papel" | "tesoura";
export type Result = "win" | "loss" | "tie";

export interface Player {
  id: string;
  username: string;
  avatar: string;
  balance: number | 0;
  country?: string;
  wins?: number;
  plays?: number;
  rating?: number;
  roomId?: string;
}

export interface AvatarData {
  style: string;
  hairColor: string;
  facialHair: string;
  clothe: string;
  clotheColor: string;
  skin: string;
  eye: string;
  eyebrow: string;
  mouth: string;
  top: string;
  acessories: string;
}
