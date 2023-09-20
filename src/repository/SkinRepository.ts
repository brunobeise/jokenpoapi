import { database } from "../database";
import { Skin } from "../entity/SkinEntity";

export default class SkinRepository {
  private skinRepository = database.getRepository(Skin);
  async getAvailableSkins() {
    let skins = await this.skinRepository.find();
    return skins;
  }

  async createSkin(
    name: string,
    description: string,
    quantity: number,
    price: number
  ) {
    try {
      const newSkin = new Skin();
      newSkin.name = name;
      newSkin.description = description;
      newSkin.price = price;
      this.skinRepository.save(newSkin);

      return {
        result: "ok",
        data: newSkin,
      };
    } catch (error) {
      return {
        result: "error",
        data: error,
      };
    }
  }

  async findSkinByName(name: string) {
    return await this.skinRepository.findOneBy({ name: name });
  }

  async findSkinById(id: string) {
    return await this.skinRepository.findOneBy({ id: id });
  }

}