import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly generateTokensProviders: GenerateTokensProvider,
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    // Verify the refresh token using jwtService
    // Fetch user from the database
    // Generate the tokens
  }
}
