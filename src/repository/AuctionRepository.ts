import { database } from "../database";
import { Auction } from "../entity/AuctionEntity";
import { Bid } from "../entity/BidEntity";
import UserRepository from "./UserRepository";

export default class AuctionRepository {
    private auctionRepository = database.getRepository(Auction)
    private bidRepository = database.getRepository(Bid)

    async getAll() {
        const auctions = await this.auctionRepository.find({
            relations: ["skin", "bids", "bids.user"]
        });
        return auctions.map(auction => ({
            ...auction,
            bids: auction.bids.map(bid => ({
                ...bid,
                user: bid.user.id
            }))
        }));
    }

    async getAuctionById(id: string) {
        return await this.auctionRepository.findOne({
            where: { id: id },
            relations: ["skin", "bids"]
        })
    }

    async getBidsByAuction(auctionId: string) {
        return await this.bidRepository.find({
            where: { auction: { id: auctionId } },
            relations: ["user"]
        });
    }

    async removeLowestBid(auctionId: string) {
        const auction = await this.getAuctionById(auctionId);
        if (!auction) return;
        const lowestBid = await this.bidRepository.findOne({
            where: { auction: { id: auctionId } },
            order: { amount: 'ASC' }
        });

        // Se um lance mais baixo foi encontrado, remova-o
        if (lowestBid) {
            await this.bidRepository.remove(lowestBid);
        }
    }

    async newBid(userId: string, auctionId: string, amount: number) {
        const userRepository = new UserRepository();

        const user = await userRepository.getUserById(userId);
        const auction = await this.getAuctionById(auctionId);

        if (!user || !auction) return;

        if (auction.bids.length >= auction.quantity) {
            const lowestBid = Math.min(...auction.bids.map(bid => bid.amount));
            if (amount <= lowestBid) return
            await this.removeLowestBid(auctionId);
        }

        const bids = await this.getBidsByAuction(auction.id)

        if (bids.some(bid => bid.user.id === user.id)) return

        const newBid = new Bid();
        newBid.user = user;
        newBid.auction = auction;
        newBid.amount = amount;

        return await this.bidRepository.save(newBid);
    }

    async delete(id: string) {
        await this.auctionRepository.delete(id);
    }

}