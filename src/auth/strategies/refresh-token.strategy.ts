import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express'; 

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy,'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
     secretOrKey: configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
     passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any) {
  const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
  return {
    userId: Number(payload.sub),
    email: payload.email,
    refreshToken,
  };
}

}
