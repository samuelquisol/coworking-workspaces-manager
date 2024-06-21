import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservations } from './entities/reservation.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({
    status: 201,
    description: 'The reservation has been successfully created.',
    type: Reservations,
  })
  @ApiBody({ type: CreateReservationDto })
  @ApiBadRequestResponse({
    description: 'Invalid data or reservation already exists.',
  })
  async create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservations> {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all reservations' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all reservations successfully.',
    type: [Reservations],
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter reservations by user ID',
  })
  @ApiQuery({
    name: 'workspaceId',
    required: false,
    description: 'Filter reservations by workspace ID',
  })
  @ApiQuery({
    name: 'sessionId',
    required: false,
    description: 'Filter reservations by session ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter reservations by status',
  })
  @ApiQuery({
    name: 'orderField',
    required: false,
    description: 'Field to order by',
    enum: [
      'reservation_time',
      'status',
      'user_id',
      'workspace_id',
      'session_id',
    ],
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
    @Query('userId') userId?: string,
    @Query('workspaceId') workspaceId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('status') status?: string,
    @Query('orderField') orderField: string = 'reservation_time',
    @Query('orderType') orderType: 'ASC' | 'DESC' = 'ASC',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: Reservations[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    return this.reservationsService.findAll(
      userId,
      workspaceId,
      sessionId,
      status,
      orderField,
      orderType,
      page,
      limit,
    );
  }

  @Get(':reservation_id')
  @ApiOperation({ summary: 'Retrieve a reservation by ID' })
  @ApiParam({
    name: 'reservation_id',
    description: 'The ID of the reservation to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieved the reservation successfully.',
    type: Reservations,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or reservation not found.',
  })
  async findOne(
    @Param('reservation_id') reservation_id: string,
  ): Promise<Reservations> {
    return this.reservationsService.findOne(reservation_id);
  }

  @Delete(':id/cancel')
  @ApiOperation({ summary: 'Cancel a reservation by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the reservation to cancel' })
  @ApiResponse({
    status: 204,
    description: 'Canceled the reservation successfully',
  })
  async cancelReservation(@Param('id') id: string): Promise<void> {
    await this.reservationsService.cancelReservation(id);
  }

  @Delete(':reservation_id')
  @ApiOperation({ summary: 'Delete a reservation by ID' })
  @ApiParam({
    name: 'reservation_id',
    description: 'The ID of the reservation to delete',
  })
  @ApiResponse({
    status: 204,
    description: 'Deleted the reservation successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format or reservation not found.',
  })
  async remove(@Param('reservation_id') reservation_id: string): Promise<void> {
    return this.reservationsService.remove(reservation_id);
  }
}
