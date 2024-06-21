import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Reservations } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservationsRepository: Repository<Reservations>,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservations> {
    const reservation =
      this.reservationsRepository.create(createReservationDto);
    return this.reservationsRepository.save(reservation);
  }

  async findAll(
    userId?: string,
    workspaceId?: string,
    sessionId?: string,
    status?: string,
    orderField: string = 'reservation_time',
    orderType: 'ASC' | 'DESC' = 'ASC',
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Reservations[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const where = {};
    if (userId) where['user_id'] = userId;
    if (workspaceId) where['workspace_id'] = workspaceId;
    if (sessionId) where['session_id'] = sessionId;
    if (status) where['status'] = ILike(`%${status}%`);

    const [reservations, total] =
      await this.reservationsRepository.findAndCount({
        where,
        order: { [orderField]: orderType },
        skip: (page - 1) * limit,
        take: limit,
      });

    return {
      data: reservations,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(reservation_id: string): Promise<Reservations> {
    const reservation = await this.reservationsRepository.findOneBy({
      reservation_id,
    });
    if (!reservation) {
      throw new NotFoundException(
        `Reservation with ID ${reservation_id} not found`,
      );
    }
    return reservation;
  }

  async cancelReservation(reservation_id: string): Promise<void> {
    const reservation = await this.reservationsRepository.findOneBy({
      reservation_id,
    });
    if (!reservation) {
      throw new NotFoundException(
        `Reservation with ID ${reservation_id} not found`,
      );
    }
    reservation.status = 'Canceled';
    await this.reservationsRepository.save(reservation);
  }

  async remove(reservation_id: string): Promise<void> {
    const result = await this.reservationsRepository.delete(reservation_id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Reservation with ID ${reservation_id} not found`,
      );
    }
  }
}
