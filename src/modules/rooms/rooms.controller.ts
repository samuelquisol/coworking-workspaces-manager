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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Rooms } from './entities/room.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Room' })
  @ApiResponse({
    status: 201,
    description: 'The Room has been successfully created.',
    type: Rooms,
  })
  @ApiBody({ type: CreateRoomDto })
  @ApiBadRequestResponse({
    description:
      'Invalid data or Room already exists with the same name and location.',
  })
  async create(@Body() createRoomDto: CreateRoomDto): Promise<Rooms> {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all Rooms' })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    description: 'Search term for filtering Rooms by name or location',
  })
  @ApiQuery({
    name: 'orderField',
    required: false,
    description: 'Field to order by',
    enum: ['room_name', 'location'],
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
  @ApiResponse({
    status: 200,
    description: 'Retrieved all Rooms successfully.',
    type: [Rooms],
  })
  async findAll(
    @Query('searchTerm') searchTerm: string,
    @Query('orderField') orderField: string = 'room_name',
    @Query('orderType') orderType: 'ASC' | 'DESC' = 'ASC',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: Rooms[]; total: number; page: number; lastPage: number }> {
    return this.roomsService.findAll(
      searchTerm,
      orderField,
      orderType,
      page,
      limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a Room by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the Room to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved the Room successfully.',
    type: Rooms,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or Room not found.',
  })
  async findOne(@Param('id') id: string): Promise<Rooms> {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Room by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the Room to update' })
  @ApiResponse({
    status: 200,
    description: 'Updated the Room successfully.',
    type: Rooms,
  })
  @ApiBody({ type: UpdateRoomDto })
  @ApiBadRequestResponse({
    description: 'Invalid ID format, data, or Room not found.',
  })
  @ApiBody({ type: Rooms })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Rooms> {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Room by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the Room to delete' })
  @ApiResponse({
    status: 204,
    description: 'Deleted the Room successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or Room not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.roomsService.remove(id);
  }
}
