import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Sessions } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Sessions> {
    const session = this.sessionsRepository.create(createSessionDto);
    return this.sessionsRepository.save(session);
  }

  async findAll({
    room_id,
    start_time,
    end_time,
    description,
    orderField = 'session_id',
    orderType = 'ASC',
    page = 1,
    limit = 10,
  }): Promise<{
    data: Sessions[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const whereClause: any = {};
    if (room_id) whereClause.room_id = room_id;
    if (start_time) whereClause.start_time = start_time;
    if (end_time) whereClause.end_time = end_time;
    if (description) whereClause.description = ILike(`%${description}%`);

    const [sessions, total] = await this.sessionsRepository.findAndCount({
      where: whereClause,
      order: { [orderField]: orderType },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: sessions,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(session_id: string): Promise<Sessions> {
    const session = await this.sessionsRepository.findOneBy({ session_id });
    if (!session) {
      throw new NotFoundException(`Session with ID ${session_id} not found`);
    }
    return session;
  }

  async update(
    session_id: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Sessions> {
    await this.sessionsRepository.update(session_id, updateSessionDto);
    const updatedSession = await this.sessionsRepository.findOneBy({
      session_id,
    });
    if (!updatedSession) {
      throw new NotFoundException(`Session with ID ${session_id} not found`);
    }
    return updatedSession;
  }

  async remove(session_id: string): Promise<void> {
    const result = await this.sessionsRepository.delete(session_id);
    if (result.affected === 0) {
      throw new NotFoundException(`Session with ID ${session_id} not found`);
    }
  }

  // Custom Queries

  async findMostOccupied(): Promise<any> {
    return this.sessionsRepository.query(`
      SELECT session_id, COUNT(*) as reservation_count
      FROM Reservations
      WHERE status = 'confirmed'
      GROUP BY session_id
      ORDER BY reservation_count DESC
    `);
  }

  async findMostAvailable(): Promise<any> {
    return this.sessionsRepository.query(`
      SELECT session_id, COUNT(*) as available_count
      FROM Workspaces
      WHERE workspace_id NOT IN (
          SELECT workspace_id
          FROM Reservations
          WHERE status = 'confirmed'
      )
      GROUP BY session_id
      ORDER BY available_count DESC
    `);
  }
}
