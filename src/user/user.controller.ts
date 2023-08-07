import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  CreateUserProtocol,
  CreateUserUsecaseInput,
  SaveAddressUserProtocol,
  SaveAddressUserUsecaseInput,
  SaveDocumentsUserProtocol,
  SaveDocumentsUserUsecaseInput,
} from './protocols/usecases';
import { ApiTokenGuard } from '../auth/guards/api-token.guard';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly createUser: CreateUserProtocol,
    private readonly saveAddressUser: SaveAddressUserProtocol,
    private readonly saveDocumentsUser: SaveDocumentsUserProtocol,
  ) {}
  @Post('/save/basicInfo')
  @HttpCode(200)
  @UseGuards(ApiTokenGuard)
  async saveBasicInfo(@Body() body: CreateUserUsecaseInput): Promise<any> {
    this.logger.log('Start Request');
    this.logger.log('Send Body to usecase!');

    const { success, error } = await this.createUser.exec(body);
    if (!success) {
      this.logger.log('Finish Request!');
      throw new BadRequestException(error);
    }
    this.logger.log('Finish Request!');

    return { msg: 'User Info Saved!' };
  }

  @Post('/save/address')
  @HttpCode(200)
  @UseGuards(ApiTokenGuard)
  async saveAddress(@Body() body: SaveAddressUserUsecaseInput): Promise<any> {
    this.logger.log('Request Received');
    this.logger.log('Send body to usecase!');
    const { success, error } = await this.saveAddressUser.exec(body);
    if (!success) {
      this.logger.log('Finish Request!');
      throw new BadRequestException(error);
    }
    this.logger.log('Finish Request!');

    return { msg: 'User address info saved!' };
  }

  @Post('/save/documents')
  @HttpCode(200)
  @UseGuards(ApiTokenGuard)
  async saveDocuments(
    @Body() body: SaveDocumentsUserUsecaseInput,
  ): Promise<any> {
    this.logger.log('Request Received');
    this.logger.log('Send body to usecase!');
    const { success, error } = await this.saveDocumentsUser.exec(body);
    if (!success) {
      this.logger.log('Finish Request!');
      throw new BadRequestException(error);
    }
    this.logger.log('Finish Request!');

    return { msg: 'User documents info saved!' };
  }
}
