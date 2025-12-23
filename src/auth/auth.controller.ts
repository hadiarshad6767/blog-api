import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshTokenAuthGuard } from './guards/refresh-token-auth/refresh-token-auth.guard';
import { GetCurrrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { GetCurrrentUser } from '../common/decorators/get-current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/login')
  signInLocal(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signInLocal(createAuthDto);
  }


  @Post('logout')
  logout(@GetCurrrentUserId()id:number) {
    console.log(id);
    return this.authService.logout(id);
  }

  @Public()
  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  refreshToken(@GetCurrrentUserId()id:number,@GetCurrrentUser('refreshToken')refreshToken:string) {

    return this.authService.refreshToken(id, refreshToken);
  }
}
