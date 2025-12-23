import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,  private configService: ConfigService, @InjectRepository(User) private usersRepository: Repository<User>) { }

  async getTokesn(id: number, email: string) {
  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(
      { sub: id, email },
      {
        secret: this.configService.getOrThrow('JWT_SECRET'),
        expiresIn: '15m',
      },
    ),
    this.jwtService.signAsync(
      { sub: id, email },
      {
        secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    ),
  ]);

  return { accessToken, refreshToken };
}

async signInLocal(createAuthDto: CreateAuthDto) {
  const { email, password } = createAuthDto;

  const user = await this.usersRepository.findOne({
    where: { email },
    select: ['id', 'email', 'password'],
  });

  if (!user) {
    throw new ForbiddenException('Access Denied');
  }

  const pwMatches = await bcrypt.compare(password, user.password);
  if (!pwMatches) {
    throw new ForbiddenException('Access Denied');
  }

  const tokens = await this.getTokesn(user.id, user.email);
  await this.updateRefreshToken(user.id, tokens.refreshToken);
  return tokens;
}
async updateRefreshToken(userId: number, refreshToken: string) {
  const hashedRt = await bcrypt.hash(refreshToken, 10);
  await this.usersRepository.update(userId, {
    hashedRefreshToken: hashedRt,
  });
}


  async logout(id:number) {


      await this.usersRepository.update(id, {
    hashedRefreshToken: null,
  });
  }

 async refreshToken(id: number, refreshToken: string) {

  const user = await this.usersRepository.findOne({
    where: { id },
    select: ['id', 'email', 'password','hashedRefreshToken'],
  });


  if (!user||!user.hashedRefreshToken) {
    throw new ForbiddenException('Access Denied');
  }

  const rtMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken??'');
  if (!rtMatches) {
    throw new ForbiddenException('Access Denied');
  }
    const tokens = await this.getTokesn(user.id, user.email);
  await this.updateRefreshToken(user.id, tokens.refreshToken);
  return tokens;

  }

  async validateJwtUser(userId: number) {
    const user = await this.usersRepository.findOneBy({id:userId});
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const currentUser = { id: user.id, roles: user.role };
    return currentUser;
  }

}
