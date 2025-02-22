import { Controller, Post, Body, UnauthorizedException, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(
        @Body() body: { username: string; email: string; password: string },
        @Res({ passthrough: true }) res: Response,

    ) {
        const newUser = await this.authService.register(body);

        if (!newUser) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.authService.generateToken(newUser);

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
        });

        return { user: newUser };
    }

    @Post('login')
    async login(
        @Body() body: { username: string; password: string },
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.authService.validateUser(body.username, body.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.authService.generateToken(user);
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days
        });

        return { user };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('auth_token');
        return { message: 'Logged out' };
    }
}
