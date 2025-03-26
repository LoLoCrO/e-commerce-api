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
}
