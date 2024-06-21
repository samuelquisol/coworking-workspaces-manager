import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { Sessions } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiResponse({
    status: 201,
    description: 'The session has been successfully created.',
    type: Sessions,
  })
  @ApiBody({ type: CreateSessionDto })
  async create(@Body() createSessionDto: CreateSessionDto): Promise<Sessions> {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all sessions' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all sessions successfully.',
    type: [Sessions],
  })
  @ApiQuery({
    name: 'room_id',
    required: false,
    description: 'Filter sessions by room ID',
  })
  @ApiQuery({
    name: 'start_time',
    required: false,
    description: 'Filter sessions by start time',
  })
  @ApiQuery({
    name: 'end_time',
    required: false,
    description: 'Filter sessions by end time',
  })
  @ApiQuery({
    name: 'description',
    required: false,
    description: 'Filter sessions by description',
  })
  @ApiQuery({
    name: 'orderField',
    required: false,
    description: 'Field to order by',
    enum: ['session_id', 'room_id', 'start_time', 'end_time', 'description'],
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
    @Query('room_id') room_id?: string,
    @Query('start_time') start_time?: string,
    @Query('end_time') end_time?: string,
    @Query('description') description?: string,
    @Query('orderField') orderField?: string,
    @Query('orderType') orderType?: 'ASC' | 'DESC',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{
    data: Sessions[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const result = await this.sessionsService.findAll({
      room_id,
      start_time,
      end_time,
      description,
      orderField,
      orderType,
      page,
      limit,
    });
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a session by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the session to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved the session successfully.',
    type: Sessions,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or session not found.',
  })
  async findOne(@Param('id') id: string): Promise<Sessions> {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a session by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the session to update' })
  @ApiResponse({
    status: 200,
    description: 'Updated the session successfully.',
    type: Sessions,
  })
  @ApiBody({ type: UpdateSessionDto })
  @ApiBadRequestResponse({
    description: 'Invalid ID format, data, or session not found.',
  })
  @ApiBody({ type: Sessions })
  async update(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ): Promise<Sessions> {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a session by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the session to delete' })
  @ApiResponse({
    status: 204,
    description: 'Deleted the session successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or session not found.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.sessionsService.remove(id);
  }
}
