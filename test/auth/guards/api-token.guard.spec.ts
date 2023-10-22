import { JwtProtocol } from '../../../src/auth/protocols/cryptography/jwt';
import { ApiTokenGuard } from '../../../src/auth/guards/api-token.guard';
import { mock, MockProxy } from 'jest-mock-extended';
import { TestingModule, Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
describe('ApiTokenGuard', () => {
  const createContextMock = (headers: any, params: any, body: any) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          get: (header: string) => headers[header],
          params,
          body,
        }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext);

  let jwtServiceMock: MockProxy<JwtProtocol>;
  let sut: ApiTokenGuard;
  beforeAll(() => {
    jwtServiceMock = mock();
    jwtServiceMock.verifyToken.mockResolvedValue({
      isValid: true,
      payload: {
        authenticationId: 'any_id',
      },
    });
  });
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ApiTokenGuard,

        {
          provide: JwtProtocol,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();
    sut = app.get(ApiTokenGuard);
  });
  test('should be defined', () => {
    expect(sut).toBeDefined();
  });
  test('should return false if header has a invalid token', async () => {
    const headers = {
      Authorization: 'invalid_token',
    };
    jwtServiceMock.verifyToken.mockResolvedValueOnce({
      isValid: false,
      payload: {},
    });
    const result = await sut.canActivate(createContextMock(headers, {}, {}));
    expect(result).toEqual(false);
  });
  test('should return true if header', async () => {
    const headers = {
      Authorization: 'valid_token',
    };

    const result = await sut.canActivate(createContextMock(headers, {}, {}));
    expect(result).toEqual(true);
  });
});
