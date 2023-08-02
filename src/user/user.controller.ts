import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';

import {
  CreateUserProtocol,
  CreateUserUsecaseInput,
  SaveAddressUserProtocol,
  SaveAddressUserUsecaseInput,
  SaveDocumentsUserProtocol,
  SaveDocumentsUserUsecaseInput,
} from './protocols/usecases';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly createUser: CreateUserProtocol,
    private readonly saveAddressUser: SaveAddressUserProtocol,
    private readonly saveDocumentsUser: SaveDocumentsUserProtocol,
  ) {}
  @Post('/save/basicInfo')
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
  async saveDocuments(
    @Body() body: SaveDocumentsUserUsecaseInput,
  ): Promise<any> {
    this.logger.log('Request Received');
    this.logger.log('Send body to usecase!');
    const { success, error } = await this.saveDocumentsUser.exec(body);
    if (!success) {
      this.logger.log('Finish Request!');
      console.log(error);
      throw new BadRequestException(error);
    }
    this.logger.log('Finish Request!');

    return { msg: 'User documents info saved!' };
  }
}
