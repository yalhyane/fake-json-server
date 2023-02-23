import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerTags } from '../common/utils/swagger.utils';
import MongooseClassSerializerInterceptor from '../common/serliazers/mongoose-class-serializer.interceptor';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Protected } from './decorators/protected.decorator';
import { AuthUser as CurrentUser } from './decorators/user.decorator';

@ApiTags(SwaggerTags.Authentication)
@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // login user
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({
    description: 'User logged-in successfully',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiBody({
    type: LoginUserDto,
  })
  async login(@Request() req): Promise<any> {
    return {
      ...(await this.authService.login(req.user)),
    };
  }

  // get user info
  @Protected()
  @Get('me')
  @ApiCreatedResponse({
    description: 'Get current user info',
    type: User,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized response',
  })
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() user): Promise<User | any> {
    return user;
  }

  // register user
  @Post('registration')
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request',
  })
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() createUserDto: CreateUserDto): Promise<User> {
    return (await this.usersService.createUser(createUserDto)) as User;
  }
}
