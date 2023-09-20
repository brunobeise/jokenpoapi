import { database } from "../database";
import { Game } from "../entity/GameEntity";

export default class AppRepository {
    private gameRepository = database.getRepository(Game);

    private async getFirstGameRecord() {
        const [game] = await this.gameRepository.find();
        if (!game) {
            throw new Error("No game record found");
        }
        return game;
    }

    async getBotBalance() {
        const game = await this.getFirstGameRecord();
        return game.botBalance;
    }

    async getGameBalance() {
        const game = await this.getFirstGameRecord();
        return game.gameBalance;
    }

    async updateBotBalance(value: number) {
        const game = await this.getFirstGameRecord();
        await this.gameRepository.manager.transaction(async transactionalEntityManager => {
            game.botBalance = Number(game.botBalance) + Number(value);

            if (value > 0) {
                this.updateGameBalance(game.botBalance * 0.1);
            }
            game.botBalance *= 0.9;
            await transactionalEntityManager.save(Game, game);
        });
        return game;
    }

    async updateGameBalance(value: number) {
        const game = await this.getFirstGameRecord();
        game.gameBalance = Number(game.gameBalance) + Number(value);

        return await this.gameRepository.save(game);
    }
}
