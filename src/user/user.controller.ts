/* Copyright 2024 Prokhor Kalinin

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { IsAdminGuard } from '../auth/guards/is-admin';
import { PagedEntities } from '../common/dtos/paged-entities.dto';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { PatchUserDto } from './dto/patch-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';


/**
 * Controller class for handling user-related API endpoints.
 */
@ApiTags('User Module')
@Controller('user')
export class UserController {
    /**
     * Constructor for the given class.
     *
     * @param {UserService} userService - An instance of the UserService class.
     */
    public constructor(private readonly userService: UserService) {
    }

    /**
     * Retrieves all users.
     *
     * @returns {Promise<User[]>} A promise that resolves to an array of User objects representing all users.
     */
    @ApiOperation({ summary: 'Get All Rarities' })
    @ApiOkResponse({ type: User, description: 'All Rarities', isArray: true })
    @ApiQuery({ name: 'page', required: false, description: 'Optional page number requested' })
    @ApiQuery({ name: 'limit', required: false, description: 'Optional page size requested' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Get('/')
    public async findAll(@Query('page') page?: number, @Query('limit') limit?: number): Promise<PagedEntities<User>> {
        return await this.userService.findAll(page, limit);
    }

    /**
     * Retrieves a single user by their ID.
     *
     * @param {number} id - The ID of the user.
     * @returns {Promise<User>} - A Promise that resolves to the retrieved user.
     */
    @ApiOperation({ summary: 'Get User Details' })
    @ApiParam({ name: 'id', description: 'Id of the requested user' })
    @ApiOkResponse({ type: User, description: 'Updated User' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard, IsAdminGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/:id')
    public async getOne(@Param('id') id: number): Promise<User> {
        return await this.userService.findOne(id);
    }

    /**
     * Registers a new user.
     *
     * @param {RegisterUserDto} user - The user object containing the information of the user to be registered.
     * @return {Promise<User>} - A promise that resolves to the registered user object.
     */
    @ApiBody({ type: User, description: 'User Data to Create' })
    @ApiOkResponse({ type: RegisterUserDto, description: 'Created User' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiOperation({ summary: 'Register a New User' })
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('/register')
    public async register(@Body() user: RegisterUserDto): Promise<User> {
        const response = await this.userService.create(user as User);
        delete response.password;
        return response;
    }

    /**
     * Create a new user.
     *
     * @param {User} user - The user object containing the information of the user to be registered.
     * @return {Promise<User>} - A promise that resolves to the registered user object.
     */
    @ApiBody({ type: User, description: 'User Data to Create' })
    @ApiOkResponse({ type: User, description: 'Created User' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiOperation({ summary: 'Create a New User' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard, IsAdminGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('/')
    public async create(@Body() user: User): Promise<User> {
        const response = await this.userService.create(user);
        delete response.password;
        return response;
    }

    @ApiBody({ type: PatchUserDto, description: 'User Fields to be updated' })
    @ApiOperation({ summary: 'Update User' })
    @ApiParam({ name: 'id', description: 'Id of the User to be updated' })
    @ApiOkResponse({ type: User, description: 'Updated User' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Patch('/:id')
    public async update(@Param('id') id: number, @Body() user: PatchUserDto): Promise<User> {
        return await this.userService.patchUser(id, user);
    }

    /**
     * Deletes a user with the specified ID.
     *
     * @param {number} id - The ID of the user to delete.
     * @return {Promise<void>} A promise that resolves when the user is deleted.
     */
    @ApiOperation({ summary: 'Delete User' })
    @ApiParam({ name: 'id', description: 'Id of the user to be deleted' })
    @ApiOkResponse({ description: 'No Data' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard, IsAdminGuard)
    @Delete('/:id')
    public async deleteOne(@Param() id: number): Promise<void> {
        await this.userService.delete(id);
    }
}
