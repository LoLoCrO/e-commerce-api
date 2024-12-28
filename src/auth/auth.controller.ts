import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.authService.generateToken(user);
        return { accessToken: token };
    }

    @Post('register')
    async register(@Body() body: { username: string; email: string; password: string }) {
        return await this.authService.register(body);
    }
}
