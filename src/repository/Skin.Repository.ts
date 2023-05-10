import { database } from "../database";
import { Skin } from "../entity/Skin.entity";

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
      newSkin.quantity = quantity;
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

  async adjustQuantity(name: string, value: number) {
    const skin = await this.skinRepository.findOneBy({ name: name });
    if (!skin) return;
    skin!.quantity = skin!.quantity + value;
    this.skinRepository.save(skin);
    return skin!.quantity + value;
  }

  async getRemainSkins(id: string) {
    const query = `
      SELECT COUNT(*) AS count
      FROM users_skins
      WHERE "skinId" = $1
    `;
    const result = await this.skinRepository.query(query, [id]);
    return result.count;
  }
}
