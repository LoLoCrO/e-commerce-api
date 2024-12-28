import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    async register(userDto: { username: string; email: string; password: string }): Promise<any> {
        const { username, email, password } = userDto;

        const existingEmail = await this.prisma.user.findUnique({ where: { email } });
        const existingUsername = await this.prisma.user.findUnique({ where: { username } });
        if (existingEmail) {
            throw new ConflictException('Email already in use');
        } else if (existingUsername) {
            throw new ConflictException('Username already in use');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await this.prisma.user.create({
            data: { username, email, password: hashedPassword },
        });

        const token = this.jwtService.sign({ userId: newUser.id, email: newUser.email });

        return { user: newUser, token };
    }

    async registerViaAuth0(externalUserDto: { email: string }) {
        const { email } = externalUserDto;

        const response = await firstValueFrom(
            this.httpService.post(
                `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
                {
                    email,
                    connection: 'google-oauth2', // TODO: specify the provider
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
                    },
                },
            ),
        );

        return response.data;
    }

    async login(username: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({ userId: user.id, email: user.email });

        return { user, token };
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (user && await bcrypt.compare(password, user.password)) {
            return { userId: user.id, username: user.username, role: user.role };
        }
        return null;
    }

    async generateToken(user: any): Promise<string> {
        const payload = { username: user.username, sub: user.userId, roles: user.roles };
        return this.jwtService.sign(payload);
    }

    async verifyToken(token: string): Promise<any> {
        return this.jwtService.verify(token);
    }
}
