import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth.guard';
import { TradesService } from './trades.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Trade')
@Controller('trades')
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getTrades(@Request() req) {
    const { userId } = req.user;
    return this.tradesService.getTradesByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/available')
  getAvailableTrades(@Request() req) {
    const { userId } = req.user;
    return this.tradesService.getAvailableTradesNotMatchingUser(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post()
  createTrade(@Request() req, @Body() createTradeDto: any) {
    const { userId } = req.user;
    return this.tradesService.createTrade({
      price: createTradeDto.price,
      quantity: createTradeDto.quantity,
      [createTradeDto.type === 'buy' ? 'buyerId' : 'sellerId']: userId,
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Put('/cancel/:tradeId')
  async cancelTrade(@Request() req, @Param('tradeId') tradeId) {
    const { userId } = req.user;
    if ((await this.tradesService.cancelTrade(tradeId, userId)).count !== 1)
      throw new ForbiddenException();
    return 'OK';
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Put('/buy/:tradeId')
  async executeBuy(@Request() req, @Param('tradeId') tradeId) {
    const { userId } = req.user;
    if ((await this.tradesService.completeBuy(tradeId, userId)).count !== 1)
      throw new ForbiddenException();
    return 'OK';
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Put('/sell/:tradeId')
  async executeSell(@Request() req, @Param('tradeId') tradeId) {
    const { userId } = req.user;
    if ((await this.tradesService.completeSell(tradeId, userId)).count !== 1)
      throw new ForbiddenException();
    return 'OK';
  }
}
