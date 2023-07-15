import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TradesController } from './trades.controller';

@Module({
  providers: [TradesService, PrismaService],
  controllers: [TradesController],
})
export class TradesModule {}
