import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TradesService {
  constructor(private prisma: PrismaService) {}

  getTradesByUserId(userId: string) {
    return this.prisma.trade.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    });
  }

  getAvailableTradesNotMatchingUser(userId: string) {
    return this.prisma.trade.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                AND: [
                  {
                    buyerId: {
                      not: null,
                    },
                  },
                  {
                    buyerId: {
                      not: userId,
                    },
                  },
                ],
              },
              {
                AND: [
                  {
                    sellerId: {
                      not: null,
                    },
                  },
                  {
                    sellerId: {
                      not: userId,
                    },
                  },
                ],
              },
            ],
          },
          {
            status: 'PENDING',
          },
        ],
      },
    });
  }

  createTrade(createTradeDto: Prisma.TradeCreateInput) {
    return this.prisma.trade.create({ data: createTradeDto });
  }

  cancelTrade(tradeId: string, userId: string) {
    return this.prisma.trade.updateMany({
      where: {
        AND: [
          { tradeId: tradeId },
          { OR: [{ buyerId: userId }, { sellerId: userId }] },
        ],
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  completeBuy(tradeId: string, userId: string) {
    return this.prisma.trade.updateMany({
      where: {
        AND: [
          { tradeId },
          { sellerId: { not: userId } },
          { status: { notIn: ['COMPLETED', 'CANCELLED'] } },
        ],
      },
      data: {
        buyerId: userId,
        timeExecuted: new Date(),
        status: 'COMPLETED',
      },
    });
  }

  completeSell(tradeId: string, userId: string) {
    return this.prisma.trade.updateMany({
      where: {
        AND: [
          { tradeId },
          { buyerId: { not: userId } },
          { status: { notIn: ['COMPLETED', 'CANCELLED'] } },
        ],
      },
      data: {
        sellerId: userId,
        timeExecuted: new Date(),
        status: 'COMPLETED',
      },
    });
  }
}
