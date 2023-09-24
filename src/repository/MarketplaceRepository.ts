import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Marketplace } from '../entity/MarketplaceEntity';
import { database } from '../database';
import UserRepository from './UserRepository';
import SkinRepository from './SkinRepository';
import { Skin } from '../entity/SkinEntity';
import { User } from '../entity/UserEntity';

export default class MarketplaceRepository {
    private marketplaceRepository = database.getRepository(Marketplace)

    async createMarketplaceEntry(userId: string, skinName: string, value: number) {
        const userRepository = new UserRepository();
        const user = await userRepository.getUserById(userId);
        if (!user) return;

        const skin = await userRepository.removeSkin(user.id, skinName);
        if (!skin) return;

        const newMarketplace = new Marketplace();
        newMarketplace.price = value;
        newMarketplace.user = user;
        newMarketplace.skin = skin;

        return await this.marketplaceRepository.save(newMarketplace);
    }

    async findById(id: string) {
        return await this.marketplaceRepository.findOne({
            where: { id },
            relations: ["user", "skin"],
        });
    }

    async findAll(search?: string, page: any = '1', sort?: string) {

        const take = 12;
        const skip = (Number(page) - 1) * take || 0;
        let query: SelectQueryBuilder<any> = this.marketplaceRepository
            .createQueryBuilder('marketplace')
            .leftJoinAndSelect('marketplace.user', 'user')
            .leftJoinAndSelect('marketplace.skin', 'skin');

        if (search) {
            query = query
                .where('"user"."username" LIKE :search', { search: `%${search}%` })
                .orWhere('"skin"."name" LIKE :search', { search: `%${search}%` });
        }

        if (sort) {

            const [field, direction] = sort.split('_');
            const orderByField = field === 'publishDate' ? 'marketplace.created_at' : 'marketplace.price';
            query = query.orderBy(orderByField, direction.toUpperCase() as "ASC" || "DESC");

        }

        const totalItems = await query.getCount();
        const totalPages = Math.ceil(totalItems / take);
        query = query.skip(skip).take(take);
        const items = await query.getMany();
        return { list: items, totalPages: totalPages };
    }

    async cancel(marketplaceId: string) {
        const userRepository = new UserRepository();
        const skinRepository = new SkinRepository();

        const marketplaceEntry = await this.findById(marketplaceId);

        if (!marketplaceEntry) return


        if (!marketplaceEntry.user || !marketplaceEntry.skin) return

        await userRepository.addSkinToUser(marketplaceEntry.user.id, marketplaceEntry.skin.name)
        userRepository.DepositJokens(marketplaceEntry.user.id, Number(marketplaceEntry.price.toFixed(0)))
        return await this.delete(marketplaceId);
    }

    async buySkin(userId: string, marketplaceId: string) {
        const userRepository = new UserRepository();
        const marketplaceEntry = await this.findById(marketplaceId)

        if (!marketplaceEntry) return

        const user = await userRepository.getUserById(userId);

        if (!user) return

        const skin = marketplaceEntry.skin as unknown as Skin
        const userMarket = marketplaceEntry.user as unknown as User

        if (user.skins.some((existingSkin: Skin) => existingSkin.id === skin.id)) {
            console.log('ja tem');
            return

        }

        const newBalance = await userRepository.DepositJokens(user.id, marketplaceEntry.price * -1)

        if (!newBalance) return



        this.createMarketplaceEntry

        await Promise.all([
            userRepository.addSkinToUser(user.id, skin.name),
            userRepository.DepositJokens(userMarket.id, Number((marketplaceEntry.price * 0.95).toFixed(0))),
            this.delete(marketplaceEntry.id)
        ])

        return true


    }

    async delete(id: string) {
        await this.marketplaceRepository.delete(id);
    }
}
