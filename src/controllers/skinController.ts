import { Request, Response } from "express";
import SkinRepository from "../repository/SkinRepository";

export class SkinController {
  async createSkin(req: Request, res: Response) {
    const skinRepository = new SkinRepository();
    const { name, description, quantity, price } = req.body;
    const result = skinRepository.createSkin(
      name,
      description,
      quantity,
      price
    );
    res.json(result);
  }

  async findAvailableSkins(req: Request, res: Response) {
    const skinRepository = new SkinRepository();
    const skins = await skinRepository.getAvailableSkins();
    res.json(skins);
  }
}
