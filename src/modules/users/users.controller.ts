import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: Users,
  })
  @ApiBody({ type: CreateUserDto })
  @ApiBadRequestResponse({
    description: 'Invalid data or user already exists.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all users successfully.',
    type: [Users],
  })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    description: 'Search term to filter users by name, email, or type',
  })
  @ApiQuery({
    name: 'orderField',
    required: false,
    description: 'Field to order by',
    enum: ['user_name', 'email', 'user_type'],
  })
  @ApiQuery({
    name: 'orderType',
    required: false,
    description: 'Order type (ASC or DESC)',
    enum: ['ASC', 'DESC'],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results per page',
    type: Number,
  })
  async findAll(
    @Query('searchTerm') searchTerm: string,
    @Query('orderField') orderField: string = 'user_name',
    @Query('orderType') orderType: 'ASC' | 'DESC' = 'ASC',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: Users[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    return this.usersService.findAll(
      searchTerm,
      orderField,
      orderType,
      page,
      limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved the user successfully.',
    type: Users,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or user not found.',
  })
  async findOne(@Param('id') id: string): Promise<Users> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user to update' })
  @ApiResponse({
    status: 200,
    description: 'Updated the user successfully.',
    type: Users,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiBadRequestResponse({
    description: 'Invalid ID format, data, or user not found.',
  })
  @ApiBody({ type: Users })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user to delete' })
  @ApiResponse({
    status: 204,
    description: 'Deleted the user successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or user not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
