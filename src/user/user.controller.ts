import { BadRequestException, Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    async createUser(userDto: { email: string; username: string; password: string; role: string }): Promise<any> {
        if (Object.keys(userDto).length !== 4) {
            throw new BadRequestException('Invalid parameters');
        }
        return await this.userService.createUser(userDto);
    }

    async getUserById(userId: number): Promise<any> {
        if (!userId) {
            throw new BadRequestException('Invalid parameters');
        }
        return await this.userService.getUserById(userId);
    }

    async updateUser(
        userId: number,
        userDto: { username?: string, email?: string, password?: string, role?: string },
    ): Promise<any> {
        if (!Object.keys(userDto).length) {
            throw new BadRequestException('Invalid parameters');
        }
        return await this.userService.updateUser(userId, userDto);
    }

    async deleteUser(userId: number): Promise<any> {
        return await this.userService.deleteUser(userId);
    }
}
