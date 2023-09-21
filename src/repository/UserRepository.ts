import { User } from "../entity/UserEntity";
import { database } from "../database";
import bcrypt from "bcrypt";
import { AvatarData } from "../../types";
import { WithdrawRequest } from "../entity/WithdrawRequestEntity";
import SkinRepository from "./SkinRepository";
import { MoreThan } from "typeorm";
import MarketplaceRepository from "./MarketplaceRepository";

export default class UserRepository {
  private userRepository = database.getRepository(User);

  async getUsers() {
    return await this.userRepository.find();
  }

  async getAllUsernames() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select('user.username')
      .getMany();

    const usernames = users.map(user => user.username);
    return usernames;
  }

  async getAllEmails() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select('user.email')
      .getMany();

    const usernames = users.map(user => user.email);
    return usernames;
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
          succes: false,
          error: "user already registered",
        };
      }

      const hash = await bcrypt.hash(password, 10);
      const user = new User();
      user.password = hash;
      user.username = username;
      user.country = country;
      user.avatar = avatar;
      await this.userRepository.save(user);

      return {
        success: true,
        data: await user.toDetail(),
      };
    } catch (error) {
      return {
        success: false,
        error: "Server Error",
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

  async addMatch(userId: string, balanceAdjust: number) {
    const user = await this.getUserById(userId);

    if (!user) return


    user.balance = Number(user.balance ?? 0)
    user.matches = Number(user.matches ?? 0)

    user.balance += balanceAdjust
    user.matches += 1


    const userAtt = await this.userRepository.save(user)

    return userAtt.balance;
  }


  async DepositJokens(userId: string, jokens: number) {

    const user = await this.getUserById(userId);
    if (!user) return
    console.log(user.username + '+ ' + jokens + 'jokens');

    user.balance = Number(user.balance ?? 0);
    if (user.balance + jokens < 0) return
    user.balance += jokens;


    await this.userRepository.save(user);
    return user.balance;
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

  async addSkinToUser(userId: string, skinName: string) {
    const skinRepository = new SkinRepository();
    const user = await this.getUserById(userId)
    const skin = await skinRepository.findSkinByName(skinName);

    if (!user || !skin) {
      return false;
    }

    if (user.skins.some((skin) => skin.name === skinName)) {
      return false;
    }

    user.skins.push(skin);
    await this.userRepository.save(user);
    return true;
  }

  async removeSkin(userId: string, skinName: string) {
    const skinRepository = new SkinRepository()
    const user = await this.getUserById(userId)
    const skin = await skinRepository.findSkinByName(skinName)

    if (!user || !skin) return

    user.skins = user.skins.filter(s => s.name !== skinName);

    await this.userRepository.save(user);

    return skin
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


    await this.userRepository.save(user);
    return
  }

  async getUserPosition(userId: string): Promise<number> {

    // Obtenha o rating do usuário
    const user = await this.getUserById(userId);
    if (!user) {
      return 0
    }

    // Conte quantos usuários têm um rating superior
    const count = await this.userRepository.count({
      where: {
        rating: MoreThan(user.rating)
      }
    });

    // A posição é determinada pelo número de usuários com um rating superior mais um
    return count + 1;
  }

  async confirmUser(userId: string, email: string, wallet: string) {
    const user = await this.getUserById(userId);
    if (!user) return false
    this.DepositJokens(user.id, 5)
    const emails = await this.userRepository
      .createQueryBuilder("user")
      .select("user.email")
      .getMany();
    if (emails.some((e) => e.email === email)) {
      return false;
    }

    user.email = email;
    user.wallet = wallet;
    this.userRepository.save(user);
    return true
  }
}
