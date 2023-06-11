import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { SignIn } from './protocols/usecases';
import { MockProxy, mock } from 'jest-mock-extended';

describe('AuthController', () => {
  let controller: AuthController;
  let signInUsecaseMock: MockProxy<SignIn>;
  beforeAll(() => {
    signInUsecaseMock = mock();
    signInUsecaseMock.exec.mockResolvedValue({
      token: 'validToken',
    });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: SignIn,
          useValue: signInUsecaseMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  test('Test SignIn User ', async () => {
    const result = await controller.signIn();
    expect(result).toEqual({
      token: 'validToken',
    });
    expect(signInUsecaseMock.exec).toHaveBeenCalledWith({
      email: 'email@email.com',
      password: '123456',
    });
  });
});
