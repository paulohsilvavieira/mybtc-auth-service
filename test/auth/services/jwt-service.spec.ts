import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenService } from '../../../src/auth/services/jwt-service';

describe('JsonWebTokenService', () => {
  let jsonWebTokenService: JsonWebTokenService;
  let jwtServiceMock: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JsonWebTokenService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
      ],
    }).compile();

    jsonWebTokenService = module.get<JsonWebTokenService>(JsonWebTokenService);
    jwtServiceMock = module.get<JwtService>(JwtService);
  });

  describe('createToken()', () => {
    it('should create a valid JWT token with the provided data', async () => {
      const payload = { id: 1, name: 'user' };
      const token = 'token_jwt_valido';
      jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValue(token);

      const result = await jsonWebTokenService.createToken(payload);
      const expectedResult = {
        token,
      };
      expect(result).toEqual(expectedResult);
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(payload);
    });
  });
  describe('verifyToken()', () => {
    it('should return payload with valid token', async () => {
      const payload = { authorizationId: '12345' };
      const token = 'token';

      jest.spyOn(jwtServiceMock, 'verifyAsync').mockResolvedValue(payload);

      const result = await jsonWebTokenService.verifyToken(token);

      expect(result).toEqual({ isValid: true, payload });
    });

    it('should return throw when use invalid token', async () => {
      const token = 'invalidToken';

      jest.spyOn(jwtServiceMock, 'verifyAsync').mockImplementation(() => {
        throw new Error('User not found');
      });

      const result = await jsonWebTokenService.verifyToken(token);

      expect(result).toEqual({ isValid: false, payload: undefined });
    });
  });
});
