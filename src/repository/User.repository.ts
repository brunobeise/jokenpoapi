import { User } from "../entity/User.entity";
import { database } from "../database";
import bcrypt from "bcrypt";
import { AvatarData } from "../../types";
import { WithdrawRequest } from "../entity/WithdrawRequest.entity";
import SkinRepository from "./Skin.Repository";

export default class UserRepository {
  private userRepository = database.getRepository(User);

  async getUsers() {
    return await this.userRepository.find();
  }

  async getUserById(id: string) {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ["skins"],
    });
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOneBy({ username: username });
  }

  async getTop10ByRating(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder("user")
      .orderBy("user.rating", "DESC")
      .limit(10)
      .getMany();
  }

  async resetUsers() {
    return await this.userRepository
      .createQueryBuilder("users")
      .delete()
      .from(User)
      .execute();
  }

  async createUser(
    username: string,
    password: string,
    country: string,
    avatar: AvatarData
  ) {
    try {
      const users = await this.getUsers();
      if (users.some((u) => u.username === username)) {
        return {
          error: "user already registered",
        };
      }

      const hash = await bcrypt.hash(password, 10);
      const user = new User();
      user.password = hash;
      user.username = username;
      user.country = country;
      user.avatar = avatar;
      this.userRepository.save(user);

      return {
        result: "ok",
        data: user,
      };
    } catch (error) {
      return {
        result: "error",
        data: error,
      };
    }
  }

  async editAvatar(userId: string, avatar: AvatarData) {
    const user = await this.getUserById(userId);
    if (!user) return false;
    user.avatar = avatar;
    this.userRepository.save(user);
  }

  async addWin(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (user) {
      if (!user.wins) user.wins = 1;
      else {
        user.wins += 1;
      }
      await this.userRepository.save(user);
    } else {
      throw new Error("User not found");
    }
  }

  async editRating(userId: string, newRating: number) {
    const user = await this.getUserById(userId);
    if (!user) return;
    user.rating = newRating;
    this.userRepository.save(user);
  }

  async addMatch(userId: string, balanceAdjust: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      if (!user.balance) user.balance = balanceAdjust;
      if (user.balance) user.balance += balanceAdjust;
      if (!user.plays) user.plays = 1;
      if (user.plays) user.plays += 1;
      await this.userRepository.save(user);
    } else {
      throw new Error("User not found");
    }
  }

  async DepositJokens(userId: string, jokens: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      if (!user.balance) user.balance = jokens;
      if (user.balance) user.balance += jokens;
      await this.userRepository.save(user);
      if (!user.balance) return jokens;
      if (user.balance) return user.balance + jokens;
    } else {
      throw new Error("User not found");
    }
  }

  async createWithdrawRequest(userId: string, value: string, wallet: string) {
    const newRequest = new WithdrawRequest();
    newRequest.userId = userId;
    newRequest.jokensValue = Number(value);
    newRequest.create_At = new Date();
    newRequest.wallet = wallet;
    database.getRepository(WithdrawRequest).save(newRequest);
  }

  async getUserSkins(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["skins"],
    });
    return user?.skins;
  }

  async addUserSkin(userId: string, skinName: string) {
    const skinRepository = new SkinRepository();
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["skins"],
    });
    const skin = await skinRepository.findSkinByName(skinName);

    if (!user || !skin) {
      return false;
    }

    if (user.skins.some((skin) => skin.name === skinName)) {
      return false;
    }

    user.skins.push(skin);
    console.log(user);
    await this.userRepository.save(user);
    return true;
  }

  async listUsersBySkinName(name: string) {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.skins", "skin")
      .where("skin.name = :name", { name })
      .getMany();

    return users;
  }

  async changeSelectedSkin(id: string, skinName: string) {
    const user = await this.getUserById(id);
    if (!user) return;
    user.selectedSkin = skinName;
    this.userRepository.save(user);
  }
}
