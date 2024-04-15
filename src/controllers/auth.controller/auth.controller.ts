import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '../../providers/services';
import { LoginDTO } from '../../dtos';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() data: LoginDTO) {
        return this.authService.authenticate(data.email, data.password);
    }
}
