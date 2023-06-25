import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenService } from './jwt-service';

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
      const dados = { id: 1, nome: 'Usuário' };
      const token = 'toke=n_jwt_valido';
      jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValue(token);

      const result = await jsonWebTokenService.createToken(dados);
      const expectedResult = {
        token,
      };
      expect(result).toEqual(expectedResult);
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(dados);
    });
  });
});
